"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PipelineChartProps {
  data: Array<{ stage: string; value: number; count: number }>
}

// Stage colors matching your badge colors
const stageColors: Record<string, string> = {
  "New": "#6366f1",
  "Contacted": "#8b5cf6",
  "Qualified": "#f59e0b",
  "Proposal": "#f97316",
  "Negotiation": "#ec489a",
  "Won": "#10b981",
  "Lost": "#6b7280"
}

export default function PipelineChart({ data }: PipelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No leads in pipeline yet</p>
        <p className="text-xs text-gray-400 mt-1">Add leads with deal values to see your pipeline</p>
      </div>
    )
  }

  const totalValue = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total pipeline value</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Deals</p>
          <p className="text-lg font-semibold text-gray-900">{data.reduce((sum, d) => sum + d.count, 0)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#6b7280' }} width={70} />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Deal Value']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px'
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={stageColors[entry.stage] || "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
