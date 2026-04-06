// modules/projects/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createProjectSchema, updateProjectSchema } from "./schemas"
import type { ProjectStatus, TaskStatus } from "./types"
import { logActivity } from "@/lib/activity"

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
        name: validated.data.name,
        clientId: validated.data.clientId,
        description: validated.data.description,
        status: validated.data.status as any,
        startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
        budget: validated.data.budget,
        userId,
      },
    })
    revalidatePath("/projects")
    
    // Log activity
    await logActivity({
      type: "project",
      action: "created",
      itemId: project.id,
      itemName: project.name,
    })
    
    return { success: true, data: project, message: `✅ Project "${project.name}" created successfully` }
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
        name: validated.data.name,
        clientId: validated.data.clientId,
        description: validated.data.description,
        status: validated.data.status as any,
        startDate: validated.data.startDate ? new Date(validated.data.startDate) : null,
        dueDate: validated.data.dueDate ? new Date(validated.data.dueDate) : null,
        budget: validated.data.budget,
      },
    })
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    
    // Log activity
    await logActivity({
      type: "project",
      action: "updated",
      itemId: project.id,
      itemName: project.name,
    })
    
    return { success: true, data: project, message: `✅ Project "${project.name}" updated successfully` }
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
      data: { status: status as any },
    })
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    
    // Log activity
    await logActivity({
      type: "project",
      action: "updated",
      itemId: project.id,
      itemName: project.name,
      details: `Status changed to ${status}`,
    })
    
    return { success: true, data: project, message: `✅ Project "${project.name}" status updated to ${status}` }
  } catch (error) {
    console.error("Update project status error:", error)
    return { success: false, error: "Failed to update project status" }
  }
}

export async function deleteProject(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const project = await db.project.findFirst({ where: { id, userId } })
    const projectName = project?.name || "Project"
    
    await db.project.delete({
      where: { id, userId },
    })
    
    // Log activity
    await logActivity({
      type: "project",
      action: "deleted",
      itemId: id,
      itemName: projectName,
    })
    
    revalidatePath("/projects")
    return { success: true, message: `✅ Project "${projectName}" deleted successfully` }
  } catch (error) {
    console.error("Delete project error:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

// Task actions
export async function createTask(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const task = await db.task.create({
      data: {
        title: input.title,
        projectId: input.projectId,
        status: input.status || "TODO",
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        userId,
      },
    })
    revalidatePath(`/projects/${input.projectId}`)
    
    // Log activity
    await logActivity({
      type: "task",
      action: "created",
      itemId: task.id,
      itemName: task.title,
    })
    
    return { success: true, data: task, message: `✅ Task "${task.title}" created successfully` }
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
      data: { status: status as any },
    })
    revalidatePath(`/projects/${projectId}`)
    
    // Log activity
    await logActivity({
      type: "task",
      action: "updated",
      itemId: task.id,
      itemName: task.title,
      details: `Status changed to ${status}`,
    })
    
    return { success: true, data: task, message: `✅ Task "${task.title}" status updated to ${status}` }
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
    
    // Log activity
    await logActivity({
      type: "task",
      action: "deleted",
      itemId: id,
      itemName: taskTitle,
    })
    
    revalidatePath(`/projects/${projectId}`)
    return { success: true, message: `✅ Task "${taskTitle}" deleted successfully` }
  } catch (error) {
    console.error("Delete task error:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTaskTitle(id: string, title: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  if (!title || title.trim().length < 2) {
    return { success: false, error: "Task title must be at least 2 characters" }
  }

  try {
    const task = await db.task.update({
      where: { id, userId },
      data: { title: title.trim() },
    })
    revalidatePath(`/projects/${projectId}`)
    
    // Log activity
    await logActivity({
      type: "task",
      action: "updated",
      itemId: task.id,
      itemName: task.title,
      details: "Title updated",
    })
    
    return { success: true, data: task, message: `✅ Task updated successfully` }
  } catch (error) {
    console.error("Update task title error:", error)
    return { success: false, error: "Failed to update task title" }
  }
}
