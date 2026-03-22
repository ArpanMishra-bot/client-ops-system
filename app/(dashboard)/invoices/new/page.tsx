import { getClients } from "@/modules/clients/actions"
import { auth } from "@clerk/nextjs/server"
import { generateInvoiceNumber } from "@/modules/invoices/actions"
import NewInvoiceForm from "./NewInvoiceForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewInvoicePage() {
  const { userId } = await auth()
  const clients = await getClients()
  const invoiceNumber = await generateInvoiceNumber(userId!)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Invoice</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new invoice for a client.</p>
      </div>
      <NewInvoiceForm clients={clients} invoiceNumber={invoiceNumber} />
    </div>
  )
}
