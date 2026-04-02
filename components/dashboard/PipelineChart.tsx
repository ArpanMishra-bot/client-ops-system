// components/dashboard/PipelineChart.tsx
"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PipelineChartProps {
  data: Array<{ stage: string; value: number }>
}

const STAGE_COLORS = {
  "Lead": "#6366f1",
  "Proposal": "#818cf8",
  "Negotiation": "#a78bfa",
  "Contract": "#8b5cf6",
  "Closed Won": "#10b981",
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          {/* Fixed: subtle gray grid, NO black border */}
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          
          <XAxis 
            dataKey="stage" 
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
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
            }}
          />
          
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.stage as keyof typeof STAGE_COLORS] || "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Fixed: Percentages rounded to whole numbers */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-2 border-t border-gray-100">
        {data.map((entry) => {
          const percentage = total === 0 ? 0 : Math.round((entry.value / total) * 100)
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
