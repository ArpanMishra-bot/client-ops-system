import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import ClientLandingPage from "./ClientLandingPage"

export const metadata: Metadata = {
  title: "Client operations for freelancers and small agencies",
  description:
    "Manage clients, leads, projects, invoices, and reminders in one straightforward ClientOps workspace.",
  openGraph: {
    title: "ClientOps — Client operations workspace",
    description:
      "Manage clients, leads, projects, invoices, and reminders in one straightforward workspace.",
    siteName: "ClientOps",
    type: "website",
  },
}

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")

  return <ClientLandingPage />
}
