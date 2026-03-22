"use client"

import { useState } from "react"
import { toggleReminder, deleteReminder } from "@/modules/reminders/actions"
import { Trash2, Clock } from "lucide-react"

const typeColors: Record<string, string> = {
  FOLLOW_UP: "bg-blue-50 text-blue-600",
  MEETING: "bg-purple-50 text-purple-600",
  DEADLINE: "bg-red-50 text-red-600",
  PAYMENT: "bg-green-50 text-green-600",
  OTHER: "bg-gray-100 text-gray-600",
}

export default function ReminderItem({ reminder }: { reminder: any }) {
  const [loading, setLoading] = useState(false)
  const isOverdue = !reminder.isDone && new Date(reminder.dueDate) < new Date()

  async function handleToggle() {
    setLoading(true)
    try {
      await toggleReminder(reminder.id, !reminder.isDone)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this reminder?")) return
    try {
      await deleteReminder(reminder.id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={`bg-white rounded-xl border p-4 flex items-start gap-4 group transition-all ${
      isOverdue ? "border-red-200" : "border-gray-100"
    }`}>
      <input
        type="checkbox"
        checked={reminder.isDone}
        onChange={handleToggle}
        disabled={loading}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${reminder.isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
            {reminder.title}
          </p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[reminder.type] ?? typeColors.OTHER}`}>
            {reminder.type.replace("_", " ")}
          </span>
        </div>
        {reminder.description && (
          <p className="text-xs text-gray-500 mt-0.5">{reminder.description}</p>
        )}
        <div className="flex items-center gap-1 mt-1">
          <Clock className={`h-3 w-3 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
          <p className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-gray-400"}`}>
            {isOverdue ? "Overdue · " : ""}
            {new Date(reminder.dueDate).toLocaleString()}
          </p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
