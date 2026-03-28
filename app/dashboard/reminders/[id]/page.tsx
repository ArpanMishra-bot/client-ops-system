import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"

interface Props {
  params: { id: string }
}

export default async function ReminderDetailPage({ params }: Props) {
  const reminder = await prisma.reminder.findUnique({
    where: { id: params.id },
    include: { client: true }
  })

  if (!reminder) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/reminders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" />
        Back to reminders
      </Link>
      
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{reminder.title}</h1>
        </div>
        
        <p className="text-sm text-gray-500">Due: {new Date(reminder.dueDate).toLocaleString()}</p>
        {reminder.client && <p className="text-sm text-gray-500 mt-2">Client: {reminder.client.name}</p>}
      </div>
    </div>
  )
}
