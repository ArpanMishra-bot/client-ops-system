"use client"

import { useState } from "react"
import type { Lead, LeadStatus } from "@/modules/leads/types"
import { updateLeadStatus } from "@/modules/leads/actions"
import { LEAD_STAGES } from "@/modules/leads/types"
import { Building, DollarSign, ChevronDown } from "lucide-react"
import Link from "next/link"

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

const priorityConfig = {
  LOW: { label: "Low", class: "bg-gray-100 text-gray-600" },
  MEDIUM: { label: "Medium", class: "bg-yellow-50 text-yellow-600" },
  HIGH: { label: "High", class: "bg-red-50 text-red-600" },
}

function MobileLeadCard({ lead, stages }: { lead: Lead; stages: Stage[] }) {
  const [showMove, setShowMove] = useState(false)
  const [loading, setLoading] = useState(false)
  const priority = priorityConfig[lead.priority]
  const stage = stages.find((s) => s.status === lead.status)

  async function handleMove(status: LeadStatus) {
    setLoading(true)
    setShowMove(false)
    try {
      await updateLeadStatus(lead.id, status)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/leads/${lead.id}`}>
            <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
          </Link>
          {lead.company && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-500">{lead.company}</p>
            </div>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${priority.class}`}>
          {priority.label}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-3">
          {stage && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stage.bg} ${stage.color}`}>
              {stage.label}
            </span>
          )}
          {lead.value && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">${lead.value.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMove(!showMove)}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <span>{loading ? "Moving..." : "Move"}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {showMove && (
            <div className="absolute right-0 bottom-6 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36">
              {stages.filter((s) => s.status !== lead.status).map((stage) => (
                <button
                  key={stage.status}
                  onClick={() => handleMove(stage.status)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <span className={`font-medium ${stage.color}`}>{stage.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LeadMobileList({ leads, stages }: Props) {
  const [activeStage, setActiveStage] = useState<LeadStatus | "ALL">("ALL")

  const filteredLeads =
    activeStage === "ALL" ? leads : leads.filter((l) => l.status === activeStage)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveStage("ALL")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeStage === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          All ({leads.length})
        </button>
        {stages.map((stage) => {
          const count = leads.filter((l) => l.status === stage.status).length
          return (
            <button
              key={stage.status}
              onClick={() => setActiveStage(stage.status)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeStage === stage.status
                  ? "bg-gray-900 text-white"
                  : `${stage.bg} ${stage.color}`
              }`}
            >
              {stage.label} ({count})
            </button>
          )
        })}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">No leads in this stage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <MobileLeadCard key={lead.id} lead={lead} stages={stages} />
          ))}
        </div>
      )}
    </div>
  )
}
