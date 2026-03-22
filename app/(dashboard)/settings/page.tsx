import { currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { User, Bell, Shield, CreditCard } from "lucide-react"

export default async function SettingsPage() {
  const user = await currentUser()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Click your avatar to manage your profile
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Account</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Account ID</p>
              <p className="text-xs text-gray-400 mt-0.5">Your unique account identifier</p>
            </div>
            <p className="text-xs text-gray-500 font-mono">{user?.id?.slice(0, 16)}...</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Member Since</p>
              <p className="text-xs text-gray-400 mt-0.5">When you joined</p>
            </div>
            <p className="text-sm text-gray-500">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Authentication</p>
              <p className="text-xs text-gray-400 mt-0.5">Secured by Clerk</p>
            </div>
            <span className="text-xs bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Plan</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Free Plan</p>
            <p className="text-xs text-gray-400 mt-0.5">All features included</p>
          </div>
          <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full font-medium">
            Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Data</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-gray-400 mt-0.5">PostgreSQL via Supabase</p>
            </div>
            <span className="text-xs bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full font-medium">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Storage</p>
              <p className="text-xs text-gray-400 mt-0.5">Your data is encrypted and secure</p>
            </div>
            <span className="text-xs bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full font-medium">
              Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
