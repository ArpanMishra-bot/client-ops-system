import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import RevenueChart from "@/components/dashboard/RevenueChart"
import PipelineChart from "@/components/dashboard/PipelineChart"
import StatCard from "@/components/dashboard/StatCard"
import {
  Users,
  TrendingUp,
  FolderKanban,
  FileText,
  DollarSign,
  Clock,
  Zap,
  UserPlus,
  Briefcase,
  Receipt,
  Calendar,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
} from "lucide-react"
import Link from "next/link"

// Collapsible wrapper for mobile
function CollapsibleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="glass-card rounded-xl overflow-hidden">
      <summary className="cursor-pointer px-6 py-3 text-sm font-semibold gradient-text select-none 
                          hover:bg-white/40 active:bg-indigo-50 transition-colors">
        {title}
      </summary>
      <div className="p-6">{children}</div>
    </details>
  )
}

async function DashboardStats() {
  const stats = await getDashboardStats()
  const statCards = [
    { label: "Active Clients", value: stats.totalClients.toString(), icon: <Users className="h-5 w-5 text-white" />, color: "from-purple-400 to-indigo-500", href: "/clients", sub: "Total active clients", trend: stats.clientTrend },
    { label: "Active Leads", value: stats.activeLeads.toString(), icon: <TrendingUp className="h-5 w-5 text-white" />, color: "from-teal-400 to-blue-500", href: "/leads", sub: "In pipeline", trend: stats.leadsTrend },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: <FolderKanban className="h-5 w-5 text-white" />, color: "from-pink-400 to-rose-500", href: "/projects", sub: "In progress", trend: stats.projectsTrend },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-white" />, color: "from-indigo-400 to-purple-500", href: "/invoices", sub: "From paid invoices", trend: stats.revenueTrend },
    { label: "Outstanding", value: `$${stats.outstanding.toLocaleString()}`, icon: <FileText className="h-5 w-5 text-white" />, color: "from-blue-400 to-indigo-500", href: "/invoices", sub: "Awaiting payment", trend: stats.outstandingTrend },
    { label: "Pending Tasks", value: stats.pendingTasks.toString(), icon: <Clock className="h-5 w-5 text-white" />, color: "from-green-400 to-teal-500", href: "/tasks", sub: "Across all projects", trend: stats.tasksTrend },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  return (
    <CollapsibleCard title="Revenue Trend">
      <RevenueChart data={stats.revenueChartData} />
    </CollapsibleCard>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  if (stats.pipelineData.length === 0) return null
  return (
    <CollapsibleCard title="Pipeline Value by Stage">
      <PipelineChart data={stats.pipelineData} />
    </CollapsibleCard>
  )
}

async function TopClients() {
  const stats = await getDashboardStats()
  if (stats.topClients.length === 0) return null
  return (
    <CollapsibleCard title="Top Clients by Revenue">
      <div className="space-y-3">
        {stats.topClients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="flex items-center justify-between p-2 rounded-xl transition-all duration-200 
                       hover:bg-white/50 active:bg-indigo-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <div>
              <p className="text-sm font-medium gradient-text">{client.name}</p>
              <p className="text-xs text-gray-500 font-mono">${client.revenue.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${client.trend > 0 ? 'text-green-500' : client.trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {client.trend > 0 && <TrendingUpIcon className="h-3 w-3" />}
              {client.trend < 0 && <TrendingDown className="h-3 w-3" />}
              <span>{client.trend > 0 ? '+' : ''}{client.trend}%</span>
            </div>
          </Link>
        ))}
      </div>
    </CollapsibleCard>
  )
}

async function ActivityFeed() {
  const stats = await getDashboardStats()
  if (stats.recentActivities.length === 0) return null
  return (
    <CollapsibleCard title="Activity Feed">
      <div className="space-y-3">
        {stats.recentActivities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 p-2 rounded-xl transition-colors 
                                  hover:bg-white/50 active:bg-indigo-50 active:scale-95">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
            <div>
              <p className="text-sm text-gray-700">
                {activity.type === "invoice"
                  ? activity.action === "paid"
                    ? `Invoice paid: ${activity.name} - $${activity.amount?.toLocaleString()}`
                    : `Created invoice for ${activity.name}`
                  : `Added new client: ${activity.name}`}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  )
}

async function RecentClients() {
  const stats = await getDashboardStats()
  return (
    <CollapsibleCard title="Recent Clients">
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link href="/clients/new" className="text-xs gradient-text font-medium mt-2 hover:underline">Add your first client →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 
                         hover:bg-white/50 active:bg-indigo-50 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium gradient-text">{client.name}</p>
                {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
              </div>
                            <p className="text-xs text-gray-400 font-mono">
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </CollapsibleCard>
  )
}

async function UpcomingReminders() {
  const stats = await getDashboardStats()
  return (
    <CollapsibleCard title="Upcoming Reminders">
      {stats.upcomingReminders.length === 0 ? (
        <Link 
          href="/reminders"
          className="group flex items-center justify-between p-4 rounded-xl 
                     bg-gradient-to-r from-indigo-50 to-indigo-100/50 
                     hover:from-indigo-100 hover:to-indigo-200/50 
                     active:bg-indigo-50 active:scale-95 
                     transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <div>
            <p className="text-sm font-semibold gradient-text">Add a Reminder</p>
            <p className="text-xs text-gray-500 mt-0.5">Create a new reminder</p>
          </div>
          <span className="text-indigo-500 text-lg group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      ) : (
        <Link 
          href="/reminders#pending"
          className="group flex items-center justify-between p-4 rounded-xl 
                     bg-gradient-to-r from-indigo-50 to-indigo-100/50 
                     hover:from-indigo-100 hover:to-indigo-200/50 
                     active:bg-indigo-50 active:scale-95 
                     transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <div>
            <p className="text-sm font-semibold gradient-text">View Pending Reminders</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {stats.upcomingReminders.length} reminder{stats.upcomingReminders.length !== 1 ? "s" : ""} pending
            </p>
          </div>
          <span className="text-indigo-500 text-lg group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      )}
    </CollapsibleCard>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "from-purple-400 to-indigo-500" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "from-teal-400 to-blue-500" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "from-pink-400 to-rose-500" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "from-indigo-400 to-purple-500" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "from-green-400 to-teal-500" },
  ]

  return (
    <div className="space-y-10 font-sans">
      {/* Welcome Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent rounded-2xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold gradient-text tracking-tight">
            Welcome back, {user?.firstName ?? "there"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here’s what’s happening with your business today.</p>
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-80 animate-pulse" />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-80 animate-pulse" />}>
          <DashboardPipelineChart />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-indigo-600 hover-glow" />
            <h2 className="text-sm font-semibold gradient-text">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center text-center p-3 rounded-xl 
                             bg-white/70 backdrop-blur-sm border border-gray-100 
                             transition-all duration-200 
                             hover:-translate-y-1 hover:shadow-lg 
                             active:scale-95 active:bg-indigo-50 
                             focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} 
                                   flex items-center justify-center mb-2 
                                   group-hover:scale-110 transition-transform duration-300 
                                   active:ring-2 active:ring-indigo-300`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-gray-700">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clients & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <TopClients />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>

      {/* Recent Clients & Reminders */}
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

              
