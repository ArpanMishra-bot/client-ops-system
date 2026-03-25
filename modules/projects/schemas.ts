import { z } from "zod"

export const projectStatuses = [
  "PLANNING",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "ON_HOLD",
] as const

export const createProjectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .min(2, "Project name must be at least 2 characters"),
  description: z.string().optional().nullable(),
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(projectStatuses).default("PLANNING"),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  budget: z.number().min(0, "Budget must be 0 or greater").optional().nullable(),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
