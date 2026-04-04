"use client"

import { useState } from "react"
import type { Lead, LeadStatus } from "@/modules/leads/types"
import { LEAD_STAGES } from "@/modules/leads/types"
import { updateLeadStatus } from "@/modules/leads/actions"
import { Building, DollarSign, ChevronRight } from "lucide-react"
import Link from "next/link"

type Props = {
  lead: Lead
  onDragStart: () => void
}

const priorityConfig = {
  LOW: { label: "Low", class: "bg-gray-100 text-gray-600" },
  MEDIUM: { label: "Medium", class: "bg-yellow-50 text-yellow-600" },
  HIGH: { label: "High", class: "bg-red-50 text-red-600" },
}

export default function LeadCard({ lead, onDragStart }: Props) {
  const priority = priorityConfig[lead.priority]
  const [showMove, setShowMove] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMove(status: LeadStatus) {
    setLoading(true)
    setShowMove(false)
    try {
      await updateLeadStatus(lead.id, status)
    } catch (err) {
      console.error("Failed to move lead", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-lg active:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
      >
    
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/leads/${lead.id}`}>
            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {lead.name}
            </p>
          </Link>
          {lead.company && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-3 w-3 text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500 truncate">{lead.company}</p>
            </div>
          )}
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${priority.class}`}>
          {priority.label}
        </span>
      </div>

      {lead.value && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
          <DollarSign className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-medium text-gray-700">
            ${lead.value.toLocaleString()}
          </span>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-50 relative">
        <button
          onClick={() => setShowMove(!showMove)}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors w-full"
        >
          <ChevronRight className="h-3 w-3" />
          <span>{loading ? "Moving..." : "Move to"}</span>
        </button>

        {showMove && (
          <div className="absolute left-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
            {LEAD_STAGES.filter((s) => s.status !== lead.status).map((stage) => (
              <button
                key={stage.status}
                onClick={() => handleMove(stage.status)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className={`font-medium ${stage.color}`}>{stage.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
