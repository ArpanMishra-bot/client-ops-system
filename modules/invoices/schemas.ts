import { z } from "zod"

export const invoiceStatuses = ["DRAFT", "SENT", "VIEWED", "PAID", "OVERDUE"] as const

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0.01, "Rate must be greater than 0"),
})

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional().nullable(),
  number: z.string().min(1, "Invoice number is required"),
  dueDate: z.string().min(1, "Due date is required"),
  currency: z.string().default("INR"),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
})

export const updateInvoiceSchema = createInvoiceSchema.partial()

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>

// Input types (before defaults are applied) for action parameters
export type InvoiceFormInput = z.input<typeof createInvoiceSchema>
export type UpdateInvoiceFormInput = z.input<typeof updateInvoiceSchema>
