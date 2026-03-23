export const dynamic = "force-dynamic"

import { getClientById } from "@/modules/clients/actions"
import { notFound } from "next/navigation"
import EditClientForm from "./EditClientForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientById(id)
  if (!client) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/clients/${params.id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Client
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Client</h1>
        <p className="text-sm text-gray-500 mt-1">Update client information below.</p>
      </div>
      <EditClientForm client={client} />
    </div>
  )
}
