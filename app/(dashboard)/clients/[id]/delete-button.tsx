"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteClient } from "@/modules/clients/actions"

interface DeleteButtonProps {
  clientId: string
  clientName: string
}

export function DeleteButton({ clientId, clientName }: DeleteButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${clientName}"? This action cannot be undone.`)
    
    if (!confirmed) return

    const result = await deleteClient(clientId)
    
    if (result.success) {
      toast.success("Client deleted successfully")
      router.push("/clients")
    } else {
      toast.error(result.error || "Failed to delete client")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}
