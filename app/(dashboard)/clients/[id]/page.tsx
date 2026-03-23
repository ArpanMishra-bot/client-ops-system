export const dynamic = "force-dynamic"

import { getClientById } from "@/modules/clients/actions"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building } from "lucide-react"
import Link from "next/link"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/clients"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{client.name}</h1>
              {client.company && (
                <p className="text-sm text-gray-500 mt-0.5">{client.company}</p>
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                client.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {client.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <Link
            href={`/clients/${client.id}/edit`}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Edit Client
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
          {client.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-900">{client.email}</p>
              </div>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-900">{client.phone}</p>
              </div>
            </div>
          )}
          {client.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Website</p>
                <p className="text-sm text-gray-900">{client.website}</p>
              </div>
            </div>
          )}
          {client.company && (
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Company</p>
                <p className="text-sm text-gray-900">{client.company}</p>
              </div>
            </div>
          )}
          {(client.city || client.country) && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm text-gray-900">
                  {[client.city, client.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {client.notes && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Notes</p>
            <p className="text-sm text-gray-700">{client.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
