"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
  href: string
  sub?: string
  trend?: number
}

export default function StatCard({ label, value, icon, color, href, sub, trend }: StatCardProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0
  const isNeutral = trend === 0

  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-white border border-gray-100",
        "hover:border-indigo-200 hover:shadow-lg",
        "active:scale-[0.98] active:bg-indigo-50/50",
        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400",
        "block"
      )}
    >
      {/* Animated gradient border on top - matches revenue chart style */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 
                      group-hover:from-indigo-50/30 group-hover:to-purple-50/30
                      transition-all duration-300 rounded-xl" />

      <div className="relative z-10 p-5">
        {/* Icon with enhanced styling - matches chart gradients */}
        <div className="mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br shadow-md",
            color
          )}>
            {icon}
          </div>
        </div>

        {/* Value with premium typography - matches revenue chart numbers */}
        <p className="text-3xl font-serif font-light tracking-tight text-gray-900">
          {value}
        </p>

        {/* Label */}
        <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
        
        {/* Subtext */}
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}

        {/* Trend Indicator with better styling - matches revenue chart trend */}
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
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
          </div>
        )}
      </div>
    </Link>
  )
}
