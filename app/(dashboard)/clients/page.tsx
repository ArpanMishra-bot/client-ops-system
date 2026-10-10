import { Suspense } from "react"
import { getClientsPage } from "@/modules/clients/actions"
import { Plus } from "lucide-react"
import Link from "next/link"
import ClientsSkeleton from "@/components/shared/ClientsSkeleton"
import Pagination from "@/components/shared/Pagination"
import { parsePage } from "@/lib/pagination"
import ClientsList from "./ClientsList"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

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
      <PageHeader
        title="Clients"
        description="Manage your client relationships."
        action={
          <Button asChild size="lg">
            <Link href="/clients/new">
              <Plus aria-hidden="true" />
              Add client
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<ClientsSkeleton />}>
        <ClientsList initialClients={data.items} />
      </Suspense>

      <Pagination basePath="/clients" page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
    </div>
  )
}
