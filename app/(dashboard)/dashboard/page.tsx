import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import RevenueChart from "@/components/dashboard/RevenueChart"
import PipelineChart from "@/components/dashboard/PipelineChart"
import StatCard from "@/components/dashboard/StatCard"
import { Users, TrendingUp, FolderKanban, FileText, DollarSign, Clock, Bell, Zap, UserPlus, Briefcase, Receipt, Calendar, TrendingDown, TrendingUp as TrendingUpIcon } from "lucide-react"
import Link from "next/link"

async function DashboardStats() {
  const stats = await getDashboardStats()
  
  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: <Users className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/clients", sub: "Total active clients", trend: stats.clientTrend },
    { label: "Active Leads", value: stats.activeLeads.toString(), icon: <TrendingUp className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/leads", sub: "In pipeline", trend: stats.leadsTrend },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: <FolderKanban className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/projects", sub: "In progress", trend: stats.projectsTrend },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/invoices", sub: "From paid invoices", trend: stats.revenueTrend },
    { label: "Outstanding", value: `$${stats.outstanding.toLocaleString()}`, icon: <FileText className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/invoices", sub: "Awaiting payment", trend: null },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: <Clock className="h-5 w-5 text-white" />, color: "from-indigo-500 to-indigo-700", href: "/tasks", sub: "Across all projects", trend: stats.tasksTrend },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

async function TopClients() {
  const stats = await getDashboardStats()
  
  if (stats.topClients.length === 0) return null
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent mb-4">Top Clients by Revenue</h2>
      <div className="space-y-3">
        {stats.topClients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="flex items-center justify-between p-2 rounded-xl transition-all duration-200 hover:bg-white/50 active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)]"
          >
            <div>
              <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">{client.name}</p>
              <p className="text-xs text-gray-500">${client.revenue.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${client.trend > 0 ? 'text-green-600' : client.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {client.trend > 0 && <TrendingUpIcon className="h-3 w-3" />}
              {client.trend < 0 && <TrendingDown className="h-3 w-3" />}
              <span>{client.trend > 0 ? '+' : ''}{client.trend}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function ActivityFeed() {
  const stats = await getDashboardStats()
  
  if (stats.recentActivities.length === 0) return null
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent mb-4">Activity Feed</h2>
      <div className="space-y-3">
        {stats.recentActivities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-2 hover:bg-white/50 rounded-xl transition-colors">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
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
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent mb-4">Recent Clients</h2>
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link href="/clients/new" className="text-xs bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent font-medium mt-2 hover:underline">Add your first client →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-white/50 active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)]"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">{client.name}</p>
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
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent mb-4">Upcoming Reminders</h2>
      {stats.upcomingReminders.length === 0 ? (
        <Link 
          href="/reminders"
          className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)]"
        >
          <div>
            <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Add a Reminder</p>
            <p className="text-xs text-gray-500 mt-0.5">Create a new reminder</p>
          </div>
          <span className="text-indigo-500 text-lg group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      ) : (
        <Link 
          href="/reminders#pending"
          className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)]"
        >
          <div>
            <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">View Pending Reminders</p>
            <p className="text-xs text-gray-500 mt-0.5">{stats.upcomingReminders.length} reminder{stats.upcomingReminders.length !== 1 ? 's' : ''} pending</p>
          </div>
          <span className="text-indigo-500 text-lg group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      )}
    </div>
  )
}
async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Revenue Trend</h2>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </div>
      <RevenueChart data={stats.revenueChartData} />
    </div>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  
  if (stats.pipelineData.length === 0) return null
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Pipeline Value by Stage</h2>
        <span className="text-xs text-gray-400">Deal value per stage</span>
      </div>
      <PipelineChart data={stats.pipelineData} />
    </div>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "from-indigo-500 to-indigo-700" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "from-indigo-500 to-indigo-700" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "from-indigo-500 to-indigo-700" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "from-indigo-500 to-indigo-700" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "from-indigo-500 to-indigo-700" },
  ]

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent rounded-2xl" />
        <div className="relative">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Welcome back, {user?.firstName ?? "there"} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-80 animate-pulse" />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-80 animate-pulse" />}>
          <DashboardPipelineChart />
        </Suspense>
      </div>

      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center text-center p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)]"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <TopClients />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <RecentClients />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <UpcomingReminders />
        </Suspense>
      </div>
    </div>
  )
}
