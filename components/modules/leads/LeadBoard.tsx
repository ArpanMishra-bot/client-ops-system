"use client"

import { useState } from "react"
import { updateLeadStatus } from "@/modules/leads/actions"
import type { Lead, LeadStatus } from "@/modules/leads/types"
import LeadCard from "./LeadCard"

type Stage = {
  status: LeadStatus
  label: string
  color: string
  bg: string
}

type Props = {
  leads: Lead[]
  stages: Stage[]
}

export default function LeadBoard({ leads, stages }: Props) {
  const [localLeads, setLocalLeads] = useState(leads)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function getLeadsForStage(status: LeadStatus) {
    return localLeads.filter((l) => l.status === status)
  }

  function handleDragStart(leadId: string) {
    setDraggingId(leadId)
  }

  async function handleDrop(status: LeadStatus) {
    if (!draggingId) return

    setLocalLeads((prev) =>
      prev.map((l) => (l.id === draggingId ? { ...l, status } : l))
    )

    setDraggingId(null)

    try {
      await updateLeadStatus(draggingId, status)
    } catch (err) {
      console.error("Failed to update lead status", err)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = getLeadsForStage(stage.status)
        const totalValue = stageLeads.reduce((s, l) => s + (l.value ?? 0), 0)
        return (
          <div
            key={stage.status}
            className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg active:shadow-lg transition-all duration-200"
            onDrop={() => handleDrop(stage.status)}
            onDragOver={handleDragOver}
          >
            {/* Column Header */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stage.bg} ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {stageLeads.length}
                  </span>
                </div>
                {totalValue > 0 && (
                  <span className="text-xs font-medium text-gray-500">
                    ${totalValue.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Column Content */}
            <div className="p-2 min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto">
              {stageLeads.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  Drop leads here
                </div>
              ) : (
                <div className="space-y-2">
                  {stageLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onDragStart={() => handleDragStart(lead.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
