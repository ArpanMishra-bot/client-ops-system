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

export default function StatCard({
  label,
  value,
  icon,
  color,
  href,
  sub,
  trend,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden p-6 rounded-2xl flex flex-col justify-between",
        // Glassmorphism style
        "bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg",
        // Interactions
        "hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all duration-300"
      )}
    >
      {/* Glow border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 
                      bg-gradient-to-r from-transparent via-indigo-400 to-transparent 
                      group-hover:via-pink-400 transition-all duration-300" />

      {/* Icon */}
      <div className="mb-4 flex items-center justify-center">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br shadow-md",
            color
          )}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-extrabold tracking-tight font-mono gradient-text">
        {value}
      </p>

      {/* Label + Subtext */}
      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>

      {/* Trend Indicator */}
      {trend !== undefined && (
        <div
          className={cn(
            "mt-3 text-xs font-semibold flex items-center gap-1",
            trend > 0
              ? "text-green-500 animate-pulse"
              : trend < 0
              ? "text-red-500 animate-pulse"
              : "text-gray-400"
          )}
        >
          {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"} {trend}%
        </div>
      )}
    </Link>
  )
}
