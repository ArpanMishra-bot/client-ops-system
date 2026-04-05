export const dynamic = "force-dynamic"

import { getProjectById } from "@/modules/projects/actions"
import { notFound } from "next/navigation"
import { ArrowLeft, Plus, Calendar, DollarSign, Pencil } from "lucide-react"
import Link from "next/link"
import { PROJECT_STATUS_CONFIG, TASK_STATUS_CONFIG } from "@/modules/projects/types"
import TaskItem from "@/components/modules/leads/TaskItem"
import AddTaskForm from "@/components/modules/leads/AddTaskForm"
import { DeleteProjectButton } from "./delete-project-button"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  const statusConfig = PROJECT_STATUS_CONFIG[project.status]
  const completedTasks = project.tasks.filter(t => t.status === "DONE").length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const tasksByStatus = {
    TODO: project.tasks.filter(t => t.status === "TODO"),
    IN_PROGRESS: project.tasks.filter(t => t.status === "IN_PROGRESS"),
    IN_REVIEW: project.tasks.filter(t => t.status === "IN_REVIEW"),
    DONE: project.tasks.filter(t => t.status === "DONE"),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/projects" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2">
          <Link
  href={`/projects/${project.id}/edit`}
  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200 flex items-center gap-2"
>
  <Pencil className="h-4 w-4" />
  Edit
</Link>
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Client: {project.client.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Progress</p>
            <p className="text-lg font-semibold text-gray-900">{progress}%</p>
            <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
              <div className="bg-gray-900 h-1 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Tasks</p>
            <p className="text-lg font-semibold text-gray-900">{completedTasks}/{totalTasks}</p>
          </div>
          {project.budget && (
            <div>
              <p className="text-xs text-gray-400">Budget</p>
              <p className="text-lg font-semibold text-gray-900">${project.budget.toLocaleString()}</p>
            </div>
          )}
          {project.dueDate && (
            <div>
              <p className="text-xs text-gray-400">Due Date</p>
              <p className="text-lg font-semibold text-gray-900">{new Date(project.dueDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {project.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Description</p>
            <p className="text-sm text-gray-700">{project.description}</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Tasks</h2>
        </div>

        <AddTaskForm projectId={project.id} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(tasksByStatus).map(([status, tasks]) => {
            const config = TASK_STATUS_CONFIG[status as keyof typeof TASK_STATUS_CONFIG]
            return (
              <div key={status} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-xs text-gray-400">{tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                  ) : (
                    tasks.map(task => (
                      <TaskItem key={task.id} task={task} projectId={project.id} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
