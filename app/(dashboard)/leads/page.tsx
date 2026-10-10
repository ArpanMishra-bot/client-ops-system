import { Suspense } from "react"
import { getLeadsPage } from "@/modules/leads/actions"
import Pagination from "@/components/shared/Pagination"
import { parsePage } from "@/lib/pagination"
import LeadsClient from "./LeadsClient"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { page: pageParam } = await searchParams
  const requested = parsePage(pageParam)
  let data = await getLeadsPage(requested)
  if (requested > data.totalPages) data = await getLeadsPage(data.totalPages)

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your sales pipeline</p>
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <LeadsClient key={data.page} initialLeads={data.items} totalCount={data.total} />
      </Suspense>

      <Pagination basePath="/leads" page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
    </div>
  )
}
