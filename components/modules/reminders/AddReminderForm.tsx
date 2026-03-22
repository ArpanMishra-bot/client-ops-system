"use client"

import { useState } from "react"
import { createReminder } from "@/modules/reminders/actions"
import { Plus } from "lucide-react"

export default function AddReminderForm() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await createReminder({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        dueDate: formData.get("dueDate") as string,
      })
      form.reset()
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
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Reminder
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">New Reminder</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Title *</label>
          <input name="title" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Follow up with client..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select name="type"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="MEETING">Meeting</option>
            <option value="DEADLINE">Deadline</option>
            <option value="PAYMENT">Payment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date *</label>
          <input name="dueDate" type="datetime-local" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
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
        <button type="button" onClick={() => setShow(false)}
          className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  )
}
