// components/dashboard/StatCard.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color?: string
  href: string
  sub?: string
  trend?: number | null
}

export default function StatCard({ 
  label, 
  value, 
  icon, 
  color = "from-indigo-500 to-indigo-600",
  href, 
  sub, 
  trend 
}: StatCardProps) {
  const showTrend = trend !== undefined && trend !== null
  const isPositive = showTrend && trend > 0
  const isNegative = showTrend && trend < 0
  const isNeutral = showTrend && trend === 0
  const isZeroActivity = isNegative && trend === -100

  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-white border border-gray-100",
        "hover:border-indigo-200 hover:shadow-lg",
        // Mobile tap effects - added these
        "active:scale-[0.97] active:bg-indigo-50/50 active:shadow-lg",
        "transition-all duration-200 ease-out",
        "focus-visible:ring-2 focus-visible:ring-indigo-400",
        "block cursor-pointer touch-manipulation"
      )}
    >
      {/* Animated gradient border on top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 
                      group-hover:from-indigo-50/20 group-hover:to-purple-50/20
                      transition-all duration-300 rounded-xl" />

      <div className="relative z-10 p-6">
        {/* Icon - responsive size */}
        <div className="mb-4">
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-r shadow-md",
            color
          )}>
            {icon}
          </div>
        </div>

        {/* Value - responsive text size */}
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          {value}
        </p>

        {/* Label */}
        <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
        
        {/* Subtext */}
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}

        {/* Trend Indicator */}
        <div className="mt-3 flex items-center gap-1.5">
          {!showTrend ? (
            <span className="text-xs text-gray-400">No prior data</span>
          ) : isZeroActivity ? (
            <span className="text-xs text-amber-600">No activity this month</span>
          ) : (
            <>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-mono font-medium",
                  isPositive && "text-emerald-600",
                  isNegative && "text-rose-600",
                  isNeutral && "text-gray-400"
                )}
              >
                {isPositive && <ArrowUpRight className="h-3.5 w-3.5" />}
                {isNegative && <ArrowDownRight className="h-3.5 w-3.5" />}
                {isNeutral && <Minus className="h-3.5 w-3.5" />}
                <span className="font-semibold">
                  {isPositive && "+"}
                  {trend}%
                </span>
              </div>
              <span className="text-xs text-gray-400">vs last month</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
