// modules/tasks/schemas.ts
import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, "Task title is required")
    .min(2, "Task title must be at least 2 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project ID is required"),
})

export const updateTaskSchema = createTaskSchema.partial()

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
