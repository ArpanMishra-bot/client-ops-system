"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CreditCard, Loader2 } from "lucide-react"

interface MockPaymentButtonProps {
  invoiceId: string
  invoiceNumber: string
  amount: number
  currentStatus: string
}

export default function MockPaymentButton({ 
  invoiceId, 
  invoiceNumber, 
  amount, 
  currentStatus 
}: MockPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const router = useRouter()

  if (currentStatus === "PAID") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Call API to update invoice status
    const response = await fetch(`/api/invoices/${invoiceId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        mockPayment: true,
        last4: cardNumber.slice(-4)
      })
    })

    if (response.ok) {
      toast.success(`Payment successful! Invoice ${invoiceNumber} marked as paid.`)
      setIsOpen(false)
      router.refresh()
    } else {
      toast.error("Payment failed. Please try again.")
    }
    
    setIsProcessing(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all active:scale-95"
      >
        <CreditCard className="h-4 w-4" />
        Pay Now (Demo)
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Demo Payment</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-mono">
                💡 Demo Mode: No real payment will be charged
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Use any test card: 4242 4242 4242 4242
              </p>
            </div>

            <div className="mb-4 text-center">
              <p className="text-sm text-gray-500">Amount to pay</p>
              <p className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Invoice: {invoiceNumber}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay $${amount.toLocaleString()} (Demo)`
                )}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              This is a demo payment. No real charge will be made.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
