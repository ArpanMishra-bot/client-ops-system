import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import { Bell, Search, HelpCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get current time greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30">
      <Sidebar />
      <div className="md:ml-64">
        {/* Premium Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button - you can add this if needed */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Welcome Text with Gradient */}
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-mono text-gray-400">✨</span>
                  <span className="text-sm font-medium text-gray-500">{greeting},</span>
                  <span className="text-sm font-semibold gradient-text">{user?.firstName ?? "there"}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Let's make today productive</p>
              </div>
            </div>

            {/* Center Section - Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients, projects, invoices..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100
                           transition-all duration-200 placeholder:text-gray-400"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘</span>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">K</span>
                </kbd>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {/* Help Button */}
              <Link
                href="/help"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 
                         hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Help</span>
              </Link>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200" />

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Admin</p>
                </div>
                <div className="relative">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Header - Quick Stats (Optional) */}
          <div className="border-t border-gray-100/80 bg-white/40 backdrop-blur-sm px-6 py-2.5 hidden lg:block">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-500">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Last updated:</span>
                  <span className="text-gray-600 font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  Dashboard
                </Link>
                <Link href="/reports" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Reports
                </Link>
                <Link href="/settings" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
