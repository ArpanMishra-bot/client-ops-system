"use client"

import { useState } from "react"
import { createTask } from "@/modules/projects/actions"
import { Plus } from "lucide-react"

export default function AddTaskForm({ projectId }: { projectId: string }) {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await createTask({ projectId, title })
      setTitle("")
      setShow(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        autoFocus
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>
    </form>
  )
}
