"use client"

import { useState } from "react"
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

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

// Calculate pipeline metrics
const calculateMetrics = (data: { stage: string; value: number }[]) => {
  const totalPipeline = data.reduce((sum, d) => sum + d.value, 0)
  const avgStageValue = totalPipeline / data.length
  const maxStage = data.reduce((max, d) => d.value > max.value ? d : max, data[0])
  const conversionRate = 68 // This could come from your actual data
  
  return {
    totalPipeline,
    avgStageValue,
    maxStage,
    conversionRate
  }
}

export default function PipelineChart({ data }: PipelineChartProps) {
  const [view, setView] = useState<"value" | "percentage">("value")
  const metrics = calculateMetrics(data)
  
  // Calculate percentages if needed
  const chartData = view === "percentage" 
    ? data.map(d => ({
        ...d,
        value: (d.value / metrics.totalPipeline) * 100
      }))
    : data

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const stage = payload[0].payload.stage
      const percentage = (payload[0].payload.value / metrics.totalPipeline) * 100
      
      return (
        <div
          className="rounded-xl px-4 py-3 min-w-[140px]
                     bg-white/95 backdrop-blur-md border border-gray-200
                     shadow-xl shadow-teal-500/10"
          style={{
            fontFamily: "'Geist', sans-serif",
          }}
        >
          <p className="text-xs font-mono text-teal-600 font-semibold mb-1 tracking-wide">
            {stage}
          </p>
          <p className="text-2xl font-serif font-light tracking-tight text-gray-900">
            {view === "value" ? formatCurrency(value) : `${value.toFixed(1)}%`}
          </p>
          {view === "value" && (
            <p className="text-xs text-gray-500 mt-1">
              {percentage.toFixed(1)}% of total pipeline
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono text-teal-500 font-semibold tracking-wider uppercase mb-1">
            Pipeline Value
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-serif font-light tracking-tight text-gray-900">
              {formatCompactCurrency(metrics.totalPipeline)}
            </h3>
            <span className="text-sm text-gray-400">total</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-emerald-600 font-mono">
              ~{metrics.conversionRate}% conversion rate
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {data.length} stages
            </span>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
          <button
            onClick={() => setView("value")}
            className={`
              px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all
              ${view === "value" 
                ? "bg-white shadow-sm text-teal-600" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }
            `}
          >
            Value
          </button>
          <button
            onClick={() => setView("percentage")}
            className={`
              px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all
              ${view === "percentage" 
                ? "bg-white shadow-sm text-teal-600" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }
            `}
          >
            % of Total
          </button>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Largest Stage</div>
          <div className="text-lg font-serif font-light mt-0.5 text-gray-900">
            {metrics.maxStage.stage}
          </div>
          <div className="text-xs text-gray-400">{formatCompactCurrency(metrics.maxStage.value)}</div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Avg per Stage</div>
          <div className="text-lg font-serif font-light mt-0.5 text-gray-900">
            {formatCompactCurrency(metrics.avgStageValue)}
          </div>
          <div className="text-xs text-gray-400">across {data.length} stages</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="pipelineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e9eef3" 
              vertical={false}
            />
            
            <XAxis
              dataKey="stage"
              tick={{ 
                fontSize: 11, 
                fontFamily: "'Geist Mono', monospace", 
                fill: "#8e9aab",
                angle: 0,
                textAnchor: "middle"
              }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval={0}
            />
            
            <YAxis
              tick={{ 
                fontSize: 11, 
                fontFamily: "'Geist Mono', monospace", 
                fill: "#8e9aab" 
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={view === "value" ? formatCompactCurrency : (value) => `${value}%`}
              width={45}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "rgba(99,102,241,0.05)" }}
            />
            
            <Bar
              dataKey="value"
              fill="url(#pipelineGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with insights */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500" />
          <span className="text-xs text-gray-500 font-mono">
            {view === "value" ? "Pipeline Value by Stage" : "Percentage Distribution"}
          </span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {metrics.totalPipeline > 0 ? `${data.length} active stages` : "No data"}
        </div>
      </div>
    </div>
  )
}
