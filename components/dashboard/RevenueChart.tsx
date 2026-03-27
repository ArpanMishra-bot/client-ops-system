"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const hasData = data.some(d => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No revenue data available yet</p>
        <p className="text-xs text-gray-400 mt-1">Create and mark invoices as paid to see your revenue trends</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const avgRevenue = Math.round(totalRevenue / data.filter(d => d.revenue > 0).length)

  return (
    <div className="space-y-4">
      {/* Chart Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total revenue • Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Avg. monthly</p>
          <p className="text-lg font-semibold text-gray-900">${avgRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="premiumStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
            dx={-5}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Revenue']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
              padding: '8px 12px'
            }}
            labelStyle={{ color: '#6b7280', fontWeight: 500 }}
            cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="url(#premiumStroke)"
            strokeWidth={2.5}
            fill="url(#premiumGradient)"
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Data Points Summary */}
      <div className="flex justify-between pt-2 text-xs text-gray-400 border-t border-gray-100">
        {data.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className="font-medium text-gray-600">{item.month.split(' ')[0]}</div>
            <div className="mt-1">${item.revenue.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
