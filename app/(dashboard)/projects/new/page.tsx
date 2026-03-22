import { getClients } from "@/modules/clients/actions"
import NewProjectForm from "./NewProjectForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProjectPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Project</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new project for a client.</p>
      </div>
      <NewProjectForm clients={clients} />
    </div>
  )
}
