// modules/clients/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createClientSchema, updateClientSchema } from "./schemas"
import type { CreateClientInput, UpdateClientInput } from "./types"
import { logActivity } from "@/lib/activity"
import { PAGE_SIZE, buildPaginated } from "@/lib/pagination"

export async function getClients() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getClientsPage(page: number) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [total, items] = await Promise.all([
    db.client.count({ where: { userId } }),
    db.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])
  return buildPaginated(items, total, page)
}

export async function getClientById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.client.findFirst({
    where: { id, userId },
  })
}

export async function createClient(input: CreateClientInput, options?: { allowDuplicateEmail?: boolean }) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = createClientSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage,
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  if (!options?.allowDuplicateEmail) {
    const existing = await db.client.findFirst({
      where: { userId, email: { equals: validated.data.email, mode: "insensitive" } },
      select: { name: true },
    })
    if (existing) {
      return {
        success: false,
        duplicateEmail: true,
        error: `A client with this email already exists (${existing.name}).`,
      }
    }
  }

  try {
    const client = await db.client.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone || null,
        company: validated.data.company || null,
        address: validated.data.address || null,
        city: validated.data.city || null,
        country: validated.data.country || null,
        website: validated.data.website || null,
        notes: validated.data.notes || null,
        isActive: validated.data.isActive ?? true,
        userId,
      },
    })
    revalidatePath("/clients")
    
    // Log activity
    await logActivity({
      type: "client",
      action: "created",
      itemId: client.id,
      itemName: client.name,
    })
    
    return { success: true, data: client, message: `✅ Client "${client.name}" created successfully` }
  } catch (error) {
    
    return { success: false, error: "Failed to create client" }
  }
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = updateClientSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage,
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  try {
    const client = await db.client.update({
      where: { id, userId },
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        company: validated.data.company,
        address: validated.data.address,
        city: validated.data.city,
        country: validated.data.country,
        website: validated.data.website,
        notes: validated.data.notes,
        isActive: validated.data.isActive,
      },
    })
    revalidatePath("/clients")
    revalidatePath(`/clients/${id}`)
    
    // Log activity
    await logActivity({
      type: "client",
      action: "updated",
      itemId: client.id,
      itemName: client.name,
    })
    
    return { success: true, data: client, message: `✅ Client "${client.name}" updated successfully` }
  } catch (error) {
    
    return { success: false, error: "Failed to update client" }
  }
}

export async function deleteClient(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const client = await db.client.findFirst({ where: { id, userId } })
    const clientName = client?.name || "Client"
    
    await db.client.delete({
      where: { id, userId },
    })
    
    // Log activity
    await logActivity({
      type: "client",
      action: "deleted",
      itemId: id,
      itemName: clientName,
    })
    
    revalidatePath("/clients")
    return { success: true, message: `✅ Client "${clientName}" deleted successfully` }
  } catch (error) {
  
    return { success: false, error: "Failed to delete client" }
  }
}
