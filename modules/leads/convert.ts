"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function convertLeadToClient(leadId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const lead = await db.lead.findFirst({
    where: { id: leadId, userId },
  })

  if (!lead) throw new Error("Lead not found")

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

  await db.lead.update({
    where: { id: leadId },
    data: {
      convertedAt: new Date(),
      convertedToId: client.id,
    },
  })

  revalidatePath("/leads")
  revalidatePath("/clients")
  redirect(`/clients/${client.id}`)
}
