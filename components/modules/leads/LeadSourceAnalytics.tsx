"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface LeadSourceAnalyticsProps {
  leads: any[]
}

const COLORS = {
  Website: "#6366f1",
  Referral: "#a855f7",
  LinkedIn: "#06b6d4",
  "Cold Outreach": "#f59e0b",
  "Social Media": "#ec4899",
  Other: "#6b7280",
}

const SOURCE_LABELS: Record<string, string> = {
  Website: "🌐 Website",
  Referral: "🤝 Referral",
  LinkedIn: "💼 LinkedIn",
  "Cold Outreach": "📧 Cold Outreach",
  "Social Media": "📱 Social Media",
  Other: "📌 Other",
}

export default function LeadSourceAnalytics({ leads }: LeadSourceAnalyticsProps) {
  // Group leads by source
  const sourceMap = new Map<string, number>()
  
  leads.forEach(lead => {
    const source = lead.source || "Other"
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
  })

  const data = Array.from(sourceMap.entries()).map(([name, value]) => ({
    name: SOURCE_LABELS[name] || name,
    originalName: name,
    value,
    color: COLORS[name as keyof typeof COLORS] || COLORS.Other,
  }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-400">No lead source data available yet.</p>
        <p className="text-xs text-gray-400 mt-1">Add leads with source information to see analytics.</p>
      </div>
    )
  }

  const totalLeads = data.reduce((sum, d) => sum + d.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalLeads) * 100).toFixed(1)
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-sm">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-gray-600">{payload[0].value} leads ({percentage}%)</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats List */}
        <div className="space-y-3">
          {data.map((source) => {
            const percentage = ((source.value / totalLeads) * 100).toFixed(1)
            return (
              <div key={source.originalName} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-gray-600">{source.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">{source.value}</span>
                  <span className="text-xs text-gray-400 w-12">{percentage}%</span>
                </div>
              </div>
            )
          })}
          
          {/* Total */}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total Leads</span>
              <span className="text-sm font-semibold text-gray-900">{totalLeads}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
        }
