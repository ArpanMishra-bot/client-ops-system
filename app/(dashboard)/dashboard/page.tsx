// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { getDashboardStats } from "@/modules/dashboard/actions"
import StatsSkeleton from "@/components/shared/StatsSkeleton"
import RevenueChart from "@/components/dashboard/RevenueChart"
import PipelineChart from "@/components/dashboard/PipelineChart"
import StatCard from "@/components/dashboard/StatCard"
import BusinessHealthScore from "@/components/dashboard/BusinessHealthScore"
import { formatCurrency } from "@/lib/utils"
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
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
} from "lucide-react"
import Link from "next/link"

// Consistent gradient classes
const gradients = {
  primary: "from-indigo-500 to-indigo-600",
  secondary: "from-purple-500 to-purple-600",
  hero: "from-indigo-500 to-purple-600",
  success: "from-emerald-500 to-emerald-600",
  warning: "from-amber-500 to-amber-600",
}

// Helper function to get user industry/category
function getUserCategory(email?: string): string {
  const categories = [
    { label: "Creative Director", emoji: "🎨", color: "text-purple-600" },
    { label: "Agency Owner", emoji: "💼", color: "text-indigo-600" },
    { label: "Startup Founder", emoji: "🚀", color: "text-blue-600" },
    { label: "Marketing Consultant", emoji: "📊", color: "text-emerald-600" },
    { label: "Freelance Developer", emoji: "💻", color: "text-cyan-600" },
    { label: "Product Manager", emoji: "📱", color: "text-rose-600" },
    { label: "Business Coach", emoji: "🎯", color: "text-amber-600" },
    { label: "Design Agency", emoji: "✨", color: "text-pink-600" },
  ]
  
  const hash = email?.length || 0
  const category = categories[hash % categories.length]
  return `${category.emoji} ${category.label}`
}

