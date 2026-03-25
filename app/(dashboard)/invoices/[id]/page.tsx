export const dynamic = "force-dynamic"

import { getInvoiceById } from "@/modules/invoices/actions"
import { notFound } from "next/navigation"
import { ArrowLeft, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { INVOICE_STATUS_CONFIG } from "@/modules/invoices/types"
import InvoiceStatusUpdater from "@/components/modules/invoices/InvoiceStatusUpdater"
import InvoiceDownloadButton from "@/components/modules/invoices/InvoiceDownloadButton"
import { DeleteInvoiceButton } from "./delete-invoice-button"
import { DuplicateInvoiceButton } from "./duplicate-invoice-button"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceById(id)
  if (!invoice) notFound()

  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/invoices" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <DuplicateInvoiceButton invoiceId={invoice.id} />
          <InvoiceDownloadButton invoice={invoice} />
          <InvoiceStatusUpdater invoiceId={invoice.id} currentStatus={invoice.status} />
          <DeleteInvoiceButton invoiceId={invoice.id} invoiceNumber={invoice.number} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.number}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">${invoice.total.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{invoice.currency}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
            <p className="text-sm font-semibold text-gray-900">{invoice.client.name}</p>
            <p className="text-sm text-gray-500">{invoice.client.email}</p>
            {invoice.client.company && (
              <p className="text-sm text-gray-500">{invoice.client.company}</p>
            )}
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div>
                <p className="text-xs text-gray-400">Issue Date</p>
                <p className="text-sm text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Due Date</p>
                <p className="text-sm font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="text-right py-2 text-xs font-medium text-gray-500 uppercase">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="py-3 text-sm text-gray-500 text-right">{item.quantity}</td>
                  <td className="py-3 text-sm text-gray-500 text-right">${item.rate.toLocaleString()}</td>
                  <td className="py-3 text-sm font-medium text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-end">
            <div className="space-y-2 w-48">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm text-gray-900">${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-base font-semibold text-gray-900">${invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {(invoice.notes || invoice.terms) && (
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
            {invoice.notes && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-gray-700">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Terms</p>
                <p className="text-sm text-gray-700">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
