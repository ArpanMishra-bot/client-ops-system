"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createProjectSchema, updateProjectSchema } from "./schemas"
import type { ProjectStatus, TaskStatus } from "./types"

export async function getProjects() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.project.findMany({
    where: { userId },
    include: { client: true, tasks: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getProjectById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.project.findFirst({
    where: { id, userId },
    include: { client: true, tasks: { orderBy: { order: "asc" } } },
  })
}

export async function createProject(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = createProjectSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const project = await db.project.create({
      data: {
        ...validated.data,
        userId,
        startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
      },
    })
    revalidatePath("/projects")
    return { success: true, data: project }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(id: string, input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = updateProjectSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const project = await db.project.update({
      where: { id, userId },
      data: {
        ...validated.data,
        startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
      },
    })
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    return { success: true, data: project }
  } catch (error) {
    console.error("Update project error:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const project = await db.project.update({
      where: { id, userId },
      data: { status },
    })
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    return { success: true, data: project }
  } catch (error) {
    console.error("Update project status error:", error)
    return { success: false, error: "Failed to update project status" }
  }
}

export async function deleteProject(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.project.delete({
      where: { id, userId },
    })
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

// Task actions (keeping existing but adding return format)
export async function createTask(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const task = await db.task.create({
      data: {
        ...input,
        userId,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      },
    })
    revalidatePath(`/projects/${input.projectId}`)
    return { success: true, data: task }
  } catch (error) {
    console.error("Create task error:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const task = await db.task.update({
      where: { id, userId },
      data: { status },
    })
    revalidatePath(`/projects/${projectId}`)
    return { success: true, data: task }
  } catch (error) {
    console.error("Update task status error:", error)
    return { success: false, error: "Failed to update task status" }
  }
}

export async function deleteTask(id: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.task.delete({ where: { id, userId } })
    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Delete task error:", error)
    return { success: false, error: "Failed to delete task" }
  }
}
