"use client"

import { useState } from "react"
import { createTask } from "@/modules/projects/actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export default function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    const result = await createTask({
      title: title.trim(),
      projectId,
      status: "TODO",
    })

    if (result.success) {
      toast.success("Task created successfully")
      setTitle("")
    } else {
      toast.error(result.error || "Failed to create task")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={loading}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  )
}
