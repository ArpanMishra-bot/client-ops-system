"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createReminderSchema, updateReminderSchema } from "./schemas"

export async function getReminders() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.reminder.findMany({
    where: { userId },
    include: { client: true, lead: true, project: true },
    orderBy: { dueDate: "asc" },
  })
}

export async function getReminderById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.reminder.findFirst({
    where: { id, userId },
    include: { client: true, lead: true, project: true },
  })
}

export async function createReminder(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = createReminderSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const reminder = await db.reminder.create({
      data: {
        userId,
        title: validated.data.title,
        description: validated.data.description || null,
        type: validated.data.type as any,
        dueDate: new Date(validated.data.dueDate),
        clientId: validated.data.clientId || null,
        leadId: validated.data.leadId || null,
        projectId: validated.data.projectId || null,
      },
    })

    revalidatePath("/reminders")
    return { success: true, data: reminder }
  } catch (error) {
    console.error("Create reminder error:", error)
    return { success: false, error: "Failed to create reminder" }
  }
}

export async function updateReminder(id: string, input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = updateReminderSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const reminder = await db.reminder.update({
      where: { id, userId },
      data: {
        title: validated.data.title,
        description: validated.data.description,
        type: validated.data.type as any,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : undefined,
        clientId: validated.data.clientId,
        leadId: validated.data.leadId,
        projectId: validated.data.projectId,
      },
    })

    revalidatePath("/reminders")
    return { success: true, data: reminder }
  } catch (error) {
    console.error("Update reminder error:", error)
    return { success: false, error: "Failed to update reminder" }
  }
}

export async function toggleReminder(id: string, isDone: boolean) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.reminder.update({
      where: { id, userId },
      data: { isDone },
    })
    revalidatePath("/reminders")
    return { success: true }
  } catch (error) {
    console.error("Toggle reminder error:", error)
    return { success: false, error: "Failed to update reminder" }
  }
}

export async function deleteReminder(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.reminder.delete({ where: { id, userId } })
    revalidatePath("/reminders")
    return { success: true }
  } catch (error) {
    console.error("Delete reminder error:", error)
    return { success: false, error: "Failed to delete reminder" }
  }
}
