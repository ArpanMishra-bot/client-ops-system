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

  const client = await db.client.create({
    data: { ...input, userId },
  })

  revalidatePath("/clients")
  return client
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const client = await db.client.update({
    where: { id, userId },
    data: input,
  })

  revalidatePath("/clients")
  revalidatePath(`/clients/${id}`)
  return client
}

export async function deleteClient(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.client.delete({
    where: { id, userId },
  })

  revalidatePath("/clients")
}
