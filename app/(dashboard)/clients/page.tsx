import { Suspense } from "react"
import { getClients } from "@/modules/clients/actions"
import { Users, Plus, UserPlus } from "lucide-react"
import Link from "next/link"
import ClientsSkeleton from "@/components/shared/ClientsSkeleton"

async function ClientsList() {
  const clients = await getClients()

  if (clients.length === 0) {
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
          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Add your first client
        </Link>
      </div>
    )
  }

  return (
    <>
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
            {clients.map((client) => (
              <tr key={client.id} className="transition-all duration-150 hover:bg-gray-50">
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
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-lg active:shadow-lg active:scale-[0.98] transition-all duration-200 block"
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
    </>
  )
}

export default async function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your client relationships</p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Client</span>
        </Link>
      </div>

      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsList />
      </Suspense>
    </div>
  )
}
