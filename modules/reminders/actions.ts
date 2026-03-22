"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function getReminders() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.reminder.findMany({
    where: { userId },
    include: { client: true, lead: true, project: true },
    orderBy: { dueDate: "asc" },
  })
}

export async function createReminder(input: {
  title: string
  description?: string
  type: string
  dueDate: string
  clientId?: string
  leadId?: string
  projectId?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const reminder = await db.reminder.create({
    data: {
      userId,
      title: input.title,
      description: input.description || null,
      type: input.type as any,
      dueDate: new Date(input.dueDate),
      clientId: input.clientId || null,
      leadId: input.leadId || null,
      projectId: input.projectId || null,
    },
  })

  revalidatePath("/reminders")
  return reminder
}

export async function toggleReminder(id: string, isDone: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.reminder.update({
    where: { id, userId },
    data: { isDone },
  })

  revalidatePath("/reminders")
}

export async function deleteReminder(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.reminder.delete({ where: { id, userId } })
  revalidatePath("/reminders")
}
