import { Suspense } from "react"
import { getProjects } from "@/modules/projects/actions"
import { PROJECT_STATUS_CONFIG } from "@/modules/projects/types"
import { FolderKanban, Plus, Users, Briefcase } from "lucide-react"
import Link from "next/link"
import ProjectsSkeleton from "@/components/shared/ProjectsSkeleton"

async function ProjectsList() {
  const projects = await getProjects()

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FolderKanban className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get started with projects</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Create your first project to start tracking work, managing tasks, and delivering for your clients.
        </p>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-95 active:shadow-lg transition-all duration-150"
        >
          <Briefcase className="h-4 w-4" />
          Create your first project
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => {
        const statusConfig = PROJECT_STATUS_CONFIG[project.status]
        const completedTasks = project.tasks.filter(t => t.status === "DONE").length
        const totalTasks = project.tasks.length
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:shadow-lg transition-all duration-200 block group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {project.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">{project.client.name}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            {project.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{project.description}</p>
            )}

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{completedTasks}/{totalTasks} tasks done</p>
            </div>

            {project.dueDate && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default async function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active projects</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  )
}
