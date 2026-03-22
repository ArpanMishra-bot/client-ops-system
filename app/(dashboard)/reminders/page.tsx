import { getReminders } from "@/modules/reminders/actions"
import { Bell } from "lucide-react"
import AddReminderForm from "@/components/modules/reminders/AddReminderForm"
import ReminderItem from "@/components/modules/reminders/ReminderItem"

export default async function RemindersPage() {
  const reminders = await getReminders()

  const pending = reminders.filter(r => !r.isDone)
  const completed = reminders.filter(r => r.isDone)
  const overdue = pending.filter(r => new Date(r.dueDate) < new Date())

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reminders</h1>
          <p className="text-sm text-gray-500 mt-1">Stay on top of your follow-ups</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-semibold text-red-600">{overdue.length}</p>
          <p className="text-xs text-gray-500 mt-1">Overdue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-semibold text-green-600">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      <AddReminderForm />

      {reminders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No reminders yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add a reminder to stay on top of your work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Pending ({pending.length})</h2>
              <div className="space-y-2">
                {pending.map(reminder => (
                  <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Completed ({completed.length})</h2>
              <div className="space-y-2 opacity-60">
                {completed.map(reminder => (
                  <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
