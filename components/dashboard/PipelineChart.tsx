// components/dashboard/PipelineChart.tsx
"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PipelineChartProps {
  data: Array<{ stage: string; value: number }>
}

const STAGE_COLORS = {
  "Lead": "#6366f1", // indigo-500
  "Proposal": "#818cf8", // indigo-400
  "Negotiation": "#a78bfa", // violet-400
  "Contract": "#8b5cf6", // violet-500
  "Closed Won": "#10b981", // emerald-500
}

export default function PipelineChart({ data }: PipelineChartProps) {
  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Round percentage to whole number for tooltip
  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barSize={60}
          barGap={8}
        >
          {/* Subtle grid lines only - no thick borders */}
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="stage" 
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), "Pipeline Value"]}
            labelFormatter={(label) => `Stage: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            cursor={{ fill: "#f9fafb" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={STAGE_COLORS[entry.stage as keyof typeof STAGE_COLORS] || "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend with percentages - whole numbers only */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-2 border-t border-gray-100">
        {data.map((entry) => {
          const percentage = getPercentage(entry.value, total)
          return (
            <div key={entry.stage} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: STAGE_COLORS[entry.stage as keyof typeof STAGE_COLORS] || "#6366f1" }}
              />
              <span className="text-xs text-gray-600">{entry.stage}</span>
              <span className="text-xs font-medium text-gray-900">{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
