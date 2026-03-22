import { currentUser } from "@clerk/nextjs/server"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock } from "lucide-react"

const stats = [
  {
    label: "Total Clients",
    value: "0",
    icon: Users,
    change: "No clients yet",
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Leads",
    value: "0",
    icon: TrendingUp,
    change: "No leads yet",
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Active Projects",
    value: "0",
    icon: FolderKanban,
    change: "No projects yet",
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Invoices Sent",
    value: "0",
    icon: FileText,
    change: "No invoices yet",
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Revenue",
    value: "$0",
    icon: DollarSign,
    change: "No payments yet",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Pending Tasks",
    value: "0",
    icon: Clock,
    change: "No tasks yet",
    color: "bg-red-50 text-red-600",
  },
]

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.firstName ?? "there"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No recent activity</p>
            <p className="text-xs text-gray-400 mt-1">Activity will appear here as you use the app</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No upcoming reminders</p>
            <p className="text-xs text-gray-400 mt-1">Set reminders to stay on top of your work</p>
          </div>
        </div>
      </div>
    </div>
  )
}
