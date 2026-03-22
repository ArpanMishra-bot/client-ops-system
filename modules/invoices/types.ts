export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"

export type Invoice = {
  id: string
  userId: string
  clientId: string
  projectId: string | null
  number: string
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: string
  notes: string | null
  terms: string | null
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type InvoiceItem = {
  id: string
  invoiceId: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export type CreateInvoiceInput = {
  clientId: string
  projectId?: string
  number: string
  dueDate: string
  currency?: string
  notes?: string
  terms?: string
  items: {
    description: string
    quantity: number
    rate: number
  }[]
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string, color: string, bg: string }> = {
  DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  SENT: { label: "Sent", color: "text-blue-600", bg: "bg-blue-50" },
  VIEWED: { label: "Viewed", color: "text-purple-600", bg: "bg-purple-50" },
  PAID: { label: "Paid", color: "text-green-600", bg: "bg-green-50" },
  OVERDUE: { label: "Overdue", color: "text-red-600", bg: "bg-red-50" },
  CANCELLED: { label: "Cancelled", color: "text-gray-400", bg: "bg-gray-50" },
}
