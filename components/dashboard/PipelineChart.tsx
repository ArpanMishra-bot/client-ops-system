"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PipelineChartProps {
  data: Array<{ stage: string; value: number; count: number }>
}

// Stage colors matching your badge colors
const stageColors: Record<string, string> = {
  "New": "#3b82f6",        // Blue
  "Contacted": "#8b5cf6",  // Purple
  "Qualified": "#eab308",  // Yellow
  "Proposal": "#f97316",   // Orange
  "Negotiation": "#f59e0b", // Amber/Orange
  "Won": "#22c55e",        // Green
  "Lost": "#6b7280"        // Gray
}

export default function PipelineChart({ data }: PipelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        No leads in pipeline yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tickFormatter={(value) => `$${value}`} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={70} />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Deal Value']}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={stageColors[entry.stage] || "#6b7280"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
