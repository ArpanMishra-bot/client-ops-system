"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createLeadSchema, updateLeadSchema } from "./schemas"
import type { LeadStatus } from "./types"

export async function getLeads() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.lead.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
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
    return { success: true, data: lead }
  } catch (error) {
    console.error("Create lead error:", error)
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
    return { success: true, data: lead }
  } catch (error) {
    console.error("Update lead error:", error)
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
    return { success: true, data: lead }
  } catch (error) {
    console.error("Update lead status error:", error)
    return { success: false, error: "Failed to update lead status" }
  }
}

export async function deleteLead(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.lead.delete({
      where: { id, userId },
    })
    revalidatePath("/leads")
    return { success: true }
  } catch (error) {
    console.error("Delete lead error:", error)
    return { success: false, error: "Failed to delete lead" }
  }
}
