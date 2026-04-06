"use client"

import { useState } from "react"
import { updateLeadStatus } from "@/modules/leads/actions"
import { LEAD_STAGES } from "@/modules/leads/types"
import { Check, ChevronDown, Layers } from "lucide-react"
import { toast } from "sonner"

interface BulkStatusUpdateProps {
  leads: any[]
  selectedLeads: Set<string>
  onClearSelection: () => void
}

export default function BulkStatusUpdate({ leads, selectedLeads, onClearSelection }: BulkStatusUpdateProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      onClearSelection()
    } else {
      // Select all - need to add all leads to selectedLeads
      // This is handled in parent
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedLeads.size === 0) {
      toast.error("No leads selected")
      return
    }

    setIsUpdating(true)
    let successCount = 0
    let errorCount = 0

    for (const leadId of selectedLeads) {
      const result = await updateLeadStatus(leadId, newStatus as any)
      if (result.success) {
        successCount++
      } else {
        errorCount++
      }
    }

    setShowStatusMenu(false)
    onClearSelection()
    
    if (successCount > 0) {
      toast.success(`Updated ${successCount} lead${successCount !== 1 ? 's' : ''} to ${newStatus}`)
    }
    if (errorCount > 0) {
      toast.error(`Failed to update ${errorCount} lead${errorCount !== 1 ? 's' : ''}`)
    }
    
    setIsUpdating(false)
  }

  if (leads.length === 0) return null

  return (
    <div className="flex items-center gap-3">
      {/* Selected Count */}
      {selectedLeads.size > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {selectedLeads.size} selected
          </span>
          
          {/* Bulk Update Button */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={isUpdating}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors active:scale-95"
            >
              <Layers className="h-4 w-4" />
              <span>{isUpdating ? "Updating..." : "Update Status"}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {LEAD_STAGES.map((stage) => (
                  <button
                    key={stage.status}
                    onClick={() => handleBulkStatusUpdate(stage.status)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className={`font-medium ${stage.color}`}>{stage.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
