// This updates the dashboard container spacing and adds subtle contrast
// The rest of your dashboard content remains the same

export default async function DashboardPage() {
  const user = await currentUser()

  const quickActions = [
    { label: "Add Client", icon: UserPlus, href: "/clients/new", color: "from-blue-500 to-indigo-600" },
    { label: "Add Lead", icon: TrendingUp, href: "/leads/new", color: "from-purple-500 to-pink-500" },
    { label: "Create Project", icon: Briefcase, href: "/projects/new", color: "from-orange-500 to-red-500" },
    { label: "Create Invoice", icon: Receipt, href: "/invoices/new", color: "from-green-500 to-emerald-600" },
    { label: "Add Reminder", icon: Calendar, href: "/reminders", color: "from-yellow-500 to-amber-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section with subtle border */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent rounded-2xl" />
        <div className="relative">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName ?? "there"} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts Row with subtle container separation */}
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

      {/* Two Column Section with container contrast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <TopClients />
        </Suspense>
        <Suspense fallback={<div className="glass-card p-6 h-48 animate-pulse" />}>
          <ActivityFeed />
        </Suspense>
      </div>

      {/* Second Row */}
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
