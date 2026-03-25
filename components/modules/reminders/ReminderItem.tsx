"use client"

import { useState } from "react"
import { toggleReminder, deleteReminder, updateReminder } from "@/modules/reminders/actions"
import { toast } from "sonner"
import { Check, Trash2, Pencil, Calendar, X } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog"
import type { Reminder } from "@/modules/reminders/types"

export default function ReminderItem({ reminder }: { reminder: Reminder }) {
  const [isDone, setIsDone] = useState(reminder.isDone)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState(reminder.title)
  const [editingDueDate, setEditingDueDate] = useState(
    reminder.dueDate ? new Date(reminder.dueDate).toISOString().slice(0, 16) : ""
  )
  const [editingDescription, setEditingDescription] = useState(reminder.description || "")
  const [editingType, setEditingType] = useState(reminder.type)
  const [editingLoading, setEditingLoading] = useState(false)

  const isOverdue = !isDone && new Date(reminder.dueDate) < new Date()

  async function handleToggle() {
    setLoading(true)
    const result = await toggleReminder(reminder.id, !isDone)
    if (result.success) {
      setIsDone(!isDone)
      toast.success(isDone ? "Reminder marked as pending" : "Reminder completed")
    } else {
      toast.error(result.error || "Failed to update reminder")
    }
    setLoading(false)
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteReminder(reminder.id)
    if (result.success) {
      toast.success("Reminder deleted successfully")
    } else {
      toast.error(result.error || "Failed to delete reminder")
      setDeleteDialogOpen(false)
    }
    setIsDeleting(false)
  }

  async function handleEdit() {
    if (!editingTitle.trim()) {
      toast.error("Title is required")
      return
    }

    setEditingLoading(true)
    const result = await updateReminder(reminder.id, {
      title: editingTitle.trim(),
      description: editingDescription,
      type: editingType,
      dueDate: editingDueDate,
    })

    if (result.success) {
      toast.success("Reminder updated successfully")
      setEditModalOpen(false)
    } else {
      toast.error(result.error || "Failed to update reminder")
    }
    setEditingLoading(false)
  }

  const typeLabels: Record<string, string> = {
    FOLLOW_UP: "Follow Up",
    MEETING: "Meeting",
    DEADLINE: "Deadline",
    PAYMENT: "Payment",
  }

  return (
    <>
      <div className={`bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all ${isDone ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isDone
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {isDone && <Check className="h-3 w-3 text-white" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-medium ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {reminder.title}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  reminder.type === "FOLLOW_UP" ? "bg-blue-50 text-blue-600" :
                  reminder.type === "MEETING" ? "bg-purple-50 text-purple-600" :
                  reminder.type === "DEADLINE" ? "bg-orange-50 text-orange-600" :
                  "bg-green-50 text-green-600"
                }`}>
                  {typeLabels[reminder.type] || reminder.type}
                </span>
                {isOverdue && !isDone && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Overdue</span>
                )}
              </div>
              {reminder.description && (
                <p className="text-xs text-gray-500 mt-1">{reminder.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(reminder.dueDate).toLocaleString()}</span>
                </div>
                {reminder.client && (
                  <span>Client: {reminder.client.name}</span>
                )}
                {reminder.lead && (
                  <span>Lead: {reminder.lead.name}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditModalOpen(true)}
              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
              title="Edit reminder"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete reminder"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={reminder.title}
        itemType="reminder"
        isDeleting={isDeleting}
      />

      {/* Edit Reminder Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Reminder</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editingType}
                  onChange={(e) => setEditingType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="MEETING">Meeting</option>
                  <option value="DEADLINE">Deadline</option>
                  <option value="PAYMENT">Payment</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="datetime-local"
                  value={editingDueDate}
                  onChange={(e) => setEditingDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editingLoading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {editingLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
