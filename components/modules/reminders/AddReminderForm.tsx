"use client"

import { useState } from "react"
import { createReminder } from "@/modules/reminders/actions"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"

export default function AddReminderForm() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)

    const title = formData.get("title") as string
    const dueDate = formData.get("dueDate") as string

    const newErrors: Record<string, string> = {}

    if (!title || title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await createReminder({
      title: title.trim(),
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      dueDate: dueDate,
    })

    if (result.success) {
      toast.success("Reminder created successfully")
      form.reset()
      setShowForm(false)
      setErrors({})
    } else {
      toast.error(result.error || "Failed to create reminder")
    }

    setLoading(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Reminder
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">New Reminder</h2>
        <button
  onClick={() => setShowForm(true)}
  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200"
>
  <Plus className="h-4 w-4" />
  Add Reminder
</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Title *</label>
          <input 
            name="title"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.title ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Follow up with client..." 
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select name="type"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="MEETING">Meeting</option>
            <option value="DEADLINE">Deadline</option>
            <option value="PAYMENT">Payment</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date *</label>
          <input 
            name="dueDate" 
            type="datetime-local"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
              errors.dueDate ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Additional details..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
          {loading ? "Adding..." : "Add Reminder"}
        </button>
        <button type="button" onClick={() => setShowForm(false)}
          className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  )
}
