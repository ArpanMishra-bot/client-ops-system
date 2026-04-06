"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumb() {
  const pathname = usePathname()
  
  // Skip breadcrumbs on dashboard root
  if (pathname === "/dashboard") return null
  
  // Build breadcrumb items from pathname
  const segments = pathname.split("/").filter(segment => segment !== "" && segment !== "dashboard")
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    ...segments.map((segment, index) => {
      const href = `/dashboard/${segments.slice(0, index + 1).join("/")}`
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Handle special cases
      if (segment === "clients") label = "Clients"
      else if (segment === "leads") label = "Leads"
      else if (segment === "projects") label = "Projects"
      else if (segment === "invoices") label = "Invoices"
      else if (segment === "reminders") label = "Reminders"
      else if (segment === "settings") label = "Settings"
      else if (segment === "new") label = "New"
      else if (segment === "edit") label = "Edit"
      
      return { label, href }
    })
  ]
  
  // Don't show breadcrumbs for root dashboard pages
  if (breadcrumbs.length === 1 && breadcrumbs[0].label === "Dashboard") return null
  
  return (
    <nav className="flex items-center gap-1 text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-gray-400 mx-1" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-600 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {index === 0 ? (
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
