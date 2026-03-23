"use client"

import { useState } from "react"
import { convertLeadToClient } from "@/modules/leads/convert"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ConvertToClientButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  async function handleConvert() {
    setLoading(true)
    try {
      await convertLeadToClient(leadId)
    } catch (err) {
      console.error(err)
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Convert to client?</span>
        <button
          onClick={handleConvert}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Converting..." : "Yes, convert"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
    >
      <Users className="h-4 w-4" />
      Convert to Client
    </button>
  )
}
