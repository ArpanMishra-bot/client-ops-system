"use client"

import { useState } from "react"
import { updateTaskStatus, deleteTask } from "@/modules/projects/actions"
import { toast } from "sonner"
import type { Task, TaskStatus } from "@/modules/projects/types"
import { TASK_STATUS_CONFIG } from "@/modules/projects/types"
import { Trash2, ChevronRight, Pencil } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"

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
  const [editingTitle, setEditingTitle] = useState(task.title)
  const [editingLoading, setEditingLoading] = useState(false)

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

  async function handleEditTitle() {
    if (!editingTitle.trim() || editingTitle === task.title) {
      setEditDialogOpen(false)
      return
    }

    setEditingLoading(true)
    // Note: We need to add updateTaskTitle action
    // For now, just close and show warning
    toast.info("Edit task title feature coming soon")
    setEditDialogOpen(false)
    setEditingLoading(false)
  }

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-3 group relative hover:bg-gray-100 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-900">{task.title}</p>
            {task.dueDate && (
              <p className="text-xs text-gray-400 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditDialogOpen(true)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1"
              title="Edit task"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete task"
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

      {/* Edit Task Modal */}
      {editDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h2>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditDialogOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTitle}
                disabled={editingLoading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {editingLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
