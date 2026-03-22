"use client"

import type { Lead } from "@/modules/leads/types"
import { Building, DollarSign } from "lucide-react"
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg border border-gray-100 p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all hover:border-gray-200 group"
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
    </div>
  )
}
