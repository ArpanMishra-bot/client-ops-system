import { getLeads } from "@/modules/leads/actions"
import { LEAD_STAGES } from "@/modules/leads/types"
import LeadBoard from "@/components/modules/leads/LeadBoard"
import LeadMobileList from "@/components/modules/leads/LeadMobileList"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your sales pipeline</p>
        </div>
        <Link
          href="/leads/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </Link>
      </div>

      <div className="flex gap-1 text-sm text-gray-500">
        <span className="font-medium text-gray-900">{leads.length}</span>
        <span>total leads</span>
        <span className="mx-2">·</span>
        <span className="font-medium text-green-600">
          {leads.filter(l => l.status === "WON").length}
        </span>
        <span>won</span>
        <span className="mx-2">·</span>
        <span className="font-medium text-gray-900">
          ${leads.reduce((sum, l) => sum + (l.value ?? 0), 0).toLocaleString()}
        </span>
        <span>pipeline value</span>
      </div>

      {/* Desktop Kanban */}
      <div className="hidden md:block">
        <LeadBoard leads={leads} stages={LEAD_STAGES} />
      </div>

      {/* Mobile List */}
      <div className="md:hidden">
        <LeadMobileList leads={leads} stages={LEAD_STAGES} />
      </div>
    </div>
  )
}
