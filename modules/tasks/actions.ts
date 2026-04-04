// modules/tasks/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { createTaskSchema, updateTaskSchema } from "./schemas"

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

export async function createTask(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Zod validation
  const validated = createTaskSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage,
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  try {
    const task = await db.task.create({
      data: {
        title: validated.data.title,
        projectId: validated.data.projectId,
        status: validated.data.status || "TODO",
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
        userId,
      },
    })
    return { success: true, data: task, message: `✅ Task "${task.title}" created successfully` }
  } catch (error) {
    console.error("Create task error:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTaskStatus(id: string, status: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Validate status is valid enum
  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]
  if (!validStatuses.includes(status)) {
    return { success: false, error: "Invalid task status" }
  }

  try {
    const task = await db.task.update({
      where: { id, userId },
      data: { status: status as any },
    })
    return { success: true, data: task, message: `✅ Task moved to ${status.replace("_", " ")}` }
  } catch (error) {
    console.error("Update task status error:", error)
    return { success: false, error: "Failed to update task status" }
  }
}

export async function deleteTask(id: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const task = await db.task.findFirst({ where: { id, userId } })
    const taskTitle = task?.title || "Task"
    
    await db.task.delete({ where: { id, userId } })
    return { success: true, message: `✅ Task "${taskTitle}" deleted successfully` }
  } catch (error) {
    console.error("Delete task error:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTaskTitle(id: string, title: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // Validate title
  if (!title || title.trim().length < 2) {
    return { success: false, error: "Task title must be at least 2 characters" }
  }

  try {
    const task = await db.task.update({
      where: { id, userId },
      data: { title: title.trim() },
    })
    return { success: true, data: task, message: `✅ Task updated successfully` }
  } catch (error) {
    console.error("Update task title error:", error)
    return { success: false, error: "Failed to update task title" }
  }
}
