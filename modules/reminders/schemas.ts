import { z } from "zod"

export const reminderTypes = ["FOLLOW_UP", "MEETING", "DEADLINE", "PAYMENT"] as const

export const createReminderSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: z.string().optional().nullable(),
  type: z.enum(reminderTypes).default("FOLLOW_UP"),
  dueDate: z.string().min(1, "Due date is required"),
  clientId: z.string().optional().nullable(),
  leadId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
})

export const updateReminderSchema = createReminderSchema.partial()

export type CreateReminderInput = z.infer<typeof createReminderSchema>
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>
