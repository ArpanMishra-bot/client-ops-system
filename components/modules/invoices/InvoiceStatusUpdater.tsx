"use client"

import { useState } from "react"
import { updateInvoiceStatus } from "@/modules/invoices/actions"
import type { InvoiceStatus } from "@/modules/invoices/types"
import { INVOICE_STATUS_CONFIG } from "@/modules/invoices/types"
import { ChevronDown } from "lucide-react"

type Props = {
  invoiceId: string
  currentStatus: InvoiceStatus
}

export default function InvoiceStatusUpdater({ invoiceId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUpdate(newStatus: InvoiceStatus) {
    setLoading(true)
    setShowMenu(false)
    try {
      await updateInvoiceStatus(invoiceId, newStatus)
      setStatus(newStatus)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const config = INVOICE_STATUS_CONFIG[status]

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <span className={`${config.color}`}>{config.label}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
          {Object.entries(INVOICE_STATUS_CONFIG)
            .filter(([s]) => s !== status)
            .map(([s, config]) => (
              <button
                key={s}
                onClick={() => handleUpdate(s as InvoiceStatus)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <span className={`font-medium ${config.color}`}>{config.label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
