import { Suspense } from "react"
import { getPendingTasks } from "@/modules/tasks/actions"
import { ArrowLeft, Calendar, ClipboardList } from "lucide-react"
import Link from "next/link"
import TasksSkeleton from "@/components/shared/TasksSkeleton"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

async function TasksList() {
  const tasks = await getPendingTasks()

  const groupedByProject = tasks.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = {
        projectName: task.project?.name || "Unknown Project",
        projectId: task.projectId,
        tasks: []
      }
    }
    acc[task.projectId].tasks.push(task)
    return acc
  }, {} as Record<string, { projectName: string; projectId: string; tasks: typeof tasks }>)

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">All caught up! 🎉</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          No pending tasks. Great job staying on top of your work!
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
        >
          View All Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByProject).map(([projectId, group]) => (
        <div key={projectId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <Link href={`/projects/${projectId}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {group.projectName}
            </Link>
            <span className="text-xs text-gray-500 ml-2">({group.tasks.length} pending)</span>
          </div>
          <div className="divide-y divide-gray-50">
            {group.tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors duration-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/projects/${task.projectId}`} className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function TasksPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Pending tasks"
        description="Tasks that need your attention."
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              <ArrowLeft aria-hidden="true" />
              View projects
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<TasksSkeleton />}>
        <TasksList />
      </Suspense>
    </div>
  )
}
