"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

interface PipelineChartProps {
  data: Array<{ stage: string; value: number }>
}

// Format Y-axis values
const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

// Format tooltip values
const formatTooltipValue = (value: number) => {
  return `$${value.toLocaleString()}`
}

// Map stage names to display names
const formatStageName = (stage: string) => {
  const stageMap: Record<string, string> = {
    'new': 'New',
    'contacted': 'Contacted',
    'qualified': 'Qualified',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'won': 'Won',
    'lost': 'Lost'
  }
  return stageMap[stage.toLowerCase()] || stage
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const [animated, setAnimated] = useState(false)
  
  useEffect(() => {
    setAnimated(true)
  }, [])
  
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No pipeline data yet</p>
        <p className="text-xs text-gray-400 mt-1">Add leads to see pipeline value</p>
      </div>
    )
  }
  
  // Format data with proper stage names
  const formattedData = data.map(item => ({
    ...item,
    stage: formatStageName(item.stage),
    value: item.value || 0
  }))
  
  // Calculate total for percentage
  const total = formattedData.reduce((sum, item) => sum + item.value, 0)
  
  // Custom tooltip with glass effect
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
      
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-indigo-200 rounded-xl shadow-lg p-3 min-w-[140px]">
          <p className="text-xs font-semibold text-indigo-600 mb-1">{payload[0].payload.stage}</p>
          <p className="text-lg font-bold text-gray-900">{formatTooltipValue(value)}</p>
          <p className="text-xs text-gray-500 mt-1">{percentage}% of total pipeline</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        layout="vertical"
        margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={formatYAxis}
        />
        <YAxis
          type="category"
          dataKey="stage"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} />
        <Bar
          dataKey="value"
          radius={[0, 8, 8, 0]}
          animationDuration={1000}
          animationBegin={0}
        >
          {formattedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#barGradient-${index})`}
              style={{
                transition: 'filter 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e: any) => {
                e.target.style.filter = 'brightness(1.05)'
              }}
              onMouseLeave={(e: any) => {
                e.target.style.filter = 'brightness(1)'
              }}
            />
          ))}
        </Bar>
        <defs>
          {formattedData.map((entry, index) => (
            <linearGradient key={`grad-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          ))}
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Import Cell for Bar children
import { Cell } from 'recharts'
