"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteLead } from "@/modules/leads/actions"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"

interface DeleteLeadButtonProps {
  leadId: string
  leadName: string
}

export function DeleteLeadButton({ leadId, leadName }: DeleteLeadButtonProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteLead(leadId)
    
    if (result.success) {
      toast.success("Lead deleted successfully")
      router.push("/leads")
    } else {
      toast.error(result.error || "Failed to delete lead")
      setDialogOpen(false)
    }
    setIsDeleting(false)
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <DeleteConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDelete}
        itemName={leadName}
        itemType="lead"
        isDeleting={isDeleting}
      />
    </>
  )
}
