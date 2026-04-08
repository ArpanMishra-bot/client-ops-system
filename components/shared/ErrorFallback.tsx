// components/shared/ErrorFallback.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Page error:", error)
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors active:scale-95"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
