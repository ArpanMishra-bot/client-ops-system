"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { createInvoiceSchema, updateInvoiceSchema } from "./schemas"
import type { InvoiceStatus } from "./types"

export async function getInvoices() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const invoices = await db.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  })

  const today = new Date()
  return invoices.map((invoice) => {
    if (invoice.status !== "PAID" && invoice.dueDate < today) {
      return { ...invoice, status: "OVERDUE" as InvoiceStatus }
    }
    return invoice
  })
}

export async function getInvoiceById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const invoice = await db.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: true },
  })

  if (!invoice) return null

  const today = new Date()
  if (invoice.status !== "PAID" && invoice.dueDate < today) {
    return { ...invoice, status: "OVERDUE" as InvoiceStatus }
  }
  return invoice
}

export async function createInvoice(input: any) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const validated = createInvoiceSchema.safeParse(input)
  if (!validated.success) {
    const errorMessage = validated.error.issues[0]?.message || "Validation failed"
    return { 
      success: false, 
      error: errorMessage
    }
  }

  try {
    const subtotal = validated.data.items.reduce(
      (sum, item) => sum + item.quantity * item.rate, 
      0
    )
    const total = subtotal

    const invoice = await db.invoice.create({
      data: {
        userId,
        clientId: validated.data.clientId,
        number: validated.data.number,
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: new Date(validated.data.dueDate),
        subtotal,
        tax: 0,
        discount: 0,
        total,
        currency: validated.data.currency || "USD",
        notes: validated.data.notes || null,
        terms: validated.data.terms || null,
        items: {
          create: validated.data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
    })

    revalidatePath("/invoices")
    return { success: true, data: invoice }
  } catch (error) {
    console.error("Create invoice error:", error)
    return { success: false, error: "Failed to create invoice" }
  }
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const data: any = { status }
    if (status === "PAID") data.paidAt = new Date()

    const invoice = await db.invoice.update({
      where: { id, userId },
      data,
    })

    revalidatePath("/invoices")
    revalidatePath(`/invoices/${id}`)
    return { success: true, data: invoice }
  } catch (error) {
    console.error("Update invoice status error:", error)
    return { success: false, error: "Failed to update invoice status" }
  }
}

export async function deleteInvoice(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    await db.invoice.delete({
      where: { id, userId },
    })
    revalidatePath("/invoices")
    return { success: true }
  } catch (error) {
    console.error("Delete invoice error:", error)
    return { success: false, error: "Failed to delete invoice" }
  }
}

export async function generateInvoiceNumber(userId: string) {
  const count = await db.invoice.count({ where: { userId } })
  return `INV-${String(count + 1).padStart(4, "0")}`
}

export async function duplicateInvoice(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const original = await getInvoiceById(id)
  if (!original) return { success: false, error: "Invoice not found" }

  const count = await db.invoice.count({ where: { userId } })
  const newNumber = `INV-${String(count + 1).padStart(4, "0")}`

  try {
    const newInvoice = await db.invoice.create({
      data: {
        userId,
        clientId: original.clientId,
        number: newNumber,
        status: "DRAFT",
        issueDate: new Date(),
        dueDate: new Date(original.dueDate),
        subtotal: original.subtotal,
        tax: original.tax,
        discount: original.discount,
        total: original.total,
        currency: original.currency,
        notes: original.notes,
        terms: original.terms,
        items: {
          create: original.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
    })

    revalidatePath("/invoices")
    return { success: true, data: newInvoice }
  } catch (error) {
    console.error("Duplicate invoice error:", error)
    return { success: false, error: "Failed to duplicate invoice" }
  }
}
