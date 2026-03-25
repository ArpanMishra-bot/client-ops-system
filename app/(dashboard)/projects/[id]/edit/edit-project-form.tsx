"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProject } from "@/modules/projects/actions"
import { toast } from "sonner"
import type { Project } from "@/modules/projects/types"
import type { Client } from "@/modules/clients/types"
import Link from "next/link"

export default function EditProjectForm({ project, clients }: { project: Project; clients: Client[] }) {
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
    const clientId = formData.get("clientId") as string
    const budget = formData.get("budget") as string

    const newErrors: Record<string, string> = {}

    // Validate project name
    if (!name || name.trim().length < 2) {
      newErrors.name = "Project name must be at least 2 characters"
    }

    // Validate client selection
    if (!clientId) {
      newErrors.clientId = "Please select a client"
    }

    // Validate budget (if provided, must be positive number)
    if (budget && isNaN(Number(budget))) {
      newErrors.budget = "Please enter a valid number"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const result = await updateProject(project.id, {
      clientId: clientId,
      name: name,
      description: formData.get("description") as string,
      status: formData.get("status") as any,
      startDate: formData.get("startDate") as string,
      dueDate: formData.get("dueDate") as string,
      budget: budget ? Number(budget) : null,
      notes: formData.get("notes") as string,
    })

    if (result.success) {
      toast.success("Project updated successfully")
      router.push(`/projects/${project.id}`)
    } else {
      toast.error(result.error || "Failed to update project")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Client *</label>
          <select 
            name="clientId"
            defaultValue={project.clientId}
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
            defaultValue={project.name}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Website Redesign" 
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select name="status" defaultValue={project.status}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Budget ($)</label>
          <input 
            name="budget" 
            type="number"
            defaultValue={project.budget ?? ""}
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
            defaultValue={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <input 
            name="dueDate" 
            type="date"
            defaultValue={project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ""}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" 
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea 
          name="description" 
          rows={3}
          defaultValue={project.description ?? ""}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="Describe the project scope..." 
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <Link href={`/projects/${project.id}`}
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
