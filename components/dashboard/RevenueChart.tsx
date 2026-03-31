"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts"

interface RevenueChartProps {
  data: { month: string; revenue: number }[]
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div
          className="relative rounded-lg px-3 py-2 min-w-[120px]
                     bg-white/20 backdrop-blur-md border border-white/30
                     shadow-lg shadow-indigo-200"
        >
          <p className="text-xs font-semibold gradient-text mb-1">
            {payload[0].payload.month}
          </p>
          <p className="text-sm font-bold font-mono text-gray-900">
            {formatYAxis(value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "3 3" }}
        />

        {/* Gradient area under the line */}
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="none"
          fill="url(#revenueFill)"
        />

        {/* Premium gradient line */}
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="url(#revenueGradient)"
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#6366f1" }}
          activeDot={{
            r: 7,
            strokeWidth: 2,
            fill: "#fff",
            stroke: "#a78bfa",
          }}
        />

        <defs>
          {/* Line gradient */}
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Area fill gradient */}
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  )
}
