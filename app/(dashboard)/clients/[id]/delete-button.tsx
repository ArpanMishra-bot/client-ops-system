"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteClient } from "@/modules/clients/actions"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"

interface DeleteButtonProps {
  clientId: string
  clientName: string
}

export function DeleteButton({ clientId, clientName }: DeleteButtonProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteClient(clientId)
    
    if (result.success) {
      toast.success("Client deleted successfully")
      router.push("/clients")
    } else {
      toast.error(result.error || "Failed to delete client")
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
        itemName={clientName}
        itemType="client"
        isDeleting={isDeleting}
      />
    </>
  )
}
