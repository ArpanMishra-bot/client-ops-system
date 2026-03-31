import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-white">
      <Sidebar />
      <div className="md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              ClientOps Dashboard
            </h1>
          </div>
          <UserButton />
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
