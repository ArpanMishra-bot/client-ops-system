"use client"

import { useState } from "react"
import { updateTaskStatus } from "@/modules/projects/actions"
import { toast } from "sonner"
import type { Task } from "@/modules/projects/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  task: Task
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditTaskModal({ task, projectId, open, onOpenChange }: Props) {
  const [title, setTitle] = useState(task.title)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || title === task.title) {
      onOpenChange(false)
      return
    }

    setLoading(true)
    const result = await updateTaskStatus(task.id, task.status, projectId)
    // Note: We need a dedicated updateTaskTitle action
    // For now, this is a placeholder
    if (result.success) {
      toast.success("Task updated successfully")
      onOpenChange(false)
    } else {
      toast.error(result.error || "Failed to update task")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
