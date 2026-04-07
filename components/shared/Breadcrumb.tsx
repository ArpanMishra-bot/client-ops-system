"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { useEffect, useState } from "react"

export default function Breadcrumb() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  
  // Skip breadcrumbs on dashboard root
  if (pathname === "/dashboard") return null
  
  // Extract IDs from pathname and fetch names - BUT only on server or after mount
  useEffect(() => {
    // Don't fetch during client-side navigation if we already have the data
    async function fetchName(id: string, type: string) {
      try {
        const res = await fetch(`/api/${type}/${id}`)
        if (res.ok) {
          const data = await res.json()
          setNames(prev => ({ ...prev, [id]: data.name }))
        }
      } catch (e) {
        console.error(`Failed to fetch ${type}:`, e)
      }
    }
    
    // Check for client ID
    const clientMatch = pathname.match(/\/clients\/([a-zA-Z0-9]+)/)
    if (clientMatch && !names[clientMatch[1]]) {
      fetchName(clientMatch[1], "clients")
    }
    
    // Check for lead ID
    const leadMatch = pathname.match(/\/leads\/([a-zA-Z0-9]+)/)
    if (leadMatch && !names[leadMatch[1]]) {
      fetchName(leadMatch[1], "leads")
    }
    
    // Check for project ID
    const projectMatch = pathname.match(/\/projects\/([a-zA-Z0-9]+)/)
    if (projectMatch && !names[projectMatch[1]]) {
      fetchName(projectMatch[1], "projects")
    }
    
    // Check for invoice ID
    const invoiceMatch = pathname.match(/\/invoices\/([a-zA-Z0-9]+)/)
    if (invoiceMatch && !names[invoiceMatch[1]]) {
      fetchName(invoiceMatch[1], "invoices")
    }
  }, [pathname]) // Remove names from dependency array to prevent infinite loop
  
  // Build breadcrumb items from pathname
  const segments = pathname.split("/").filter(segment => segment !== "" && segment !== "dashboard")
  
  const breadcrumbs = [
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
      else if (segment.match(/^[a-zA-Z0-9]+$/)) {
        // This is an ID - try to get actual name
        label = names[segment] || "..."
      }
      
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
