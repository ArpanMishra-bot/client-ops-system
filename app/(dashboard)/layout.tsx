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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <Sidebar />
      <div className="md:ml-64">
        <header className="h-16 bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-6">
          <div />
          <UserButton />
        </header>
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
