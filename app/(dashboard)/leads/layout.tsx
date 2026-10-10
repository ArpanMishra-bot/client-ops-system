import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leads",
  description: "Track and manage your sales pipeline.",
}

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return children
}
