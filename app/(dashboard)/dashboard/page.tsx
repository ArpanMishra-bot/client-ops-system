import { currentUser } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user?.firstName ?? "there"} 👋
      </h1>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your business today.
      </p>
    </div>
  )
}
