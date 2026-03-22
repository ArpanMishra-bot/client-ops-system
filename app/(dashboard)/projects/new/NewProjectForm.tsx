"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/modules/projects/actions"
import type { Client } from "@/modules/clients/types"
import Link from "next/link"

export default function NewProjectForm({ clients }: { clients: Client[] }) {
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
      await createProject({
        clientId: formData.get("clientId") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        status: (formData.get("status") as any) || "NOT_STARTED",
        startDate: formData.get("startDate") as string,
        dueDate: formData.get("dueDate") as string,
        budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
        currency: "USD",
        notes: formData.get("notes") as string,
      })
      router.push("/projects")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      {clients.length === 0 && (
        <div className="bg-yellow-50 text-yellow-700 text-sm px-4 py-3 rounded-lg">
          You need to <Link href="/clients/new" className="font-semibold underline">add a client</Link> before creating a project.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Client *</label>
          <select name="clientId" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">Select a client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Project Name *</label>
          <input name="name" required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Website Redesign" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select name="status"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Budget ($)</label>
          <input name="budget" type="number"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="5000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <input name="startDate" type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <input name="dueDate" type="date"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          placeholder="Describe the project scope..." />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading || clients.length === 0}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Creating..." : "Create Project"}
        </button>
        <Link href="/projects"
          className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
