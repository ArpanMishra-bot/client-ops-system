// components/dashboard/StatCard.tsx
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  iconBgColor: string // Now accepts strict indigo-500 or violet-500
  href: string
  sub?: string
  trend?: string | null
  trendValue?: number | null
  hasPriorData?: boolean
}

export default function StatCard({ 
  label, 
  value, 
  icon, 
  iconBgColor, 
  href, 
  sub, 
  trend, 
  trendValue,
  hasPriorData = true 
}: StatCardProps) {
  // Determine if we should show the trend badge
  const shouldShowTrend = hasPriorData && trendValue !== undefined && trendValue !== null
  
  // Format trend display - always whole number percentage
  const getTrendDisplay = () => {
    if (!shouldShowTrend) return null
    const numericTrend = Math.round(Math.abs(trendValue || 0))
    const isPositive = (trendValue || 0) > 0
    const isNegative = (trendValue || 0) < 0
    
    if (isPositive) {
      return { text: `+${numericTrend}%`, icon: ArrowUpRight, color: "text-emerald-600 bg-emerald-50" }
    } else if (isNegative) {
      return { text: `-${numericTrend}%`, icon: ArrowDownRight, color: "text-rose-600 bg-rose-50" }
    } else {
      return { text: `0%`, icon: Minus, color: "text-gray-500 bg-gray-50" }
    }
  }
  
  const trendDisplay = getTrendDisplay()

  return (
    <Link
      href={href}
      className="group block bg-white rounded-xl border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:border-indigo-200 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-serif tracking-tight text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
      
      {shouldShowTrend && trendDisplay && (
        <div className="mt-4 flex items-center gap-1">
          <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full ${trendDisplay.color}`}>
            <trendDisplay.icon className="h-3 w-3" />
            <span className="text-xs font-medium">{trendDisplay.text}</span>
          </div>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </Link>
  )
}
