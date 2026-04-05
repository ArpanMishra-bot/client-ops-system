"use client"

import { useState } from "react"
import { convertLeadToClient } from "@/modules/leads/convert"
import { Users, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ConvertToClientButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const router = useRouter()

  async function handleConvert() {
    setLoading(true)
    try {
      const result = await convertLeadToClient(leadId)
      if (result.success) {
        setClientId(result.clientId!)
        toast.success(result.message || "Lead converted to client successfully")
      } else {
        toast.error(result.error || "Failed to convert lead")
        setShowConfirm(false)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to convert lead")
    } finally {
      setLoading(false)
    }
  }

  if (clientId) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(`/projects/new?clientId=${clientId}`)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Briefcase className="h-4 w-4" />
          Create Project
        </button>
        <button
          onClick={() => router.push(`/clients/${clientId}`)}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all active:scale-95"
        >
          <Users className="h-4 w-4" />
          View Client
        </button>
      </div>
    )
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Convert to client?</span>
        <button
          onClick={handleConvert}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 active:scale-95"
        >
          {loading ? "Converting..." : "Yes, convert"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all active:scale-95"
    >
      <Users className="h-4 w-4" />
      Convert to Client
    </button>
  )
}
