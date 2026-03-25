"use client"

import { useState } from "react"
import { updateTaskStatus, deleteTask } from "@/modules/projects/actions"
import { toast } from "sonner"
import type { Task, TaskStatus } from "@/modules/projects/types"
import { TASK_STATUS_CONFIG } from "@/modules/projects/types"
import { Trash2, ChevronRight, Pencil } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"
import EditTaskModal from "./EditTaskModal"

type Props = {
  task: Task
  projectId: string
}

export default function TaskItem({ task, projectId }: Props) {
  const [showMove, setShowMove] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleMove(status: TaskStatus) {
    setLoading(true)
    setShowMove(false)
    const result = await updateTaskStatus(task.id, status, projectId)
    if (result.success) {
      toast.success(`Task moved to ${TASK_STATUS_CONFIG[status].label}`)
    } else {
      toast.error(result.error || "Failed to move task")
    }
    setLoading(false)
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteTask(task.id, projectId)
    if (result.success) {
      toast.success("Task deleted successfully")
    } else {
      toast.error(result.error || "Failed to delete task")
      setDeleteDialogOpen(false)
    }
    setIsDeleting(false)
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-3 group relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-900">{task.title}</p>
            {task.dueDate && (
              <p className="text-xs text-gray-400 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditDialogOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={task.title}
        itemType="task"
        isDeleting={isDeleting}
      />

      <EditTaskModal
        task={task}
        projectId={projectId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  )
}
