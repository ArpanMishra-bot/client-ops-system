"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { useEffect, useState } from "react"

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const [clientNames, setClientNames] = useState<Record<string, string>>({})
  const [leadNames, setLeadNames] = useState<Record<string, string>>({})
  const [projectNames, setProjectNames] = useState<Record<string, string>>({})
  const [invoiceNumbers, setInvoiceNumbers] = useState<Record<string, string>>({})
  
  // Skip breadcrumbs on dashboard root
  if (pathname === "/dashboard") return null
  
  // Extract IDs from pathname and fetch names
  useEffect(() => {
    async function fetchNames() {
      // Extract client IDs
      const clientIdMatch = pathname.match(/\/clients\/([a-zA-Z0-9]+)/)
      if (clientIdMatch && !clientNames[clientIdMatch[1]]) {
        try {
          const res = await fetch(`/api/clients/${clientIdMatch[1]}`)
          const client = await res.json()
          setClientNames(prev => ({ ...prev, [clientIdMatch[1]]: client.name }))
        } catch (e) { console.error(e) }
      }
      
      // Extract lead IDs
      const leadIdMatch = pathname.match(/\/leads\/([a-zA-Z0-9]+)/)
      if (leadIdMatch && !leadNames[leadIdMatch[1]]) {
        try {
          const res = await fetch(`/api/leads/${leadIdMatch[1]}`)
          const lead = await res.json()
          setLeadNames(prev => ({ ...prev, [leadIdMatch[1]]: lead.name }))
        } catch (e) { console.error(e) }
      }
      
      // Extract project IDs
      const projectIdMatch = pathname.match(/\/projects\/([a-zA-Z0-9]+)/)
      if (projectIdMatch && !projectNames[projectIdMatch[1]]) {
        try {
          const res = await fetch(`/api/projects/${projectIdMatch[1]}`)
          const project = await res.json()
          setProjectNames(prev => ({ ...prev, [projectIdMatch[1]]: project.name }))
        } catch (e) { console.error(e) }
      }
      
      // Extract invoice IDs
      const invoiceIdMatch = pathname.match(/\/invoices\/([a-zA-Z0-9]+)/)
      if (invoiceIdMatch && !invoiceNumbers[invoiceIdMatch[1]]) {
        try {
          const res = await fetch(`/api/invoices/${invoiceIdMatch[1]}`)
          const invoice = await res.json()
          setInvoiceNumbers(prev => ({ ...prev, [invoiceIdMatch[1]]: invoice.number }))
        } catch (e) { console.error(e) }
      }
    }
    
    fetchNames()
  }, [pathname])
  
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
      else if (segment.match(/^[a-zA-Z0-9]+$/)) {
        // This is an ID - try to replace with actual name
        if (clientNames[segment]) label = clientNames[segment]
        else if (leadNames[segment]) label = leadNames[segment]
        else if (projectNames[segment]) label = projectNames[segment]
        else if (invoiceNumbers[segment]) label = invoiceNumbers[segment]
        else label = "Loading..."
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
