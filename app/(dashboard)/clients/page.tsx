import { Suspense } from "react"
import { getClientsPage } from "@/modules/clients/actions"
import { Plus } from "lucide-react"
import Link from "next/link"
import ClientsSkeleton from "@/components/shared/ClientsSkeleton"
import Pagination from "@/components/shared/Pagination"
import { parsePage } from "@/lib/pagination"
import ClientsList from "./ClientsList"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { page: pageParam } = await searchParams
  const requested = parsePage(pageParam)
  let data = await getClientsPage(requested)
  if (requested > data.totalPages) data = await getClientsPage(data.totalPages)

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
        <ClientsList initialClients={data.items} />
      </Suspense>

      <Pagination basePath="/clients" page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
    </div>
  )
}
