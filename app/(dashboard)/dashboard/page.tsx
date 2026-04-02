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
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

// Collapsible wrapper for mobile with premium styling
function CollapsibleCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <details className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-indigo-200 transition-all duration-200">
      <summary className="cursor-pointer px-6 py-4 text-sm font-semibold select-none transition-colors hover:bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-indigo-500">{icon}</span>}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{title}</span>
        </div>
        <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
      </summary>
      <div className="p-6 pt-0 border-t border-gray-100">
        {children}
      </div>
    </details>
  )
}

// Helper function to suppress trend when no prior data
function shouldShowTrend(trend: number | null | undefined, hasPriorData: boolean): boolean {
  if (!hasPriorData) return false
  if (trend === null || trend === undefined) return false
  return true
}

async function DashboardStats() {
  const stats = await getDashboardStats()
  
  // Check if we have prior month data (more than 1 month of history)
  const hasPriorMonthData = stats.hasPriorMonthData ?? false
  
  const statCards = [
    { 
      label: "Active Clients", 
      value: stats.totalClients.toString(), 
      icon: <Users className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-indigo-500", // Primary accent
      href: "/clients", 
      sub: "Total active clients", 
      trend: stats.clientTrend,
      trendValue: stats.clientTrendRaw,
      hasPriorData: hasPriorMonthData && stats.clientTrendRaw !== undefined
    },
    { 
      label: "Active Leads", 
      value: stats.activeLeads.toString(), 
      icon: <TrendingUp className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-indigo-500", // Primary accent
      href: "/leads", 
      sub: "In pipeline", 
      trend: stats.leadsTrend,
      trendValue: stats.leadsTrendRaw,
      hasPriorData: hasPriorMonthData && stats.leadsTrendRaw !== undefined
    },
    { 
      label: "Active Projects", 
      value: stats.activeProjects.toString(), 
      icon: <FolderKanban className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-violet-500", // Secondary accent
      href: "/projects", 
      sub: "In progress", 
      trend: stats.projectsTrend,
      trendValue: stats.projectsTrendRaw,
      hasPriorData: hasPriorMonthData && stats.projectsTrendRaw !== undefined
    },
    { 
      label: "Total Revenue", 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: <DollarSign className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-indigo-500", // Primary accent
      href: "/invoices", 
      sub: "From paid invoices", 
      trend: stats.revenueTrend,
      trendValue: stats.revenueTrendRaw,
      hasPriorData: hasPriorMonthData && stats.revenueTrendRaw !== undefined
    },
    { 
      label: "Outstanding", 
      value: `$${stats.outstanding.toLocaleString()}`, 
      icon: <FileText className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-violet-500", // Secondary accent
      href: "/invoices", 
      sub: "Awaiting payment", 
      trend: stats.outstandingTrend,
      trendValue: stats.outstandingTrendRaw,
      hasPriorData: hasPriorMonthData && stats.outstandingTrendRaw !== undefined
    },
    { 
      label: "Pending Tasks", 
      value: stats.pendingTasks.toString(), 
      icon: <Clock className="h-5 w-5 text-white" />, 
      iconBgColor: "bg-violet-500", // Secondary accent
      href: "/tasks", 
      sub: "Across all projects", 
      trend: stats.tasksTrend,
      trendValue: stats.tasksTrendRaw,
      hasPriorData: hasPriorMonthData && stats.tasksTrendRaw !== undefined
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <div key={stat.label} style={{ animationDelay: `${index * 50}ms` }} className="animate-rise">
          <StatCard 
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            href={stat.href}
            sub={stat.sub}
            trend={stat.trend}
            trendValue={stat.trendValue}
            hasPriorData={stat.hasPriorData}
          />
        </div>
      ))}
    </div>
  )
}

async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  const hasData = stats.revenueChartData && stats.revenueChartData.length > 0
  
  return (
    <CollapsibleCard title="Revenue Overview" icon={<DollarSign className="h-4 w-4" />}>
      {hasData ? (
        <RevenueChart data={stats.revenueChartData} />
      ) : (
        <EmptyChartState message="No revenue data yet" />
      )}
    </CollapsibleCard>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  const hasData = stats.pipelineData && stats.pipelineData.length > 0
  
  if (!hasData) {
    return (
      <CollapsibleCard title="Pipeline Value by Stage" icon={<TrendingUp className="h-4 w-4" />}>
        <EmptyChartState message="No pipeline data yet" />
      </CollapsibleCard>
    )
  }
  
  return (
    <CollapsibleCard title="Pipeline Value by Stage" icon={<TrendingUp className="h-4 w-4" />}>
      <PipelineChart data={stats.pipelineData} />
    </CollapsibleCard>
  )
}

