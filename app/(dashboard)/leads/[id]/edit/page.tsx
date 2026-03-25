export const dynamic = "force-dynamic"

import { getLeadById } from "@/modules/leads/actions"
import { notFound } from "next/navigation"
import EditLeadForm from "./edit-lead-form"

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await getLeadById(id)

  if (!lead) notFound()

  return <EditLeadForm lead={lead} />
}
