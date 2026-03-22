"use client"

import { useState } from "react"
import { updateTaskStatus, deleteTask } from "@/modules/projects/actions"
import type { Task, TaskStatus } from "@/modules/projects/types"
import { TASK_STATUS_CONFIG } from "@/modules/projects/types"
import { Trash2, ChevronRight } from "lucide-react"

type Props = {
  task: Task
  projectId: string
}

export default function TaskItem({ task, projectId }: Props) {
  const [showMove, setShowMove] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMove(status: TaskStatus) {
    setLoading(true)
    setShowMove(false)
    try {
      await updateTaskStatus(task.id, status, projectId)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return
    try {
      await deleteTask(task.id, projectId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 group relative">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-gray-900 flex-1">{task.title}</p>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-2 relative">
        <button
          onClick={() => setShowMove(!showMove)}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
          <span>{loading ? "Moving..." : "Move"}</span>
        </button>

        {showMove && (
          <div className="absolute left-0 top-5 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36">
            {Object.entries(TASK_STATUS_CONFIG)
              .filter(([s]) => s !== task.status)
              .map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => handleMove(status as TaskStatus)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <span className={`font-medium ${config.color}`}>{config.label}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
