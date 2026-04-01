import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import CustomRevenueChart from "@/components/dashboard/CustomRevenueChart"
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
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

// Collapsible wrapper for mobile with premium styling
function CollapsibleCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <details className="card-premium overflow-hidden group animate-rise">
      <summary className="cursor-pointer px-6 py-4 text-sm font-semibold select-none transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-indigo-500">{icon}</span>}
          <span className="gradient-text">{title}</span>
        </div>
        <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">▼</span>
      </summary>
      <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800">
        {children}
      </div>
    </details>
  )
}

async function DashboardStats() {
  const stats = await getDashboardStats()
  const statCards = [
    { 
      label: "Active Clients", 
      value: stats.totalClients.toString(), 
      icon: <Users className="h-5 w-5 text-white" />, 
      color: "from-purple-500 to-indigo-600", 
      href: "/clients", 
      sub: "Total active clients", 
      trend: stats.clientTrend,
      description: "Currently active clients"
    },
    { 
      label: "Active Leads", 
      value: stats.activeLeads.toString(), 
      icon: <TrendingUp className="h-5 w-5 text-white" />, 
      color: "from-teal-500 to-blue-600", 
      href: "/leads", 
      sub: "In pipeline", 
      trend: stats.leadsTrend,
      description: "Qualified leads"
    },
    { 
      label: "Active Projects", 
      value: stats.activeProjects.toString(), 
      icon: <FolderKanban className="h-5 w-5 text-white" />, 
      color: "from-pink-500 to-rose-600", 
      href: "/projects", 
      sub: "In progress", 
      trend: stats.projectsTrend,
      description: "Ongoing projects"
    },
    { 
      label: "Total Revenue", 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: <DollarSign className="h-5 w-5 text-white" />, 
      color: "from-indigo-500 to-purple-600", 
      href: "/invoices", 
      sub: "From paid invoices", 
      trend: stats.revenueTrend,
      description: "Year-to-date revenue"
    },
    { 
      label: "Outstanding", 
      value: `$${stats.outstanding.toLocaleString()}`, 
      icon: <FileText className="h-5 w-5 text-white" />, 
      color: "from-blue-500 to-indigo-600", 
      href: "/invoices", 
      sub: "Awaiting payment", 
      trend: stats.outstandingTrend,
      description: "Pending invoices"
    },
    { 
      label: "Pending Tasks", 
      value: stats.pendingTasks.toString(), 
      icon: <Clock className="h-5 w-5 text-white" />, 
      color: "from-green-500 to-teal-600", 
      href: "/tasks", 
      sub: "Across all projects", 
      trend: stats.tasksTrend,
      description: "Tasks due soon"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <div key={stat.label} className="animate-rise" style={{ animationDelay: `${index * 50}ms` }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  )
}

async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  return (
    <CollapsibleCard title="Revenue Overview" icon={<DollarSign className="h-4 w-4" />}>
      <CustomRevenueChart data={stats.revenueChartData} />
    </CollapsibleCard>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  if (stats.pipelineData.length === 0) return null
  return (
    <CollapsibleCard title="Pipeline Value by Stage" icon={<TrendingUp className="h-4 w-4" />}>
      <PipelineChart data={stats.pipelineData} />
    </CollapsibleCard>
  )
}

async function TopClients() {
  const stats = await getDashboardStats()
  if (stats.topClients.length === 0) return null
  return (
    <CollapsibleCard title="Top Clients by Revenue" icon={<Users className="h-4 w-4" />}>
      <div className="space-y-3">
        {stats.topClients.map((client, index) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 
                       hover:bg-gray-50 dark:hover:bg-gray-800/50 
                       active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                  <p className="text-xs font-mono text-gray-500">${client.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-mono font-medium ${
              client.trend > 0 ? 'text-green-600' : client.trend < 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {client.trend > 0 && <ArrowUpRight className="h-3 w-3" />}
              {client.trend < 0 && <ArrowDownRight className="h-3 w-3" />}
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
    <CollapsibleCard title="Activity Feed" icon={<Clock className="h-4 w-4" />}>
      <div className="space-y-4">
        {stats.recentActivities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 group">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 ring-4 ring-indigo-100 dark:ring-indigo-900/30" />
              {i < stats.recentActivities.length - 1 && (
                <div className="absolute top-4 left-1 w-px h-8 bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {activity.type === "invoice"
                  ? activity.action === "paid"
                    ? `💰 Invoice paid: ${activity.name} - $${activity.amount?.toLocaleString()}`
                    : `📄 Created invoice for ${activity.name}`
                  : `👤 Added new client: ${activity.name}`}
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1">
                {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    <CollapsibleCard title="Recent Clients" icon={<UserPlus className="h-4 w-4" />}>
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link 
            href="/clients/new" 
            className="inline-flex items-center gap-1 text-sm gradient-text font-medium mt-3 hover:gap-2 transition-all"
          >
            Add your first client
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any, index: number) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
                         hover:bg-gray-50 dark:hover:bg-gray-800/50 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{client.name}</p>
                {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-400">
                  {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </CollapsibleCard>
  )
}

async function UpcomingReminders() {
  const stats = await getDashboardStats()
  const reminderCount = stats.upcomingReminders.length
  return (
    <CollapsibleCard title="Reminders" icon={<Calendar className="h-4 w-4" />}>
      {reminderCount === 0 ? (
        <Link 
          href="/reminders"
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-semibold gradient-text">No pending reminders</p>
              </div>
              <p className="text-xs text-gray-500">Create your first reminder to stay organized</p>
            </div>
            <span className="text-indigo-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      ) : (
        <Link 
          href="/reminders#pending"
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-sm font-semibold gradient-text">{reminderCount} Pending Reminder{reminderCount !== 1 ? "s" : ""}</p>
              </div>
              <p className="text-xs text-gray-500">Click to view and manage</p>
            </div>
            <span className="text-indigo-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      )}
    </CollapsibleCard>
  )
}

export default async function DashboardPage() {
  const user = await currentUser()

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "from-purple-500 to-indigo-600", description: "Create new client profile" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "from-teal-500 to-blue-600", description: "Track new opportunity" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "from-pink-500 to-rose-600", description: "Start a new project" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "from-indigo-500 to-purple-600", description: "Send an invoice" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "from-green-500 to-teal-600", description: "Set a reminder" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section with Premium Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 p-8 animate-rise">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 dark:bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100/30 dark:bg-indigo-900/20 rounded-full blur-3xl -ml-24 -mb-24" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">👋</span>
            <h1 className="text-3xl font-serif font-light tracking-tight">
              Welcome back, <span className="gradient-text font-medium">{user?.firstName ?? "there"}</span>
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Here's what's happening with your business today. You have <span className="font-semibold text-indigo-600 dark:text-indigo-400">{stats?.pendingTasks || 0} pending tasks</span> that need attention.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="card-premium p-6 h-[520px] animate-pulse" />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<div className="card-premium p-6 h-[520px] animate-pulse" />}>
          <DashboardPipelineChart />
        </Suspense>
      </div>

      {/* Quick Actions - Premium Redesign */}
      <div className="card-premium p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold gradient-text">Quick Actions</h2>
              <p className="text-xs text-gray-500">Common tasks to help you move faster</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group relative flex flex-col items-center text-center p-4 rounded-xl 
                             bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700
                             transition-all duration-200 
                             hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800
                             active:scale-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
                                   flex items-center justify-center mb-3 
                                   group-hover:scale-110 transition-transform duration-300 
                                   shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                  <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">{action.description}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clients & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="card-premium p-6 h-80 animate-pulse" />}>
          <TopClients />
        </Suspense>
        <Suspense fallback={<div className="card-premium p-6 h-80 animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>

      {/* Recent Clients & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="card-premium p-6 h-80 animate-pulse" />}>
          <RecentClients />
        </Suspense>
        <Suspense fallback={<div className="card-premium p-6 h-80 animate-pulse" />}>
          <UpcomingReminders />
        </Suspense>
      </div>
    </div>
  )
          }
