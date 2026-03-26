export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const

export type LeadStatus = typeof LEAD_STATUSES[number]

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const
export type LeadPriority = typeof LEAD_PRIORITIES[number]

export interface Lead {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  company: string | null
  position: string | null
  status: LeadStatus
  value: number | null
  priority: LeadPriority
  source: string | null
  notes: string | null
  convertedToId: string | null
  order?: number
  createdAt: Date
  updatedAt: Date
}

export const LEAD_STAGES = [
  { status: "NEW", label: "New", color: "text-blue-600", bg: "bg-blue-50" },
  { status: "CONTACTED", label: "Contacted", color: "text-purple-600", bg: "bg-purple-50" },
  { status: "QUALIFIED", label: "Qualified", color: "text-yellow-600", bg: "bg-yellow-50" },
  { status: "PROPOSAL", label: "Proposal", color: "text-orange-600", bg: "bg-orange-50" },
  { status: "NEGOTIATION", label: "Negotiation", color: "text-amber-600", bg: "bg-amber-50" },
  { status: "WON", label: "Won", color: "text-green-600", bg: "bg-green-50" },
  { status: "LOST", label: "Lost", color: "text-red-600", bg: "bg-red-50" },
]

export type CreateLeadInput = Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateLeadInput = Partial<CreateLeadInput>
