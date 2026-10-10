import KeyboardShortcuts from "@/components/shared/KeyboardShortcuts"
import FloatingActionButton from "@/components/shared/FloatingActionButton"
import BreadcrumbSimple from "@/components/shared/BreadcrumbSimple"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import Logo from "@/components/shared/Logo"

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
    <div className="min-h-screen overflow-x-clip bg-neutral-50">
      <Sidebar />
      <div className="min-h-screen min-w-0 md:ml-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8">
            <div className="min-w-0">
              <div className="md:hidden">
                <Logo size="sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-600">Welcome back,</p>
                <p className="max-w-[min(60vw,32rem)] truncate text-sm font-semibold text-neutral-900">
                  {user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "there"}
                </p>
              </div>
            </div>
            <div className="flex min-h-11 min-w-11 shrink-0 items-center justify-center">
              <UserButton />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 md:px-8 md:py-8">
          <div className="mx-auto min-w-0 max-w-7xl space-y-6">
            <BreadcrumbSimple />
            {children}
          </div>
        </main>
        {/* Keyboard Shortcuts + FAB */}
        <KeyboardShortcuts />
        <FloatingActionButton />
      </div>
    </div>
  )
}
