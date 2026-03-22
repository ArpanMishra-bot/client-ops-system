"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CreateProjectInput, CreateTaskInput, ProjectStatus, TaskStatus } from "./types"

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

export async function createProject(input: CreateProjectInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const project = await db.project.create({
    data: {
      ...input,
      userId,
      startDate: input.startDate ? new Date(input.startDate) : null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  })

  revalidatePath("/projects")
  return project
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const project = await db.project.update({
    where: { id, userId },
    data: { status },
  })

  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
  return project
}

export async function createTask(input: CreateTaskInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const task = await db.task.create({
    data: {
      ...input,
      userId,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  })

  revalidatePath(`/projects/${input.projectId}`)
  return task
}

export async function updateTaskStatus(id: string, status: TaskStatus, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const task = await db.task.update({
    where: { id, userId },
    data: { status },
  })

  revalidatePath(`/projects/${projectId}`)
  return task
}

export async function deleteTask(id: string, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await db.task.delete({ where: { id, userId } })
  revalidatePath(`/projects/${projectId}`)
}
