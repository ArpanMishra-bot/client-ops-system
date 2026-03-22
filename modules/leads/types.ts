export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST"

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH"

export type Lead = {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  company: string | null
  position: string | null
  source: string | null
  status: LeadStatus
  priority: LeadPriority
  value: number | null
  notes: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export type CreateLeadInput = {
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  source?: string
  status?: LeadStatus
  priority?: LeadPriority
  value?: number
  notes?: string
}

export type UpdateLeadInput = Partial<CreateLeadInput> & {
  order?: number
}

export const LEAD_STAGES: {
  status: LeadStatus
  label: string
  color: string
  bg: string
}[] = [
  { status: "NEW", label: "New", color: "text-blue-600", bg: "bg-blue-50" },
  { status: "CONTACTED", label: "Contacted", color: "text-purple-600", bg: "bg-purple-50" },
  { status: "QUALIFIED", label: "Qualified", color: "text-yellow-600", bg: "bg-yellow-50" },
  { status: "PROPOSAL", label: "Proposal", color: "text-orange-600", bg: "bg-orange-50" },
  { status: "NEGOTIATION", label: "Negotiation", color: "text-red-600", bg: "bg-red-50" },
  { status: "WON", label: "Won", color: "text-green-600", bg: "bg-green-50" },
  { status: "LOST", label: "Lost", color: "text-gray-600", bg: "bg-gray-100" },
]
