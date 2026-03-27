"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  href: string
  trend?: number | null
  color: string
}

export default function StatCard({ label, value, sub, icon, href, trend, color }: StatCardProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl border border-gray-100 p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:bg-white/50 active:backdrop-blur-sm active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
      {trend !== undefined && trend !== null && trend !== 0 && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
          {isPositive && <TrendingUp className="h-3 w-3" />}
          {isNegative && <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{trend}% from last month</span>
        </div>
      )}
    </Link>
  )
}
