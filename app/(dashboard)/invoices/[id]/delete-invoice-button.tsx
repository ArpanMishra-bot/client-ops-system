"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteInvoice } from "@/modules/invoices/actions"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"

interface DeleteInvoiceButtonProps {
  invoiceId: string
  invoiceNumber: string
}

export function DeleteInvoiceButton({ invoiceId, invoiceNumber }: DeleteInvoiceButtonProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteInvoice(invoiceId)
    
    if (result.success) {
      toast.success("Invoice deleted successfully")
      router.push("/invoices")
    } else {
      toast.error(result.error || "Failed to delete invoice")
      setDialogOpen(false)
    }
    setIsDeleting(false)
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
        title="Delete invoice"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDelete}
        itemName={invoiceNumber}
        itemType="invoice"
        isDeleting={isDeleting}
      />
    </>
  )
}
