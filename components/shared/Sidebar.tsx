// components/layout/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Leads", icon: TrendingUp, href: "/leads" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Invoices", icon: FileText, href: "/invoices" },
  { label: "Reminders", icon: Calendar, href: "/reminders" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          {/* Abstract geometric logo mark - indigo colored */}
          <svg 
            className="w-7 h-7 text-indigo-500 transition-transform group-hover:scale-105 duration-200" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hexagon base */}
            <path 
              d="M16 2L28 10V22L16 30L4 22V10L16 2Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="url(#gradient)" 
              fillOpacity="0.15"
            />
            {/* Inner geometric diamond */}
            <path 
              d="M16 8L24 16L16 24L8 16L16 8Z" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              fill="currentColor" 
              fillOpacity="0.2"
            />
            {/* Center dot */}
            <circle cx="16" cy="16" r="2.5" fill="currentColor" />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ClientOps
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-1.5">
        <Link 
          href="/settings" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <Settings className="h-4.5 w-4.5 text-gray-400" />
          <span>Settings</span>
        </Link>
        <Link 
          href="/help" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <HelpCircle className="h-4.5 w-4.5 text-gray-400" />
          <span>Help</span>
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
