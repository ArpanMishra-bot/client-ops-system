"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getPendingTasks() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.task.findMany({
    where: {
      userId,
      status: { not: "DONE" }
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: [
      { dueDate: "asc" },
      { createdAt: "desc" }
    ]
  })
}
