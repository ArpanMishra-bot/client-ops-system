"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, UserPlus, Search } from "lucide-react"

export default function ClientsList({ initialClients }: { initialClients: any[] }) {
  const [search, setSearch] = useState("")
  
  const filteredClients = initialClients.filter((client) => {
    const searchLower = search.toLowerCase()
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.company && client.company.toLowerCase().includes(searchLower))
    )
  })

  if (filteredClients.length === 0 && search) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
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
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-100">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.company ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {client.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/clients/${client.id}`} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md active:shadow-lg active:scale-[0.98] transition-all duration-200 block"
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
        ))}
      </div>
    </div>
  )
}
