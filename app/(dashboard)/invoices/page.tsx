import { formatCurrency, formatDate } from "@/lib/utils"
import { Suspense } from "react"
import { getInvoicesPage } from "@/modules/invoices/actions"
import { INVOICE_STATUS_CONFIG } from "@/modules/invoices/types"
import { FileText, Plus, Receipt } from "lucide-react"
import Link from "next/link"
import Pagination from "@/components/shared/Pagination"
import { parsePage } from "@/lib/pagination"
import InvoicesSkeleton from "@/components/shared/InvoicesSkeleton"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"

async function InvoicesList({ page: requested }: { page: number }) {
  let data = await getInvoicesPage(requested)
  if (requested > data.totalPages) data = await getInvoicesPage(data.totalPages)
  const { items: invoices, totalRevenue, outstanding } = data

  if (data.total === 0) {
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
  className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] active:shadow-lg transition-all duration-200"
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
    <p className="text-sm font-medium text-gray-600">Revenue</p>
    <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mt-1">
      {formatCurrency(totalRevenue)}
    </p>
  </div>
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <p className="text-sm font-medium text-gray-600">Outstanding</p>
    <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mt-1">
      {formatCurrency(outstanding)}
    </p>
  </div>
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <p className="text-sm font-medium text-gray-600">Total Invoices</p>
    <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mt-1">
      {data.total}
    </p>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((invoice) => {
              const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
              return (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{invoice.client.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(invoice.total, invoice.currency)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(invoice.dueDate)}</td>
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
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 block hover:shadow-lg active:shadow-lg active:scale-[0.98] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{invoice.number}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{invoice.client.name}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-base font-semibold text-gray-900">{formatCurrency(invoice.total, invoice.currency)}</p>
                <p className="text-xs text-gray-600">Due {formatDate(invoice.dueDate)}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <Pagination basePath="/invoices" page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} />
    </>
  )
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const { page } = await searchParams
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage and track your invoices."
        action={
          <Button asChild size="lg">
            <Link href="/invoices/new">
              <Plus aria-hidden="true" />
              New invoice
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<InvoicesSkeleton />}>
        <InvoicesList page={parsePage(page)} />
      </Suspense>
    </div>
  )
}
