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
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="md:ml-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div>
              <div className="md:hidden">
                <Logo size="sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-600">Welcome back,</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "there"}
                </p>
              </div>
            </div>
            <UserButton />
          </div>
        </header>

        <main className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl space-y-6">
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
