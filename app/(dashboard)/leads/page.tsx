import { Suspense } from "react"
import { getLeads } from "@/modules/leads/actions"
import { LEAD_STAGES } from "@/modules/leads/types"
import LeadsClient from "./LeadsClient"

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your sales pipeline</p>
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <LeadsClient initialLeads={leads} />
      </Suspense>
    </div>
  )
}