// Collapsible wrapper for mobile - with tap effect
function CollapsibleCard({ 
  title, 
  children, 
  icon, 
  defaultOpen = false 
}: { 
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details 
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-indigo-200 transition-all duration-200"
      open={defaultOpen}
    >
      <summary className="cursor-pointer px-6 py-4 text-sm font-semibold select-none transition-all duration-200 hover:bg-gray-50/50 active:scale-[0.99] active:bg-gray-100/50 flex items-center justify-between touch-manipulation">
        <div className="flex items-center gap-2">
          {icon && <span className="text-indigo-500">{icon}</span>}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </span>
        </div>
        <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
      </summary>
      <div className="p-6 pt-0 border-t border-gray-100">
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
      href: "/clients", 
      sub: "Total active clients", 
      trend: stats.clientTrend 
    },
    { 
      label: "Active Leads", 
      value: stats.activeLeads.toString(),
      icon: <TrendingUp className="h-5 w-5 text-white" />, 
      href: "/leads", 
      sub: "In pipeline", 
      trend: stats.leadsTrend 
    },
    { 
      label: "Active Projects", 
      value: stats.activeProjects.toString(),
      icon: <FolderKanban className="h-5 w-5 text-white" />, 
      href: "/projects", 
      sub: "In progress", 
      trend: stats.projectsTrend 
    },
    { 
      label: "Total Revenue", 
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="h-5 w-5 text-white" />, 
      href: "/invoices", 
      sub: "From paid invoices", 
      trend: stats.revenueTrend 
    },
    { 
      label: "Outstanding", 
      value: formatCurrency(stats.outstanding),
      icon: <FileText className="h-5 w-5 text-white" />, 
      href: "/invoices", 
      sub: "Awaiting payment", 
      trend: stats.outstandingTrend 
    },
    { 
      label: "Pending Tasks", 
      value: stats.pendingTasks.toString(),
      icon: <Clock className="h-5 w-5 text-white" />, 
      href: "/tasks", 
      sub: "Across all projects", 
      trend: stats.tasksTrend 
    },
  ]

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={stat.label} style={{ animationDelay: `${index * 50}ms` }} className="animate-rise">
            <StatCard {...stat} color={gradients.primary} />
          </div>
        ))}
      </div>

      {/* Business Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <BusinessHealthScore 
            score={stats.healthScore} 
            color={stats.healthColor}
            bg={stats.healthBg}
          />
        </div>
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-2">Quick Tip</p>
            <p className="text-sm text-gray-600">
              💡 {stats.pendingTasks > 0 
                ? `You have ${stats.pendingTasks} pending tasks. Focus on completing them to improve your health score.`
                : "Great job! All tasks are complete. Consider adding more leads to grow your pipeline."}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

async function DashboardRevenueChart() {
  const stats = await getDashboardStats()
  return (
    <CollapsibleCard title="Revenue Overview" icon={<DollarSign className="h-4 w-4" />} defaultOpen>
      <RevenueChart data={stats.revenueChartData} />
    </CollapsibleCard>
  )
}

async function DashboardPipelineChart() {
  const stats = await getDashboardStats()
  if (stats.pipelineData.length === 0) return null
  return (
    <CollapsibleCard title="Pipeline Value by Stage" icon={<TrendingUp className="h-4 w-4" />} defaultOpen={false}>
      <PipelineChart data={stats.pipelineData} />
    </CollapsibleCard>
  )
}
async function TopClients() {
  const stats = await getDashboardStats()
  if (stats.topClients.length === 0) return null
  return (
    <CollapsibleCard title="Top Clients by Revenue" icon={<Users className="h-4 w-4" />} defaultOpen>
      <div className="space-y-3">
        {stats.topClients.map((client) => {
          const maxRevenue = Math.max(...stats.topClients.map(c => c.revenue), 1)
          const percentage = (client.revenue / maxRevenue) * 100
          
          return (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group block p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] active:bg-gray-100/50 touch-manipulation"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-xs font-mono text-gray-500">{formatCurrency(client.revenue)}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono font-medium ${
                  client.trend > 0 ? 'text-emerald-600' : client.trend < 0 ? 'text-rose-600' : 'text-gray-400'
                }`}>
                  {client.trend > 0 && <ArrowUpRight className="h-3 w-3" />}
                  {client.trend < 0 && <ArrowDownRight className="h-3 w-3" />}
                  <span>{client.trend > 0 ? '+' : ''}{client.trend}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </CollapsibleCard>
  )
}

async function ActivityFeed() {
  const stats = await getDashboardStats()
  if (stats.recentActivities.length === 0) return null
  return (
    <CollapsibleCard title="Activity Feed" icon={<Clock className="h-4 w-4" />} defaultOpen>
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
                    ? `💰 Invoice paid: ${activity.name} - ${formatCurrency(activity.amount)}`
                    : `📄 Created invoice for ${activity.name}`
                  : `👤 Added new client: ${activity.name}`}
              </p>
              <p className="text-xs font-mono text-gray-400 mt-1">
                {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    <CollapsibleCard title="Recent Clients" icon={<UserPlus className="h-4 w-4" />} defaultOpen>
      {stats.recentClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No clients yet</p>
          <Link 
            href="/clients/new" 
            className="inline-flex items-center gap-1 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium mt-3 hover:gap-2 transition-all active:scale-95 touch-manipulation"
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
              className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] active:bg-gray-100/50 touch-manipulation"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">{client.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                {client.company && <p className="text-xs text-gray-500">{client.company}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-gray-400">
                  {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
    <CollapsibleCard title="Reminders" icon={<Calendar className="h-4 w-4" />} defaultOpen>
      {reminderCount === 0 ? (
        <Link 
          href="/reminders"
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  No pending reminders
                </p>
              </div>
              <p className="text-xs text-gray-500">Create your first reminder to stay organized</p>
            </div>
            <span className="text-indigo-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
      ) : (
        <Link 
          href="/reminders#pending"
          className="group block p-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {reminderCount} Pending Reminder{reminderCount !== 1 ? "s" : ""}
                </p>
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
  const userCategory = getUserCategory(user?.emailAddresses[0]?.emailAddress)

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", description: "Create new client profile" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", description: "Track new opportunity" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", description: "Start a new project" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", description: "Send an invoice" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", description: "Set a reminder" },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section - Collapsible on Mobile */}
      <details className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 group md:block">
        <summary className="cursor-pointer p-6 md:p-8 list-none touch-manipulation">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.firstName ?? "Guest"}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5 hidden md:block">
                  {userCategory}
                </p>
              </div>
            </div>
            <span className="text-gray-400 text-sm md:hidden group-open:rotate-180 transition-transform duration-200">▼</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 md:hidden group-open:block hidden">
            {userCategory}
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mt-2 hidden md:block">
            Here's what's happening with your business today. Track performance, manage clients, and stay on top of tasks.
          </p>
        </summary>
        <div className="px-6 pb-6 md:px-8 md:pb-8 -mt-2 md:mt-0">
          <p className="text-gray-500 text-sm max-w-2xl md:hidden">
            Here's what's happening with your business today. Track performance, manage clients, and stay on top of tasks.
          </p>
        </div>
      </details>

      {/* Stats + Health Score */}
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

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-full blur-3xl -mr-48 -mt-48" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quick Actions
              </h2>
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
                             hover:-translate-y-1 active:scale-95 active:bg-indigo-50/50
                             transition-all duration-200 touch-manipulation"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600
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
