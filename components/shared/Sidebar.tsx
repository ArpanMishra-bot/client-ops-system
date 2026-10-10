"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ClipboardList,
  Ellipsis,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "@/components/shared/Logo"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/leads", label: "Leads", icon: TrendingUp },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/settings", label: "Settings", icon: Settings },
]

const mobileTabs = navItems.filter((item) =>
  ["/dashboard", "/clients", "/leads", "/invoices"].includes(item.href)
)
const moreItems = navItems.filter((item) => !mobileTabs.includes(item))

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar() {
  const pathname = usePathname()
  const isMoreActive = moreItems.some((item) => isCurrentPath(pathname, item.href))

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Logo size="md" />
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isCurrentPath(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "border-l-2 border-primary bg-primary/10 pl-2.5 text-primary"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-border bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {mobileTabs.map(({ href, label, icon: Icon }) => {
          const active = isCurrentPath(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-xs text-neutral-600",
                active && "font-semibold text-primary"
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
              <span>{label}</span>
            </Link>
          )
        })}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="More navigation options"
              aria-current={isMoreActive ? "page" : undefined}
              className={cn(
                "h-full min-w-0 flex-col gap-1 rounded-lg px-1 text-xs font-normal text-neutral-600",
                isMoreActive && "font-semibold text-primary"
              )}
            >
              <Ellipsis aria-hidden="true" className="size-5" />
              <span>More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)]">
            <SheetHeader className="border-b border-border px-5 py-5">
              <SheetTitle>More</SheetTitle>
            </SheetHeader>
            <nav aria-label="More navigation" className="space-y-1 px-3">
              {moreItems.map(({ href, label, icon: Icon }) => {
                const active = isCurrentPath(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  )
}
