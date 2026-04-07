// components/modules/leads/PipelineMiniChart.tsx
"use client"

import { LEAD_STAGES } from "@/modules/leads/types"

interface PipelineMiniChartProps {
  leads: any[]
}

export default function PipelineMiniChart({ leads }: PipelineMiniChartProps) {
  // Calculate total value per stage
  const stageValues = LEAD_STAGES.map((stage) => ({
    stage: stage.label,
    status: stage.status,
    value: leads
      .filter((lead) => lead.status === stage.status)
      .reduce((sum, lead) => sum + (lead.value || 0), 0),
    color: stage.color.replace("text-", "bg-"),
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
                  <span className={`text-xs font-medium ${stage.color.replace("bg-", "text-")}`}>
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
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${stage.color.replace("text-", "bg-")} opacity-70 group-hover:opacity-100`}
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
