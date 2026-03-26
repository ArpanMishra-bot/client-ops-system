import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import RevenueChart from "@/components/dashboard/RevenueChart"
import PipelineChart from "@/components/dashboard/PipelineChart"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock, Bell, Zap, UserPlus, Briefcase, Receipt, Calendar, TrendingDown, TrendingUp as TrendingUpIcon } from "lucide-react"
import Link from "next/link"

async function DashboardStats() {
  const stats = await getDashboardStats()
  
  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: Users, color: "bg-blue-50 text-blue-600", href: "/clients", sub: "Total active clients", trend: stats.clientTrend },
    { label: "Active Leads", value: stats.activeLeads.toString(), icon: TrendingUp, color: "bg-purple-50 text-purple-600", href: "/leads", sub: "In pipeline", trend: stats.leadsTrend },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: FolderKanban, color: "bg-orange-50 text-orange-600", href: "/projects", sub: "In progress", trend: stats.projectsTrend },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-50 text-green-600", href: "/invoices", sub: "From paid invoices", trend: stats.revenueTrend },
    { label: "Outstanding", value: `$${stats.outstanding.toLocaleString()}`, icon: FileText, color: "bg-yellow-50 text-yellow-600", href: "/invoices", sub: "Awaiting payment", trend: null },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: Clock, color: "bg-red-50 text-red-600", href: "/tasks", sub: "Across all projects", trend: stats.tasksTrend },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        const trendValue = stat.trend
        const isPositive = trendValue && trendValue > 0
        const isNegative = trendValue && trendValue < 0
        
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
                {trendValue !== null && trendValue !== 0 && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
                    {isPositive && <TrendingUpIcon className="h-3 w-3" />}
                    {isNegative && <TrendingDown className="h-3 w-3" />}
                    <span>{isPositive ? '+' : ''}{trendValue}% from last month</span>
                  </div>
                )}
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

async function TopClients() {
  const stats = await getDashboardStats()
  
  if (stats.topClients.length === 0) {
    return null
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Clients by Revenue</h2>
      <div className="space-y-3">
        {stats.topClients.map((client) => (
          <div key={client.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500">${client.revenue.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${client.trend > 0 ? 'text-green-600' : client.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {client.trend > 0 && <TrendingUpIcon className="h-3 w-3" />}
              {client.trend < 0 && <TrendingDown className="h-3 w-3" />}
              <span>{client.trend > 0 ? '+' : ''}{client.trend}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function ActivityFeed() {
  const stats = await getDashboardStats()
  
  if (stats.recentActivities.length === 0) {
    return null
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity Feed</h2>
      <div className="space-y-3">
        {stats.recentActivities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-2 h-2 rounded-full bg-gray-900 mt-1.5" />
            <div>
              <p className="text-sm text-gray-700">
                {activity.type === "invoice" ? (
                  activity.action === "paid" 
                    ? `Invoice paid: ${activity.name} - $${activity.amount?.toLocaleString()}`
                    : `Created invoice for ${activity.name}`
                ) : (
                  `Added new client: ${activity.name}`
                )}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function RecentClients() {
  const stats = await getDashboardStats()
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Clients</h2>
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link href="/clients/new" className="text-xs text-gray-900 font-medium hover:underline">Add your first client →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any) => (
            <Link key={client.id} href={`/clients/${client.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
      {stats.upcomingReminders.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No upcoming reminders</p>
          <Link href="/reminders" className="text-xs text-gray-900 font-medium hover:underline">Add a reminder →</Link>
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

async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Revenue Trend</h2>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </div>
      <RevenueChart data={stats.revenueChartData} />
    </div>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  
  if (stats.pipelineData.length === 0) {
    return null
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Pipeline Value by Stage</h2>
        <span className="text-xs text-gray-400">Deal value per stage</span>
      </div>
      <PipelineChart data={stats.pipelineData} />
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="bg-white rounded-xl border p-6 h-64 animate-pulse" />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl border p-6 h-64 animate-pulse" />}>
          <DashboardPipelineChart />
        </Suspense>
      </div>

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
        <TopClients />
        <ActivityFeed />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentClients />
        <UpcomingReminders />
      </div>
    </div>
  )
}
