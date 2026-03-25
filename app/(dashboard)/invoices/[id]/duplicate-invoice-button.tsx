"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { duplicateInvoice } from "@/modules/invoices/actions"

interface DuplicateInvoiceButtonProps {
  invoiceId: string
}

export function DuplicateInvoiceButton({ invoiceId }: DuplicateInvoiceButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDuplicate = async () => {
    setLoading(true)
    const result = await duplicateInvoice(invoiceId)
    
    if (result.success) {
      toast.success("Invoice duplicated successfully")
      router.push(`/invoices/${result.data.id}`)
    } else {
      toast.error(result.error || "Failed to duplicate invoice")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
      title="Duplicate invoice"
    >
      <Copy className="h-5 w-5" />
    </button>
  )
}
