"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CreateClientInput, UpdateClientInput } from "./types"

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

export async function createClient(input: CreateClientInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const client = await db.client.create({
      data: { ...input, userId },
    })
    revalidatePath("/clients")
    return { success: true, data: client }
  } catch (error) {
    return { success: false, error: "Failed to create client" }
  }
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const client = await db.client.update({
      where: { id, userId },
      data: input,
    })
    revalidatePath("/clients")
    revalidatePath(`/clients/${id}`)
    return { success: true, data: client }
  } catch (error) {
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
    return { success: false, error: "Failed to delete client" }
  }
}
