"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLead } from "@/modules/leads/actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewLeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await createLead({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        source: formData.get("source") as string,
        status: (formData.get("status") as any) || "NEW",
        priority: (formData.get("priority") as any) || "MEDIUM",
        value: formData.get("value") ? Number(formData.get("value")) : undefined,
        notes: formData.get("notes") as string,
      })
      router.push("/leads")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Lead</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new lead to your pipeline.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <input name="name" required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="John Smith" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input name="email" type="email" required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="john@company.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input name="phone"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="+1 234 567 8900" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Company</label>
            <input name="company"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Acme Inc." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Position</label>
            <input name="position"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="CEO" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Deal Value ($)</label>
            <input name="value" type="number"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="5000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Source</label>
            <select name="source"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Social Media">Social Media</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <select name="priority"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
              <option value="LOW">Low</option>
              <option value="MEDIUM" selected>Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea name="notes" rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Any notes about this lead..." />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Lead"}
          </button>
          <Link href="/leads"
            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
