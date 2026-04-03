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
  trend?: number | null  // Updated to accept null
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
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-white border border-gray-100",
        "hover:border-indigo-200 hover:shadow-lg",
        "active:scale-[0.98] active:bg-indigo-50/30",
        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400",
        "block"
      )}
    >
      {/* Animated gradient border on top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background gradient on hover - subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 
                      group-hover:from-indigo-50/20 group-hover:to-purple-50/20
                      transition-all duration-300 rounded-xl" />

      <div className="relative z-10 p-5">
        {/* Icon with consistent gradient - responsive size */}
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

        {/* Trend Indicator - handles null values */}
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            {trend === null ? (
              <span className="text-xs text-gray-400">No prior data</span>
            ) : (
              <>
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-mono font-medium",
                    trend > 0 && "text-emerald-600",
                    trend < 0 && "text-rose-600",
                    trend === 0 && "text-gray-400"
                  )}
                >
                  {trend > 0 && <ArrowUpRight className="h-3.5 w-3.5" />}
                  {trend < 0 && <ArrowDownRight className="h-3.5 w-3.5" />}
                  {trend === 0 && <Minus className="h-3.5 w-3.5" />}
                  <span className="font-semibold">
                    {trend > 0 && "+"}
                    {trend}%
                  </span>
                </div>
                <span className="text-xs text-gray-400">vs last month</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
