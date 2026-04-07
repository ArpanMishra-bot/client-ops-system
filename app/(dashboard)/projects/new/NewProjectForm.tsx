// app/(dashboard)/projects/new/NewProjectForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/modules/projects/actions"
import { toast } from "sonner"
import type { Client } from "@/modules/clients/types"
import Link from "next/link"

export default function NewProjectForm({ 
  clients, 
  preselectedClientId 
}: { 
  clients: Client[], 
  preselectedClientId?: string 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Smart default: Status starts as PLANNING, but auto-updates based on start date
  const [status, setStatus] = useState("PLANNING")
  const [startDate, setStartDate] = useState("")

  // Watch start date and auto-update status
  useEffect(() => {
    if (startDate) {
      const today = new Date().toISOString().split("T")[0]
      if (startDate <= today) {
        setStatus("IN_PROGRESS")
      } else {
        setStatus("PLANNING")
      }
    }
  }, [startDate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const clientId = formData.get("clientId") as string
    const budget = formData.get("budget") as string

    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length < 2) {
      newErrors.name = "Project name must be at least 2 characters"
    }

    if (!clientId) {
      newErrors.clientId = "Please select a client"
    }

    if (budget && isNaN(Number(budget))) {
      newErrors.budget = "Please enter a valid number"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await createProject({
      clientId: clientId,
      name: name,
      description: formData.get("description") as string,
      status: status as any,
      startDate: startDate,
      dueDate: formData.get("dueDate") as string,
      budget: budget ? Number(budget) : null,
      notes: formData.get("notes") as string,
    })

    if (result.success) {
      toast.success("Project created successfully")
      router.push("/projects")
    } else {
      toast.error(result.error || "Failed to create project")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      {clients.length === 0 && (
        <div className="bg-yellow-50 text-yellow-700 text-sm px-4 py-3 rounded-lg">
          You need to <Link href="/clients/new" className="font-semibold underline">add a client</Link> before creating a project.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Client *</label>
          <select 
            name="clientId"
            defaultValue={preselectedClientId || ""}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.clientId ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
            ))}
          </select>
          {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId}</p>}
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Project Name *</label>
          <input 
            name="name"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Website Redesign" 
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select 
            name="status" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <p className="text-xs text-gray-400">
            {status === "IN_PROGRESS" && startDate 
              ? "✨ Auto-set to In Progress because start date is today or earlier"
              : "Status will auto-update to In Progress when start date is today or earlier"}
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Budget ($)</label>
          <input 
            name="budget" 
            type="number"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.budget ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="5000" 
          />
          {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <input 
            name="startDate" 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <input 
            name="dueDate" 
            type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" 
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="Describe the project scope..." />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || clients.length === 0}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
        <Link href="/projects"
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 active:scale-95 transition-all duration-200"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
