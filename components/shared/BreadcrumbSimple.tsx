"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export default function BreadcrumbSimple() {
  const pathname = usePathname()
  
  // Don't show on dashboard root
  if (pathname === "/dashboard") return null
  
  const segments = pathname.split("/").filter(Boolean)
  
  // Get display name for each segment
  const getDisplayName = (segment: string): string => {
    // Handle ID segments (look like random strings)
    if (segment.match(/^[a-zA-Z0-9]{25,}$/)) {
      return "Details"
    }
    
    // Map known routes
    const routeMap: Record<string, string> = {
      "dashboard": "Dashboard",
      "clients": "Clients",
      "leads": "Leads",
      "projects": "Projects",
      "invoices": "Invoices",
      "reminders": "Reminders",
      "settings": "Settings",
      "new": "New",
      "edit": "Edit",
    }
    
    return routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  // Build href for each segment
  const buildHref = (index: number): string => {
    const relevantSegments = segments.slice(0, index + 1)
    return `/${relevantSegments.join("/")}`
  }
  
  return (
    <nav className="flex items-center gap-1 text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            className="flex min-h-11 min-w-11 items-center justify-center text-gray-600 hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        
        {/* Segments */}
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-3 w-3 text-gray-400 mx-1" />
            {index === segments.length - 1 ? (
              <span className="text-gray-600 font-medium">
                {getDisplayName(segment)}
              </span>
            ) : (
              <Link
                href={buildHref(index)}
                className="text-gray-500 hover:text-indigo-600 transition-colors capitalize"
              >
                {getDisplayName(segment)}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
