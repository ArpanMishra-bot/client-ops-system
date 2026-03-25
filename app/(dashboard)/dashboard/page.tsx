import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock, Bell, Zap, UserPlus, Briefcase, Receipt, Calendar, Activity, TrendingDown, TrendingUp as TrendingUpIcon } from "lucide-react"
import Link from "next/link"

async function DashboardStats() {
  const stats = await getDashboardStats()
  
  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: Users, color: "bg-blue-50 text-blue-600", href: "/clients", sub: "Total active clients", trend: "+12%", trendUp: true },
    { label: "Active Leads", value: stats.activeLeads.toString(), icon: TrendingUp, color: "bg-purple-50 text-purple-600", href: "/leads", sub: "In pipeline", trend: "+5%", trendUp: true },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: FolderKanban, color: "bg-orange-50 text-orange-600", href: "/projects", sub: "In progress", trend: "-2%", trendUp: false },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-50 text-green-600", href: "/invoices", sub: "From paid invoices", trend: "+18%", trendUp: true },
    { label: "Outstanding", value: `$${stats.outstanding.toLocaleString()}`, icon: FileText, color: "bg-yellow-50 text-yellow-600", href: "/invoices", sub: "Awaiting payment", trend: "+3%", trendUp: false },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: Clock, color: "bg-red-50 text-red-600", href: "/tasks", sub: "Across all projects", trend: "-5%", trendUp: true },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="block bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stat.trend}</span>
                </div>
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
  
  const topClients = [
    { name: "Acme Corp", revenue: 8400, growth: 23 },
    { name: "TechStart", revenue: 5200, growth: 12 },
    { name: "DesignCo", revenue: 3100, growth: -5 },
    { name: "Creative Labs", revenue: 2800, growth: 8 },
    { name: "Studio 9", revenue: 1900, growth: 15 },
  ]
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Clients by Revenue</h2>
      <div className="space-y-3">
        {topClients.map((client) => (
          <div key={client.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500">${client.revenue.toLocaleString()}</p>
            </div>
            <div className={`text-xs font-medium ${client.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {client.growth > 0 ? '↑' : '↓'} {Math.abs(client.growth)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function ActivityFeed() {
  const activities = [
    { id: 1, action: "Created invoice INV-0023", time: "2 minutes ago" },
    { id: 2, action: "Marked lead as WON", time: "1 hour ago" },
    { id: 3, action: "Added new client: Acme Corp", time: "3 hours ago" },
    { id: 4, action: "Invoice INV-0022 was paid", time: "Yesterday" },
  ]
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Activity Feed</h2>
        <Activity className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">{activity.action}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "bg-blue-50 text-blue-600" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "bg-purple-50 text-purple-600" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "bg-orange-50 text-orange-600" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "bg-green-50 text-green-600" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "bg-yellow-50 text-yellow-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName ?? "there"} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-gray-900" />
          <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center text-center p-3 rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium mt-2 text-gray-700">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentClients />
        <ActivityFeed />
      </div>
    </div>
  )
}
