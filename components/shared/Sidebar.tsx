"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FolderKanban,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Receipt,
  Bell,
} from "lucide-react"
import { useState } from "react"
import { useClerk } from "@clerk/nextjs"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-600" },
  { name: "Clients", href: "/clients", icon: Users, color: "from-purple-500 to-pink-600" },
  { name: "Leads", href: "/leads", icon: TrendingUp, color: "from-teal-500 to-emerald-600" },
  { name: "Projects", href: "/projects", icon: FolderKanban, color: "from-blue-500 to-cyan-600" },
  { name: "Invoices", href: "/invoices", icon: Receipt, color: "from-emerald-500 to-teal-600" },
  { name: "Tasks", href: "/tasks", icon: Briefcase, color: "from-amber-500 to-orange-600" },
  { name: "Reminders", href: "/reminders", icon: Calendar, color: "from-rose-500 to-pink-600" },
]

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden hidden" id="mobile-overlay" />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
          "bg-white/80 backdrop-blur-xl border-r border-gray-100",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {!collapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold gradient-text text-lg">ClientOps</span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {/* Icon with gradient on active */}
                <div className={cn(
                  "w-6 h-6 flex items-center justify-center transition-all",
                  isActive && "scale-110"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all",
                    isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
                  )} />
                </div>
                
                {/* Label */}
                {!collapsed && (
                  <span className={cn(
                    "text-sm font-medium transition-all",
                    isActive ? "gradient-text font-semibold" : "text-gray-700"
                  )}>
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
                
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="absolute right-3 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          {bottomNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1",
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 text-gray-500" />
                {!collapsed && <span className="text-sm font-medium text-gray-700">{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
          
          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mt-2",
              "text-red-600 hover:bg-red-50"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
