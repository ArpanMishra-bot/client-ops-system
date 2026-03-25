import { z } from "zod"

export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const

export type LeadStatus = typeof leadStatuses[number]

export const createLeadSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  status: z.enum(leadStatuses).default("NEW"),
  value: z.number().min(0, "Value must be 0 or greater").optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export const updateLeadSchema = createLeadSchema.partial()

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
