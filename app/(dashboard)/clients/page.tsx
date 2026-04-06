import { Suspense } from "react"
import { getClients } from "@/modules/clients/actions"
import { Plus } from "lucide-react"
import Link from "next/link"
import ClientsSkeleton from "@/components/shared/ClientsSkeleton"
import ClientsList from "./ClientsList"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your client relationships</p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Client</span>
        </Link>
      </div>

      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsList initialClients={clients} />
      </Suspense>
    </div>
  )
}
