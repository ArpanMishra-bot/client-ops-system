import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock, Bell, AlertCircle, Zap, Heart, TrendingDown, TrendingUp as TrendingUpIcon } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await currentUser()
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: "Active Clients",
      value: stats.totalClients.toString(),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      href: "/clients",
      sub: `+${stats.newClientsThisMonth} new this month`,
      trend: stats.clientTrend,
    },
    {
      label: "Active Leads",
      value: stats.activeLeads.toString(),
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
      href: "/leads",
      sub: "In pipeline",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects.toString(),
      icon: FolderKanban,
      color: "bg-orange-50 text-orange-600",
      href: "/projects",
      sub: "In progress",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      href: "/invoices",
      sub: `$${stats.revenueThisMonth.toLocaleString()} this month`,
      trend: stats.revenueTrend,
    },
    {
      label: "Outstanding",
      value: `$${stats.outstanding.toLocaleString()}`,
      icon: FileText,
      color: "bg-yellow-50 text-yellow-600",
      href: "/invoices",
      sub: "Awaiting payment",
    },
    {
      label: "Pending Tasks",
      value: stats.pendingTasks.toString(),
      icon: Clock,
      color: "bg-red-50 text-red-600",
      href: "/tasks",
      sub: "Across all projects",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName ?? "there"} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${stats.healthBg}`}>
          <div className="flex items-center gap-2">
            <Heart className={`h-4 w-4 ${stats.healthColor}`} />
            <span className={`text-sm font-semibold ${stats.healthColor}`}>
              Health Score: {stats.healthScore}/100
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="block bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                    {stat.trend !== undefined && stat.trend !== 0 && (
                      <div className={`flex items-center gap-1 mt-2 text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend > 0 ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{Math.abs(stat.trend)}% from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Overdue Invoices Alert */}
      {stats.overdueInvoices.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Overdue Invoices</h3>
              <p className="text-sm text-red-700 mt-1">
                You have {stats.overdueInvoices.length} overdue invoice{stats.overdueInvoices.length !== 1 ? 's' : ''} totaling ${stats.overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.overdueInvoices.slice(0, 3).map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="text-xs bg-white px-3 py-1.5 rounded-lg text-red-700 hover:bg-red-100 transition-colors shadow-sm"
                  >
                    {invoice.number} - {invoice.client.name} (Due {new Date(invoice.dueDate).toLocaleDateString()})
                  </Link>
                ))}
                {stats.overdueInvoices.length > 3 && (
                  <Link href="/invoices" className="text-xs bg-white px-3 py-1.5 rounded-lg text-red-700 hover:bg-red-100 transition-colors shadow-sm">
                    +{stats.overdueInvoices.length - 3} more
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-gray-900" />
            <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Link href="/clients/new" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">Add New Client</span>
            </Link>
            <Link href="/leads/new" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700">Add New Lead</span>
            </Link>
            <Link href="/projects/new" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <FolderKanban className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm text-gray-700">Create Project</span>
            </Link>
            <Link href="/invoices/new" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Create Invoice</span>
            </Link>
            <Link href="/reminders" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                <Bell className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700">Add Reminder</span>
            </Link>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Clients</h2>
          {stats.recentClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No clients yet</p>
              <Link href="/clients/new" className="text-xs text-gray-900 font-medium mt-2 hover:underline">
                Add your first client →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentClients.map((client) => (
                <Link key={client.id} href={`/clients/${client.id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-medium">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                    {client.company && (
                      <p className="text-xs text-gray-500 truncate">{client.company}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
          {stats.upcomingReminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No upcoming reminders</p>
              <Link href="/reminders" className="text-xs text-gray-900 font-medium mt-2 hover:underline">
                Add a reminder →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-start gap-3 p-2">
                  <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(reminder.dueDate).toLocaleString()}
                    </p>
                    {reminder.client && (
                      <p className="text-xs text-gray-500 mt-1">Client: {reminder.client.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
