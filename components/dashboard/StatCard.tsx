"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

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
  return (
    <Link
      href={href}
      className={cn(
        "group glass-card p-5 rounded-xl flex flex-col justify-between relative overflow-hidden",
        "hover:-translate-y-1 hover:shadow-lg active:scale-95 active:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-400"
      )}
    >
      {/* Glow border at top of card */}
      <div className="absolute top-0 left-0 right-0 h-1 
                      bg-gradient-to-r from-transparent via-indigo-400 to-transparent 
                      transition-all duration-200 
                      group-active:via-pink-400" />

      {/* Icon */}
      <div className="mb-4 flex items-center justify-center">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br", color)}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold tracking-tight font-mono gradient-text">{value}</p>

      {/* Label + Subtext */}
      <div className="mt-1">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          className={cn(
            "mt-2 text-xs font-medium",
            trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-400"
          )}
        >
          {trend > 0 ? `▲ ${trend}%` : trend < 0 ? `▼ ${trend}%` : "—"}
        </div>
      )}
    </Link>
  )
}
