import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ClientLandingPage from "./ClientLandingPage"

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")

  return <ClientLandingPage />
}
