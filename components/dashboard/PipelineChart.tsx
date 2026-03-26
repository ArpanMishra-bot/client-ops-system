"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PipelineChartProps {
  data: Array<{ stage: string; value: number; count: number }>
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
        <Bar dataKey="value" fill="#111827" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
