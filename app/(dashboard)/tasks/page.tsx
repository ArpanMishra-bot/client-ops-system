import { getPendingTasks } from "@/modules/tasks/actions"
import { ArrowLeft, CheckCircle2, Calendar } from "lucide-react"
import Link from "next/link"

export default async function TasksPage() {
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pending Tasks</h1>
        <p className="text-sm text-gray-500 mt-1">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} need your attention
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">All caught up! 🎉</h3>
          <p className="text-sm text-gray-500 mt-1">No pending tasks. Great job!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByProject).map(([projectId, group]) => (
            <div key={projectId} className="bg-white rounded-xl border overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <Link href={`/projects/${projectId}`} className="font-semibold text-gray-900 hover:underline">
                  {group.projectName}
                </Link>
                <span className="text-xs text-gray-500 ml-2">({group.tasks.length} pending)</span>
              </div>
              <div className="divide-y">
                {group.tasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <Link href={`/projects/${task.projectId}`} className="text-xs text-gray-500 hover:text-gray-900">
                        View Project →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
