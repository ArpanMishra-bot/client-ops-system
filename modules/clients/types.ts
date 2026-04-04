// modules/clients/types.ts
import type { CreateClientInput as ZodCreateInput, UpdateClientInput as ZodUpdateInput } from "./schemas"

// Re-export from schemas for type consistency
export type CreateClientInput = ZodCreateInput
export type UpdateClientInput = ZodUpdateInput

export interface Client {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  country: string | null
  website: string | null
  notes: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
