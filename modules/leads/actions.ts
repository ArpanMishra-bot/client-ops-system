"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CreateLeadInput, UpdateLeadInput, LeadStatus } from "./types"

export async function getLeads() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.lead.findMany({
    where: { userId },
    orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  })
}

export async function createLead(input: CreateLeadInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const lead = await db.lead.create({
    data: { ...input, userId },
  })

  revalidatePath("/leads")
  return lead
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const lead = await db.lead.update({
    where: { id, userId },
    data: input,
  })

  revalidatePath("/leads")
  return lead
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const lead = await db.lead.update({
    where: { id, userId },
    data: { status },
  })

  revalidatePath("/leads")
  return lead
}

export async function deleteLead(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.lead.delete({
    where: { id, userId },
  })

  revalidatePath("/leads")
}
