"use client"

import { Plus } from "lucide-react"

export default function AddFirstReminderButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-reminder-form"))}
      className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
    >
      <Plus className="h-4 w-4" />
      Add your first reminder
    </button>
  )
}
