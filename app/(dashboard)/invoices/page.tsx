import { Suspense } from "react"
import { getInvoices } from "@/modules/invoices/actions"
import { INVOICE_STATUS_CONFIG } from "@/modules/invoices/types"
import { FileText, Plus, Receipt } from "lucide-react"
import Link from "next/link"
import InvoicesSkeleton from "@/components/shared/InvoicesSkeleton"

async function InvoicesList() {
  const invoices = await getInvoices()

  const totalRevenue = invoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0)

  const outstanding = invoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0)

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Receipt className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Get started with invoices</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Create your first invoice to start getting paid for your work. Track payments and manage outstanding balances.
        </p>
        <Link
          href="/invoices/new"
          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
        >
          <FileText className="h-4 w-4" />
          Create your first invoice
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">Revenue</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">${outstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{invoices.length}</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
             </>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((invoice) => {
              const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
              return (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{invoice.client.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/invoices/${invoice.id}`} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                      View →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {invoices.map((invoice) => {
          const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
          return (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 block hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{invoice.number}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{invoice.client.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-base font-semibold text-gray-900">${invoice.total.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default async function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your invoices</p>
        </div>
        <Link
          href="/invoices/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Invoice</span>
        </Link>
      </div>

      <Suspense fallback={<InvoicesSkeleton />}>
        <InvoicesList />
      </Suspense>
    </div>
  )
}
