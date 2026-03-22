"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createInvoice } from "@/modules/invoices/actions"
import type { Client } from "@/modules/clients/types"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

type LineItem = {
  description: string
  quantity: number
  rate: number
}

export default function NewInvoiceForm({
  clients,
  invoiceNumber,
}: {
  clients: Client[]
  invoiceNumber: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, rate: 0 },
  ])

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)

  function addItem() {
    setItems([...items, { description: "", quantity: 1, rate: 0 }])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setItems(items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await createInvoice({
        clientId: formData.get("clientId") as string,
        number: invoiceNumber,
        dueDate: formData.get("dueDate") as string,
        currency: "USD",
        notes: formData.get("notes") as string,
        terms: formData.get("terms") as string,
        items,
      })
      router.push("/invoices")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Invoice Number</label>
            <input value={invoiceNumber} readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Client *</label>
            <select name="clientId" required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Due Date *</label>
            <input name="dueDate" type="date" required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Line Items</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
            <span className="col-span-6">Description</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2">Rate</span>
            <span className="col-span-2">Amount</span>
          </div>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <input
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Service description"
                className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                min="1"
                className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="number"
                value={item.rate}
                onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                min="0"
                className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  ${(item.quantity * item.rate).toLocaleString()}
                </span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <Plus className="h-4 w-4" />
          Add Line Item
        </button>
        <div className="border-t border-gray-100 pt-4 flex justify-end">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-8">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-base font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Additional Info</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea name="notes" rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Thank you for your business..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Terms</label>
          <textarea name="terms" rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Payment due within 30 days..." />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Creating..." : "Create Invoice"}
        </button>
        <Link href="/invoices"
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
