"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/modules/clients/actions"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const website = formData.get("website") as string

    const newErrors: Record<string, string> = {}
    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }
    if (website && !website.startsWith("http")) {
      newErrors.website = "Website must start with http:// or https://"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await createClient({
  name: name,
  email: email,
  phone: formData.get("phone") as string,
  company: formData.get("company") as string,
  address: formData.get("address") as string,
  city: formData.get("city") as string,
  country: formData.get("country") as string,
  website: website,
  notes: formData.get("notes") as string,
  isActive: true,
})

    if (result.success) {
      toast.success("Client created successfully")
      router.push("/clients")
    } else {
      toast.error(result.error || "Failed to create client")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link
          href="/clients"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Client</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new client.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <input
              name="name"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-all duration-200 ${
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
              }`}
              placeholder="John Smith"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input
              name="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-all duration-200 ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
              }`}
              placeholder="john@company.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input
              name="company"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200"
              placeholder="Acme Inc."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              name="city"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200"
              placeholder="New York"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <input
              name="country"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200"
              placeholder="United States"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input
              name="website"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-all duration-200 ${
                errors.website ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
              }`}
              placeholder="https://company.com"
            />
            {errors.website && <p className="text-xs text-red-500 mt-1">{errors.website}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              name="address"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200"
              placeholder="123 Main St"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all duration-200 resize-none"
            placeholder="Any additional notes about this client..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading}
  className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200 disabled:opacity-50"
>
  {loading ? "Creating..." : "Create Client"}
</button>
          <Link
            href="/clients"
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
