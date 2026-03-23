"use client"

import { useState } from "react"
import { convertLeadToClient } from "@/modules/leads/convert"
import { Users } from "lucide-react"

export default function ConvertToClientButton({ leadId }: { leadId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleConvert() {
    if (!confirm("Convert this lead to a client? Their information will be copied to a new client profile.")) return
    setLoading(true)
    try {
      await convertLeadToClient(leadId)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConvert}
      disabled={loading}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      <Users className="h-4 w-4" />
      {loading ? "Converting..." : "Convert to Client"}
    </button>
  )
}
