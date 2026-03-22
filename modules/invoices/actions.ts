"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { CreateInvoiceInput, InvoiceStatus } from "./types"

export async function getInvoices() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.invoice.findMany({
    where: { userId },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function getInvoiceById(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return await db.invoice.findFirst({
    where: { id, userId },
    include: { client: true, items: true, project: true },
  })
}

export async function createInvoice(input: CreateInvoiceInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const total = subtotal

  const invoice = await db.invoice.create({
    data: {
      userId,
      clientId: input.clientId,
      projectId: input.projectId || null,
      number: input.number,
      status: "DRAFT",
      issueDate: new Date(),
      dueDate: new Date(input.dueDate),
      subtotal,
      tax: 0,
      discount: 0,
      total,
      currency: input.currency || "USD",
      notes: input.notes || null,
      terms: input.terms || null,
      items: {
        create: input.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })),
      },
    },
  })

  revalidatePath("/invoices")
  return invoice
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const data: any = { status }
  if (status === "PAID") data.paidAt = new Date()

  const invoice = await db.invoice.update({
    where: { id, userId },
    data,
  })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${id}`)
  return invoice
}

export async function generateInvoiceNumber(userId: string) {
  const count = await db.invoice.count({ where: { userId } })
  return `INV-${String(count + 1).padStart(4, "0")}`
}
