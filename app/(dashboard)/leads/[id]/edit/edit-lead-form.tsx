"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateLead } from "@/modules/leads/actions"
import { toast } from "sonner"
import type { Lead } from "@/modules/leads/types"
import Link from "next/link"

export default function EditLeadForm({ lead }: { lead: Lead }) {
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
    const value = formData.get("value") as string

    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }

    if (value && isNaN(Number(value))) {
      newErrors.value = "Please enter a valid number"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await updateLead(lead.id, {
      name: name,
      email: email,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      source: formData.get("source") as string,
      priority: formData.get("priority") as any,
      value: value ? Number(value) : null,
      notes: formData.get("notes") as string,
    })

    if (result.success) {
      toast.success("Lead updated successfully")
      router.push(`/leads/${lead.id}`)
    } else {
      toast.error(result.error || "Failed to update lead")
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
            defaultValue={lead.name}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-200"
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
            defaultValue={lead.email}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="john@company.com" 
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input 
            name="phone" 
            defaultValue={lead.phone ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="+1 234 567 8900" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Company</label>
          <input 
            name="company" 
            defaultValue={lead.company ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Acme Inc." 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Deal Value ($)</label>
          <input 
            name="value" 
            type="number" 
            defaultValue={lead.value ?? ""}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.value ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="5000" 
          />
          {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Source</label>
          <select 
            name="source" 
            defaultValue={lead.source ?? ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option value="">Select source</option>
            <option value="Website">🌐 Website</option>
            <option value="Referral">🤝 Referral</option>
            <option value="LinkedIn">💼 LinkedIn</option>
            <option value="Cold Outreach">📧 Cold Outreach</option>
            <option value="Social Media">📱 Social Media</option>
            <option value="Other">📌 Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select 
            name="priority" 
            defaultValue={lead.priority}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea 
          name="notes" 
          rows={3} 
          defaultValue={lead.notes ?? ""}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="Any notes about this lead..." 
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200 disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Link 
          href={`/leads/${lead.id}`}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200">
          Cancel
        </Link>
      </div>
    </form>
  )
            }
