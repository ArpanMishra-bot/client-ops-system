"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateClient } from "@/modules/clients/actions"
import { toast } from "sonner"
import type { Client } from "@/modules/clients/types"
import Link from "next/link"

export default function EditForm({ client }: { client: Client }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; website?: string }>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const website = formData.get("website") as string

    const newErrors: { name?: string; email?: string; website?: string } = {}

    // Validate name
    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }

    // Validate website
    if (website && !website.startsWith("http")) {
      newErrors.website = "Website must start with http:// or https://"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await updateClient(client.id, {
  name: name,
  email: email,
  phone: formData.get("phone") as string,
  company: formData.get("company") as string,
  address: formData.get("address") as string,
  city: formData.get("city") as string,
  country: formData.get("country") as string,
  website: website,
  notes: formData.get("notes") as string,
  isActive: client.isActive,
})
    if (result.success) {
      toast.success("Client updated successfully")
      router.push(`/clients/${client.id}`)
    } else {
      toast.error(result.error || "Failed to update client")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Full Name *</label>
          <input 
            name="name" 
            defaultValue={client.name}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <input 
            name="email" 
            type="email" 
            defaultValue={client.email}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input name="phone" defaultValue={client.phone ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Company</label>
          <input name="company" defaultValue={client.company ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">City</label>
          <input name="city" defaultValue={client.city ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <input name="country" defaultValue={client.country ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Website</label>
          <input 
            name="website" 
            defaultValue={client.website ?? ""}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.website ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.website && (
            <p className="text-xs text-red-500 mt-1">{errors.website}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input name="address" defaultValue={client.address ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea name="notes" rows={3} defaultValue={client.notes ?? ""}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none" />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Link href={`/clients/${client.id}`}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