// Empty state component for charts
function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-sm text-gray-500 font-medium">{message}</p>
      <p className="text-xs text-gray-400 mt-1">Add data to see insights here</p>
    </div>
  )
}

async function TopClients() {
  const stats = await getDashboardStats()
  if (stats.topClients.length === 0) return null
  return (
    <CollapsibleCard title="Top Clients by Revenue" icon={<Users className="h-4 w-4" />}>
      <div className="space-y-3">
        {stats.topClients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 
                       hover:bg-gray-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-medium">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">${client.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              client.trend > 0 ? 'text-emerald-600' : client.trend < 0 ? 'text-rose-600' : 'text-gray-400'
            }`}>
              {client.trend > 0 && <ArrowUpRight className="h-3 w-3" />}
              {client.trend < 0 && <ArrowDownRight className="h-3 w-3" />}
              <span>{client.trend > 0 ? '+' : ''}{Math.round(Math.abs(client.trend))}%</span>
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
              <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 ring-4 ring-indigo-100" />
              {i < stats.recentActivities.length - 1 && (
                <div className="absolute top-4 left-1 w-px h-8 bg-gray-200" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {activity.type === "invoice"
                  ? activity.action === "paid"
                    ? `💰 Invoice paid: ${activity.name} - $${activity.amount?.toLocaleString()}`
                    : `📄 Created invoice for ${activity.name}`
                  : `👤 Added new client: ${activity.name}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
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
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link 
            href="/clients/new" 
            className="inline-flex items-center gap-1 text-sm bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-medium mt-3 hover:gap-2 transition-all"
          >
            Add your first client
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.recentClients.map((client: any) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
                         hover:bg-gray-50 active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
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
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">No pending reminders</p>
              <p className="text-xs text-gray-500 mt-1">Create your first reminder to stay organized</p>
            </div>
            <span className="text-indigo-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      ) : (
        <Link 
          href="/reminders#pending"
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{reminderCount} Pending Reminder{reminderCount !== 1 ? "s" : ""}</p>
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
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "from-indigo-500 to-indigo-600", description: "Create new client profile" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "from-indigo-500 to-indigo-600", description: "Track new opportunity" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "from-violet-500 to-violet-600", description: "Start a new project" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "from-indigo-500 to-indigo-600", description: "Send an invoice" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "from-violet-500 to-violet-600", description: "Set a reminder" },
  ]

  return (
    <div className="space-y-8">
      {/* Premium Welcome Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-pink-50 p-8 animate-rise">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100/40 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">👋</span>
            <h1 className="text-3xl font-serif font-light tracking-tight text-gray-900">
              Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-medium">{user?.firstName ?? "there"}</span>
            </h1>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl">
            Here's what's happening with your business today. Track your performance, manage clients, and stay on top of tasks all in one place.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-[520px] animate-pulse" />}>
          <DashboardRevenueChart />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-[520px] animate-pulse" />}>
          <DashboardPipelineChart />
        </Suspense>
      </div>

      {/* Premium Quick Actions Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
        {/* Background Gradient Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 rounded-full blur-3xl -mr-48 -mt-48" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Quick Actions</h2>
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
                             bg-white border border-gray-100
                             hover:border-indigo-200 hover:shadow-md
                             hover:-translate-y-1 active:scale-95
                             transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} 
                                   flex items-center justify-center mb-3 
                                   group-hover:scale-110 transition-transform duration-300 
                                   shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                  <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">{action.description}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Clients & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-80 animate-pulse" />}>
          <TopClients />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-80 animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>

      {/* Recent Clients & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-80 animate-pulse" />}>
          <RecentClients />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl border border-gray-100 p-6 h-80 animate-pulse" />}>
          <UpcomingReminders />
        </Suspense>
      </div>
    </div>
  )
}
