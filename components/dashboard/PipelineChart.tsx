"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PipelineChartProps {
  data: Array<{ stage: string; value: number }>
}

const formatXAxis = (value: string) => value
const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const hasData = data.some(d => d.value > 0)

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 shadow-inner">
          <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No pipeline data available yet</p>
        <p className="text-xs text-gray-400 mt-1">Add leads and projects to see pipeline stages</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="glass-card p-3 min-w-[140px] shadow-lg">
          <p className="text-xs font-semibold gradient-text mb-1">{payload[0].payload.stage}</p>
          <p className="text-lg font-bold text-gray-900">{formatYAxis(value)}</p>
          <p className="text-xs text-gray-500 mt-1">Deal value</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
        <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.05)" }} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1000}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#pipelineGradient-${index})`}
              style={{ transition: "filter 0.2s", cursor: "pointer" }}
              onMouseEnter={(e: any) => { e.target.style.filter = "brightness(1.1)" }}
              onMouseLeave={(e: any) => { e.target.style.filter = "brightness(1)" }}
            />
          ))}
        </Bar>
        <defs>
          {data.map((_, index) => (
            <linearGradient key={`grad-${index}`} id={`pipelineGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          ))}
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
