import { Suspense } from "react"
import { getLeadsPage } from "@/modules/leads/actions"
import Pagination from "@/components/shared/Pagination"
import { parsePage } from "@/lib/pagination"
import LeadsClient from "./LeadsClient"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import LeadsSkeleton from "@/components/shared/LeadsSkeleton"

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
      <PageHeader
        title="Leads"
        description="Track and manage your sales pipeline."
        action={
          <Button asChild size="lg">
            <Link href="/leads/new">
              <Plus aria-hidden="true" />
              Add lead
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsClient key={data.page} initialLeads={data.items} totalCount={data.total} />
      </Suspense>

      <Pagination basePath="/leads" page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
    </div>
  )
}
