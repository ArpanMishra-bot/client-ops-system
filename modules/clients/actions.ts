"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function getClients() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getClientById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.client.findFirst({
    where: { id, userId },
  })
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  website?: string | null
  notes?: string | null
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const client = await db.client.create({
      data: { ...data, userId },
    })
    revalidatePath("/clients")
    return { success: true, data: client }
  } catch (error) {
    console.error("Create client error:", error)
    return { success: false, error: "Failed to create client" }
  }
}

export async function updateClient(id: string, data: {
  name?: string
  email?: string
  phone?: string | null
  company?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  website?: string | null
  notes?: string | null
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const client = await db.client.update({
      where: { id, userId },
      data,
    })
    revalidatePath("/clients")
    revalidatePath(`/clients/${id}`)
    return { success: true, data: client }
  } catch (error) {
    console.error("Update client error:", error)
    return { success: false, error: "Failed to update client" }
  }
}

export async function deleteClient(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.client.delete({
      where: { id, userId },
    })
    revalidatePath("/clients")
    return { success: true }
  } catch (error) {
    console.error("Delete client error:", error)
    return { success: false, error: "Failed to delete client" }
  }
}
