export type Client = {
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
  avatarUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateClientInput = {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  city?: string
  country?: string
  website?: string
  notes?: string
}

export type UpdateClientInput = Partial<CreateClientInput> & {
  isActive?: boolean
}
