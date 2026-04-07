// components/modules/leads/PipelineMiniChart.tsx
"use client"

import { LEAD_STAGES } from "@/modules/leads/types"

interface PipelineMiniChartProps {
  leads: any[]
}

// Explicit color mapping for each stage (background colors)
const stageColors: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-purple-500",
  QUALIFIED: "bg-yellow-500",
  PROPOSAL: "bg-orange-500",
  NEGOTIATION: "bg-amber-500",
  WON: "bg-green-500",
  LOST: "bg-red-400",
}

// Lighter versions for the text
const stageTextColors: Record<string, string> = {
  NEW: "text-blue-600",
  CONTACTED: "text-purple-600",
  QUALIFIED: "text-yellow-600",
  PROPOSAL: "text-orange-600",
  NEGOTIATION: "text-amber-600",
  WON: "text-green-600",
  LOST: "text-red-600",
}

export default function PipelineMiniChart({ leads }: PipelineMiniChartProps) {
  // Calculate total value per stage
  const stageValues = LEAD_STAGES.map((stage) => ({
    stage: stage.label,
    status: stage.status,
    value: leads
      .filter((lead) => lead.status === stage.status)
      .reduce((sum, lead) => sum + (lead.value || 0), 0),
    color: stageColors[stage.status] || "bg-gray-500",
    textColor: stageTextColors[stage.status] || "text-gray-600",
  }))

  const totalValue = stageValues.reduce((sum, s) => sum + s.value, 0)
  const maxValue = Math.max(...stageValues.map((s) => s.value), 1)

  if (totalValue === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <p className="text-sm text-gray-400">Add deal values to leads to see pipeline analytics</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Pipeline Value by Stage</h3>
          <p className="text-xs text-gray-500 mt-0.5">Total: ${totalValue.toLocaleString()}</p>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {stageValues.filter(s => s.value > 0).length} active stages
        </div>
      </div>

      <div className="space-y-3">
        {stageValues.map((stage) => {
          const percentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0
          const widthPercentage = totalValue > 0 ? (stage.value / totalValue) * 100 : 0

          if (stage.value === 0) return null

          return (
            <div key={stage.status} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${stage.textColor}`}>
                    {stage.stage}
                  </span>
                  <span className="text-xs text-gray-400">${stage.value.toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {widthPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${stage.color} opacity-70 group-hover:opacity-100`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend hint */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center">
          Bar length shows relative value within pipeline • Hover for more detail
        </p>
      </div>
    </div>
  )
}
