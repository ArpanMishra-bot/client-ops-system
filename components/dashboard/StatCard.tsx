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
      className="glass-card p-6 rounded-2xl flex flex-col shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          {label}
        </span>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-400'}`}>
          {isPositive && <TrendingUp className="h-3 w-3" />}
          {isNegative && <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{trend}% from last month</span>
        </div>
      )}
    </Link>
  )
}
