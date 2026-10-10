import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy",
  description: "Draft privacy information for ClientOps.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 sm:py-20">
      <Card className="mx-auto max-w-3xl p-6 shadow-sm sm:p-10">
        <CardHeader className="p-0">
          <p className="text-sm font-semibold text-danger">Draft, replace before launch</p>
          <CardTitle className="text-3xl font-bold tracking-tight text-neutral-900">
            Privacy policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-0 text-base leading-7 text-neutral-700">
          <p>
            This placeholder is not a statement of ClientOps&apos; actual data practices. Before
            launch, replace it with a reviewed policy explaining what information is collected,
            how it is used and shared, how long it is kept, and what choices are available to you.
          </p>
          <p>
            For privacy questions, contact{" "}
            <a className="font-medium text-primary underline" href="mailto:hello@example.com">
              hello@example.com
            </a>
            .
          </p>
          <Link className="inline-flex min-h-11 items-center text-primary underline" href="/">
            Back to ClientOps
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
