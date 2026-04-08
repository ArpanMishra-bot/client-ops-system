// app/(dashboard)/clients/ClientsList.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, UserPlus, Search, Trash2, Download, Check, X } from "lucide-react"
import { toast } from "sonner"
import { deleteClient } from "@/modules/clients/actions"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"

export default function ClientsList({ initialClients }: { initialClients: any[] }) {
  const [search, setSearch] = useState("")
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const filteredClients = initialClients.filter((client) => {
    const searchLower = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    )
  })

  // Toggle single client selection
  const toggleSelectClient = (clientId: string) => {
    const newSelected = new Set(selectedClients)
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId)
    } else {
      newSelected.add(clientId)
    }
    setSelectedClients(newSelected)
  }

  // Toggle select all clients
  const toggleSelectAll = () => {
    if (selectedClients.size === filteredClients.length) {
      setSelectedClients(new Set())
    } else {
      setSelectedClients(new Set(filteredClients.map(c => c.id)))
    }
  }

  // Clear all selections
  const clearSelection = () => {
    setSelectedClients(new Set())
  }

  // Bulk delete clients
  const handleBulkDelete = async () => {
    setIsDeleting(true)
    const clientIds = Array.from(selectedClients)
    let successCount = 0
    let errorCount = 0

    for (const clientId of clientIds) {
      const result = await deleteClient(clientId)
      if (result.success) {
        successCount++
      } else {
        errorCount++
      }
    }

    if (successCount > 0) {
      toast.success(`Deleted ${successCount} client${successCount !== 1 ? 's' : ''} successfully`)
    }
    if (errorCount > 0) {
      toast.error(`Failed to delete ${errorCount} client${errorCount !== 1 ? 's' : ''}`)
    }

    setSelectedClients(new Set())
    setShowDeleteDialog(false)
    setIsDeleting(false)
    
    // Refresh the page to show updated list
    window.location.reload()
  }

  // Bulk export clients to CSV
  const handleBulkExport = () => {
    const selectedClientData = initialClients.filter(c => selectedClients.has(c.id))
    
    // Define CSV headers
    const headers = ["Name", "Email", "Company", "Phone", "City", "Country", "Status", "Created At"]
    
    // Convert data to CSV rows
    const rows = selectedClientData.map(client => [
      client.name,
      client.email,
      client.company || "",
      client.phone || "",
      client.city || "",
      client.country || "",
      client.isActive ? "Active" : "Inactive",
      new Date(client.createdAt).toLocaleDateString(),
    ])
    
    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clients-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success(`Exported ${selectedClientData.length} client${selectedClientData.length !== 1 ? 's' : ''}`)
    clearSelection()
  }

  const selectedCount = selectedClients.size

  if (filteredClients.length === 0 && search) {
    return (
      <div className="space-y-6">
        {/* Search Bar - FIXED: Made it full width on mobile with min width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-[280px] pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No matching clients</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            No clients found matching "{search}". Try a different search term.
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
          >
            Clear search
          </button>
        </div>
      </div>
    )
  }

  if (filteredClients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get started with clients</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Add your first client to start tracking relationships, creating projects, and sending invoices.
        </p>
        <Link
          href="/clients/new"
          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Add your first client
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar and Bulk Actions Bar - FIXED: Search bar takes full width on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-[280px] pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Bulk Actions Bar - appears when items are selected */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-sm text-gray-600">
              {selectedCount} selected
            </span>
            <button
              onClick={handleBulkExport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Desktop Table - FIXED: Added min-w-full and proper column widths */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 w-10">
                <button
                  onClick={toggleSelectAll}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  {selectedClients.size === filteredClients.length && filteredClients.length > 0 && (
                    <Check className="h-3 w-3 text-gray-900" />
                  )}
                </button>
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Company</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-100">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleSelectClient(client.id)}
                    className="w-4 h-4 rounded border-2 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    {selectedClients.has(client.id) && (
                      <Check className="h-3 w-3 text-gray-900" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 min-w-[0]">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">{client.company ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[250px]">{client.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    client.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {client.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/clients/${client.id}`} 
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards with Checkboxes */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200"
          >
            <button
              onClick={() => toggleSelectClient(client.id)}
              className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors"
            >
              {selectedClients.has(client.id) && (
                <Check className="h-3 w-3 text-gray-900" />
              )}
            </button>
            <Link
              href={`/clients/${client.id}`}
              className="flex-1 flex items-center gap-4 min-w-0"
            >
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-medium">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                <p className="text-xs text-gray-500 truncate">{client.email}</p>
                {client.company && (
                  <p className="text-xs text-gray-400 truncate">{client.company}</p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                client.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {client.isActive ? "Active" : "Inactive"}
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleBulkDelete}
        itemName={`${selectedCount} client${selectedCount !== 1 ? 's' : ''}`}
        itemType="clients"
        isDeleting={isDeleting}
      />
    </div>
  )
}
