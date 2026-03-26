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

export type CreateClientInput = Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateClientInput = Partial<CreateClientInput>
