import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clients",
  description: "Manage your client relationships and contact details.",
}

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return children
}
