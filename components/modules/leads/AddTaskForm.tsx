"use client"

import { useState } from "react"
import { createTask } from "@/modules/projects/actions"
import { toast } from "sonner"
import { Plus, Calendar } from "lucide-react"

export default function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    const result = await createTask({
      title: title.trim(),
      projectId,
      status: "TODO",
      dueDate: dueDate || null,
    })

    if (result.success) {
      toast.success("Task created successfully")
      setTitle("")
      setDueDate("")
    } else {
      toast.error(result.error || "Failed to create task")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={loading}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <div className="flex items-center gap-2">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
