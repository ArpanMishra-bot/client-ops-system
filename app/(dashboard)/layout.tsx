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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 md:mt-0 mt-16">
          <div />
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
