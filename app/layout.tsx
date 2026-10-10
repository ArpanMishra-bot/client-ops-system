import type { Metadata, Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ClientOps – CRM for freelancers and small agencies",
    template: "%s | ClientOps",
  },
  description:
    "ClientOps brings clients, leads, projects, tasks, invoices and reminders into one simple workspace for freelancers and small agencies.",
  openGraph: {
    title: "ClientOps — Client operations workspace",
    description:
      "Manage clients, leads, projects, invoices, and reminders in one straightforward workspace.",
    siteName: "ClientOps",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  )
}
