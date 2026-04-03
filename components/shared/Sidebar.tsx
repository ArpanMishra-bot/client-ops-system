// components/shared/Sidebar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "@/components/shared/Logo"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FolderKanban,
  FileText,
  Bell,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/leads", label: "Leads", icon: TrendingUp },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [tooltip, setTooltip] = useState<string | null>(null)

  const NavContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-gray-200/40 backdrop-blur-sm bg-white/50">
        <Logo size="md" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                isActive
                  ? "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 shadow-inner"
                  : "text-gray-600 hover:bg-white/60 hover:text-gray-900 active:bg-indigo-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-indigo-500 drop-shadow-glow" : "text-gray-400 group-hover:text-indigo-400"
                )}
              />
              <span className={isActive ? "gradient-text font-semibold" : ""}>{item.label}</span>

              {/* Tooltip */}
              {tooltip === item.label && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm border border-indigo-200 shadow-lg text-xs text-gray-700">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-200/40 backdrop-blur-sm bg-white/50">
        <p className="text-xs text-gray-400 px-3">ClientOps — v1.0</p>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Width changed from w-64 to w-56 */}
      <div className="hidden md:flex w-56 h-screen glass-card flex-col fixed left-0 top-0">
        <NavContent />
      </div>

      {/* Main content margin - Updated to match w-56 */}
      <div className="md:ml-56">
        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 
                        bg-white/70 backdrop-blur-md border-t border-gray-200 
                        flex items-center justify-around z-30 rounded-t-2xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 py-2 
                            ${isActive ? "text-indigo-600" : "text-gray-500"} 
                            active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "drop-shadow-glow" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
