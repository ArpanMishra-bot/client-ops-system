export const dynamic = "force-dynamic"

import { getProjectById } from "@/modules/projects/actions"
import { getClients } from "@/modules/clients/actions"
import { notFound } from "next/navigation"
import EditProjectForm from "./edit-project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  const clients = await getClients()

  if (!project) notFound()

  return <EditProjectForm project={project} clients={clients} />
}
