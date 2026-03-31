"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

const formatTooltipValue = (value: number) => `$${value.toLocaleString()}`

export default function RevenueChart({ data }: RevenueChartProps) {
  const hasData = data.some(d => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 shadow-inner">
          <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No revenue data available yet</p>
        <p className="text-xs text-gray-400 mt-1">Mark invoices as paid to see trends</p>
      </div>
    )
  }

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const avgRevenue = Math.round(totalRevenue / data.filter(d => d.revenue > 0).length)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="glass-card p-3 min-w-[140px] shadow-lg">
          <p className="text-xs font-semibold gradient-text mb-1">{payload[0].payload.month}</p>
          <p className="text-lg font-bold text-gray-900">{formatTooltipValue(value)}</p>
          <p className="text-xs text-gray-500 mt-1">Total revenue</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total revenue • Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Avg. monthly</p>
          <p className="text-lg font-semibold gradient-text">${avgRevenue.toLocaleString()}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            dx={-5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]} animationDuration={1000}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#barGradient-${index})`}
                style={{ transition: 'filter 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e: any) => { e.target.style.filter = 'brightness(1.1)' }}
                onMouseLeave={(e: any) => { e.target.style.filter = 'brightness(1)' }}
              />
            ))}
          </Bar>
          <defs>
            {data.map((_, index) => (
              <linearGradient key={`grad-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            ))}
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
