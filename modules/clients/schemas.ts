// modules/clients/schemas.ts
import { z } from "zod"

export const createClientSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  website: z.string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true
      return val.startsWith("http://") || val.startsWith("https://")
    }, "Website must start with http:// or https://"),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
