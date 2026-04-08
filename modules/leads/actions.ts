// modules/leads/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createLeadSchema, updateLeadSchema } from "./schemas"
import type { LeadStatus } from "./types"
import { logActivity } from "@/lib/activity"

export async function getLeads() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.lead.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })
}

export async function getLeadById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.lead.findFirst({
    where: { id, userId },
  })
}

export async function createLead(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = createLeadSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const lead = await db.lead.create({
      data: { ...validated.data, userId },
    })
    revalidatePath("/leads")
    
    // Log activity
    await logActivity({
      type: "lead",
      action: "created",
      itemId: lead.id,
      itemName: lead.name,
    })
    
    return { success: true, data: lead, message: `✅ Lead "${lead.name}" created successfully` }
  } catch (error) {
    
    return { success: false, error: "Failed to create lead" }
  }
}

export async function updateLead(id: string, input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = updateLeadSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const lead = await db.lead.update({
      where: { id, userId },
      data: validated.data,
    })
    revalidatePath("/leads")
    
    // Log activity
    await logActivity({
      type: "lead",
      action: "updated",
      itemId: lead.id,
      itemName: lead.name,
    })
    
    return { success: true, data: lead, message: `✅ Lead "${lead.name}" updated successfully` }
  } catch (error) {
    
    return { success: false, error: "Failed to update lead" }
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const lead = await db.lead.update({
      where: { id, userId },
      data: { status },
    })
    revalidatePath("/leads")
    
    // Log activity
    await logActivity({
      type: "lead",
      action: "moved",
      itemId: lead.id,
      itemName: lead.name,
      details: `Status changed to ${status}`,
    })
    
    return { success: true, data: lead, message: `✅ Lead "${lead.name}" status updated to ${status}` }
  } catch (error) {
    
    return { success: false, error: "Failed to update lead status" }
  }
}

export async function deleteLead(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const lead = await db.lead.findFirst({ where: { id, userId } })
    const leadName = lead?.name || "Lead"
    
    await db.lead.delete({
      where: { id, userId },
    })
    
    // Log activity
    await logActivity({
      type: "lead",
      action: "deleted",
      itemId: id,
      itemName: leadName,
    })
    
    revalidatePath("/leads")
    return { success: true, message: `✅ Lead "${leadName}" deleted successfully` }
  } catch (error) {
    console.error("Delete lead error:", error)
    return { success: false, error: "Failed to delete lead" }
  }
}
