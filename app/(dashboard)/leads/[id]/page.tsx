export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Phone, Building, DollarSign, Pencil } from "lucide-react"
import Link from "next/link"
import { LEAD_STAGES } from "@/modules/leads/types"
import ConvertToClientButton from "@/components/modules/leads/ConvertToClientButton"
import { DeleteLeadButton } from "./delete-lead-button"

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) notFound()

  const lead = await db.lead.findFirst({
    where: { id, userId },
  })

  if (!lead) notFound()

  const stage = LEAD_STAGES.find((s) => s.status === lead.status)
  const isWon = lead.status === "WON"
  const alreadyConverted = lead.convertedToId !== null && lead.convertedToId !== undefined

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/leads" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/leads/${lead.id}/edit`}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          {isWon && !alreadyConverted && (
            <ConvertToClientButton leadId={lead.id} />
          )}
          {alreadyConverted && (
            <Link
              href={`/clients/${lead.convertedToId}`}
              className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
            >
              ✓ View Client Profile
            </Link>
          )}
          <DeleteLeadButton leadId={lead.id} leadName={lead.name} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {lead.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{lead.name}</h1>
              {lead.company && (
                <p className="text-sm text-gray-500 mt-0.5">{lead.company}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {stage && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stage.bg} ${stage.color}`}>
                    {stage.label}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lead.priority === "HIGH" ? "bg-red-50 text-red-600" :
                  lead.priority === "MEDIUM" ? "bg-yellow-50 text-yellow-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {lead.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          {lead.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-900">{lead.email}</p>
              </div>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-900">{lead.phone}</p>
              </div>
            </div>
          )}
          {lead.company && (
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Company</p>
                <p className="text-sm text-gray-900">{lead.company}</p>
              </div>
            </div>
          )}
          {lead.value && (
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Deal Value</p>
                <p className="text-sm text-gray-900">${lead.value.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {lead.notes && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Notes</p>
            <p className="text-sm text-gray-700">{lead.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
