import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url("Invalid URL — include https://").optional().or(z.literal("")),
  notes: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>
