"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function convertLeadToClient(leadId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Get the lead
  const lead = await db.lead.findFirst({
    where: { id: leadId, userId },
  })

  if (!lead) {
    throw new Error("Lead not found")
  }

  // Create a new client from lead data
  const client = await db.client.create({
    data: {
      userId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      isActive: true,
    },
  })

  // Update the lead to mark it as converted
  await db.lead.update({
    where: { id: leadId },
    data: {
      convertedToId: client.id,
    },
  })

  revalidatePath("/leads")
  revalidatePath("/clients")

  return client
}
