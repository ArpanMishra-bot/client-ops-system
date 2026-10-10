"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Users,
  Zap,
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Client management",
    description: "Keep contact details, company information, status, and activity history together.",
  },
  {
    icon: LayoutDashboard,
    title: "Leads pipeline",
    description: "Track opportunities through the sales stages and keep deal details in view.",
  },
  {
    icon: FolderKanban,
    title: "Projects and tasks",
    description: "Organize project work with task stages, progress, budgets, and due dates.",
  },
  {
    icon: FileText,
    title: "Invoicing",
    description: "Create invoices with line items and track their status from one workspace.",
  },
  {
    icon: Bell,
    title: "Reminders",
    description: "Keep follow-ups, meetings, deadlines, and payment reminders visible.",
  },
  {
    icon: LayoutDashboard,
    title: "Business overview",
    description: "See key client, lead, invoice, task, and reminder information on your dashboard.",
  },
]

const steps = [
  {
    title: "Add your clients and leads",
    description: "Keep contact records and potential work organized in one place.",
  },
  {
    title: "Manage projects and follow-ups",
    description: "Track project tasks and use reminders to stay on top of upcoming work.",
  },
  {
    title: "Create and track invoices",
    description: "Prepare invoices and follow their status alongside the rest of your work.",
  },
]

const faqs = [
  {
    question: "What can I manage with ClientOps?",
    answer:
      "ClientOps includes client records, a leads pipeline, projects and tasks, invoices, reminders, and a business dashboard.",
  },
  {
    question: "Can I create invoices?",
    answer:
      "Yes. You can create invoices with line items and track invoice statuses in the app.",
  },
  {
    question: "How do reminders work?",
    answer:
      "You can keep follow-ups, meetings, deadlines, and payment reminders in the reminders area of your workspace.",
  },
  {
    question: "Where can I find plan and pricing details?",
    answer:
      "Contact us for current information about availability and pricing.",
  },
]

function FaqItem({
  question,
  answer,
  panelId,
}: {
  question: string
  answer: string
  panelId: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="gap-0 py-0">
      <h3>
        <Button
          type="button"
          variant="ghost"
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="min-h-14 w-full justify-between rounded-xl px-5 text-left whitespace-normal"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{question}</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-5 shrink-0 text-muted-foreground transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </h3>
      <CardContent
        id={panelId}
        hidden={!isOpen}
        className="px-5 pb-5 text-sm leading-6 text-muted-foreground"
      >
          {answer}
      </CardContent>
    </Card>
  )
}

function ActionLink({
  href,
  children,
  variant = "default",
}: {
  href: string
  children: ReactNode
  variant?: "default" | "outline"
}) {
  return (
    <Button asChild variant={variant} size="lg" className="min-h-11">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export default function ClientLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href="/" size="md" variant="dark" />
          <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" size="default">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <ActionLink href="/sign-up">
              Get started <ArrowRight aria-hidden="true" />
            </ActionLink>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-neutral-50">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-neutral-700">
                <Zap aria-hidden="true" className="size-4 text-primary" />
                For freelancers and small agencies
              </p>
              <h1 className="max-w-xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                Keep your client work moving.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
                Manage clients, leads, projects, invoices, and reminders in one straightforward workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ActionLink href="/sign-up">
                  Create an account <ArrowRight aria-hidden="true" />
                </ActionLink>
                <ActionLink href="#features" variant="outline">
                  Explore features
                </ActionLink>
              </div>
            </div>

            <div
              aria-label="Illustrative preview of a ClientOps workspace"
              className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6"
            >
              <div aria-hidden="true">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <span className="size-2.5 rounded-full bg-neutral-300" />
                  <span className="size-2.5 rounded-full bg-neutral-300" />
                  <span className="size-2.5 rounded-full bg-neutral-300" />
                  <div className="ml-2 h-8 flex-1 rounded-md bg-neutral-100" />
                </div>
                <p className="mt-5 text-sm font-semibold text-neutral-800">Your workspace</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {["Clients", "Leads", "Projects", "Invoices"].map((label) => (
                    <Card key={label} className="gap-3 p-4 shadow-none">
                      <p className="text-sm font-medium text-neutral-700">{label}</p>
                      <div className="h-2 w-3/4 rounded-full bg-neutral-200" />
                      <div className="h-2 w-1/2 rounded-full bg-neutral-100" />
                    </Card>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Check aria-hidden="true" className="size-4 text-success" />
                    Work, all in one place
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-neutral-100" />
                  <div className="mt-2 h-2 w-4/5 rounded-full bg-neutral-100" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              The tools for everyday client work
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              Keep the details, next steps, and progress of your work easy to find.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full p-5 shadow-none">
                <CardHeader className="p-0">
                  <span className="mb-1 flex size-11 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <CardTitle className="text-base font-semibold text-neutral-900">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm leading-6 text-neutral-600">
                  {description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="border-y border-border bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                A clear place for your workflow
              </h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full p-5 shadow-none">
                    <CardHeader className="p-0">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <CardTitle className="pt-2 text-base font-semibold text-neutral-900">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm leading-6 text-neutral-600">
                      {step.description}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Card className="mx-auto max-w-3xl border-primary/20 bg-neutral-50 p-6 text-center shadow-none sm:p-10">
            <CardHeader className="p-0">
              <p className="text-sm font-semibold text-primary">Plans and availability</p>
              <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Find the right fit for your work
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="mx-auto max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
                Contact us for current information about ClientOps availability and pricing.
              </p>
              <div className="mt-6">
                <ActionLink href="mailto:hello@example.com">
                  Contact us <ArrowRight aria-hidden="true" />
                </ActionLink>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="faq" className="border-y border-border bg-neutral-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">FAQ</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Frequently asked questions
              </h2>
            </div>
            <div className="mx-auto mt-8 max-w-3xl space-y-3">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  panelId={`faq-answer-${index}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Bring your client work together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600">
            Start organizing clients, projects, invoices, and follow-ups in ClientOps.
          </p>
          <div className="mt-7">
            <ActionLink href="/sign-up">
              Get started <ArrowRight aria-hidden="true" />
            </ActionLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
          <Logo href="/" size="sm" variant="dark" />
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} ClientOps. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="text-sm text-neutral-700 underline-offset-4 hover:underline" href="/privacy">
              Privacy
            </Link>
            <Link className="text-sm text-neutral-700 underline-offset-4 hover:underline" href="/terms">
              Terms
            </Link>
            <Link
              className="text-sm text-neutral-700 underline-offset-4 hover:underline"
              href="mailto:hello@example.com"
            >
              hello@example.com
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
