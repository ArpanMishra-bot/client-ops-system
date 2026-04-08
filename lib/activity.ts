// lib/activity.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export type ActivityType = "client" | "lead" | "project" | "task" | "invoice" | "reminder"
export type ActivityAction = "created" | "updated" | "deleted" | "converted" | "paid" | "completed" | "moved"

export async function logActivity({
  type,
  action,
  itemId,
  itemName,
  details,
}: {
  type: ActivityType
  action: ActivityAction
  itemId: string
  itemName: string
  details?: string
}) {
  const { userId } = await auth()
  if (!userId) return

  try {
    await db.activity.create({
      data: {
        userId,
        type,
        action,
        itemId,
        itemName,
        details: details || null,
      },
    })
  } catch (error) {
    
  }
}
