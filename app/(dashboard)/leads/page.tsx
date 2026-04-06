import { Suspense } from "react"
import { getLeads } from "@/modules/leads/actions"
import { LEAD_STAGES } from "@/modules/leads/types"
import LeadBoard from "@/components/modules/leads/LeadBoard"
import LeadMobileList from "@/components/modules/leads/LeadMobileList"
import { Plus, TrendingUp, UserPlus } from "lucide-react"
import Link from "next/link"
import LeadsSkeleton from "@/components/shared/LeadsSkeleton"
import BulkStatusUpdate from "@/components/modules/leads/BulkStatusUpdate"

async function LeadsContent() {
  const leads = await getLeads()

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get started with leads</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Add your first lead to start tracking opportunities and building your sales pipeline.
        </p>
        <Link
          href="/leads/new"
          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Add your first lead
        </Link>
      </div>
    )
  }

  const totalValue = leads.reduce((sum, l) => sum + (l.value ?? 0), 0)
  const wonCount = leads.filter(l => l.status === "WON").length

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 text-sm text-gray-500">
          <span className="font-medium text-gray-900">{leads.length}</span>
          <span>total leads</span>
          <span className="mx-2">·</span>
          <span className="font-medium text-green-600">{wonCount}</span>
          <span>won</span>
          <span className="mx-2">·</span>
          <span className="font-medium text-gray-900">${totalValue.toLocaleString()}</span>
          <span>pipeline value</span>
        </div>
        
        {/* Bulk Status Update Component */}
        <BulkStatusUpdate leads={leads} />
      </div>

      {/* Desktop Kanban */}
      <div className="hidden md:block">
        <LeadBoard leads={leads} stages={LEAD_STAGES} />
      </div>

      {/* Mobile List */}
<div className="md:hidden">
  <LeadMobileList 
    leads={leads} 
    stages={LEAD_STAGES}
    selectedLeads={selectedLeads}
    onToggleSelect={toggleSelectLead}
  />
</div>
export default async function LeadsPage() {
  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your sales pipeline</p>
        </div>
        <Link
          href="/leads/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </Link>
      </div>

      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsContent />
      </Suspense>
    </div>
  )
}
