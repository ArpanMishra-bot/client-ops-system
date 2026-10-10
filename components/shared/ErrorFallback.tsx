// components/shared/ErrorFallback.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-100 text-warning">
        <AlertTriangle aria-hidden="true" className="size-7" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-neutral-900">Something went wrong</h2>
      <p className="mb-6 max-w-md text-neutral-600">
        We couldn&apos;t load this page. Please try again.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset} size="lg">
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
