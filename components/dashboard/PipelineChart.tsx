"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface PipelineChartProps {
  data: { stage: string; value: number }[]
}

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div
          className="relative rounded-lg px-3 py-2 min-w-[120px]
                     bg-white/20 backdrop-blur-md border border-white/30
                     shadow-lg shadow-teal-200"
        >
          <p className="text-xs font-semibold gradient-text mb-1">
            {payload[0].payload.stage}
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
    <div className="rounded-xl shadow-md border border-gray-100 
                    bg-gradient-to-br from-teal-50 via-white to-indigo-50 p-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="stage"
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
            cursor={{ fill: "rgba(99,102,241,0.1)" }}
          />

          {/* Premium gradient bars with rounded corners */}
          <Bar
            dataKey="value"
            fill="url(#pipelineGradient)"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          />

          <defs>
            {/* Bar gradient */}
            <linearGradient id="pipelineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
