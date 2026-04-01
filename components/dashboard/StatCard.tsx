"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
  href: string
  sub?: string
  trend?: number
  description?: string
}

export default function StatCard({ label, value, icon, color, href, sub, trend, description }: StatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden p-5 rounded-2xl flex flex-col",
        "bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800",
        "hover:border-indigo-200 dark:hover:border-indigo-800",
        "hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]",
        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400"
      )}
    >
      {/* Animated gradient border on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 
                      group-hover:from-indigo-50/50 group-hover:to-purple-50/50 
                      dark:group-hover:from-indigo-950/30 dark:group-hover:to-purple-950/30
                      transition-all duration-300 rounded-2xl" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md", color)}>
            {icon}
          </div>
        </div>

        {/* Value */}
        <p className="text-3xl font-serif font-light tracking-tight text-gray-900 dark:text-gray-100">
          {value}
        </p>

        {/* Label */}
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{label}</p>
        
        {/* Description/Subtext */}
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        {sub && !description && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}

        {/* Trend Indicator */}
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-0.5 text-xs font-mono font-medium",
                trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-400"
              )}
            >
              {trend > 0 && <ArrowUpRight className="h-3 w-3" />}
              {trend < 0 && <ArrowDownRight className="h-3 w-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
    </Link>
  )
}
