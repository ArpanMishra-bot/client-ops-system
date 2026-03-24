export const dynamic = "force-dynamic"

import { getClientById } from "@/modules/clients/actions"
import { notFound } from "next/navigation"
import EditForm from "./edit-form"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) notFound()

  return <EditForm client={client} />
}
