import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your clients, leads, projects and revenue.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
