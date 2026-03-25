export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock, Bell, Zap } from "lucide-react"
import Link from "next/link"

async function DashboardStats() {
  const stats = await getDashboardStats()
  
  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: Users, color: "bg-blue-50 text-blue-600", href: "/clients", sub: "Total active clients" },
    { label: "Active Leads", value: stats.activeLeads.toString(), icon: TrendingUp, color: "bg-purple-50 text-purple-600", href: "/leads", sub: "In pipeline" },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: FolderKanban, color: "bg-orange-50 text-orange-600", href: "/projects", sub: "In progress" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-50 text-green-600", href: "/invoices", sub: "From paid invoices" },
    { label: "Outstanding", value: `$${stats.outstanding.toLocaleString()}`, icon: FileText, color: "bg-yellow-50 text-yellow-600", href: "/invoices", sub: "Awaiting payment" },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: Clock, color: "bg-red-50 text-red-600", href: "/tasks", sub: "Across all projects" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Link key={stat.label} href={stat.href} className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

async function RecentClients() {
  const stats = await getDashboardStats()
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Clients</h2>
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link href="/clients/new" className="text-xs text-gray-900 font-medium mt-2 inline-block">Add your first client →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any) => (
            <Link key={client.id} href={`/clients/${client.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
              </div>
              <p className="text-xs text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

async function UpcomingReminders() {
  const stats = await getDashboardStats()
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
      {stats.upcomingReminders.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No upcoming reminders</p>
          <Link href="/reminders" className="text-xs text-gray-900 font-medium mt-2 inline-block">Add a reminder →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.upcomingReminders.map((reminder: any) => (
            <div key={reminder.id} className="flex items-start gap-3 p-2">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{reminder.title}</p>
                <p className="text-xs text-gray-400">{new Date(reminder.dueDate).toLocaleString()}</p>
                {reminder.client && <p className="text-xs text-gray-500 mt-1">Client: {reminder.client.name}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName ?? "there"} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Stats with Skeleton */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-gray-900" />
          <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/clients/new" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">+ Add Client</Link>
          <Link href="/leads/new" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">+ Add Lead</Link>
          <Link href="/projects/new" className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">+ Create Project</Link>
          <Link href="/invoices/new" className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">+ Create Invoice</Link>
          <Link href="/reminders" className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">+ Add Reminder</Link>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentClients />
        <UpcomingReminders />
      </div>
    </div>
  )
}
