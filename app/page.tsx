import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { ArrowRight, Users, TrendingUp, FolderKanban, FileText, Bell, LayoutDashboard, CheckCircle } from "lucide-react"

const features = [
  { icon: LayoutDashboard, title: "Live Dashboard", description: "Real-time overview of your entire business — revenue, clients, projects, and tasks in one place." },
  { icon: Users, title: "Client Management", description: "Keep all your client information organized. Track contacts, companies, and communication history." },
  { icon: TrendingUp, title: "Leads Pipeline", description: "Visual kanban pipeline to track every deal from first contact to closed won." },
  { icon: FolderKanban, title: "Projects & Tasks", description: "Manage projects with a full task board. Track progress, deadlines, and budgets." },
  { icon: FileText, title: "Invoicing", description: "Create professional invoices, track payments, and manage outstanding balances." },
  { icon: Bell, title: "Reminders", description: "Never miss a follow-up. Set reminders for clients, leads, and projects." },
]

const workflow = [
  { step: "01", title: "Add a Lead", description: "Capture prospects and track them through your pipeline stages." },
  { step: "02", title: "Convert to Client", description: "When a deal closes, convert your lead to a full client profile." },
  { step: "03", title: "Deliver the Project", description: "Create a project, break it into tasks, and track progress." },
  { step: "04", title: "Get Paid", description: "Generate a professional invoice and mark it paid when received." },
]

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/" size="md" variant="dark" />
          <div className="flex items-center gap-3">
            <Link href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
              Sign In
            </Link>
            <Link href="/sign-up"
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            ✦ Full-stack Client Operations System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Run your entire client business in one place
          </h1>
          <p className="text-lg text-gray-500 mt-4 leading-relaxed">
            Manage clients, track leads, deliver projects, and get paid — all from a single, beautifully designed dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/sign-up"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign in →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            {["No credit card required", "Free forever", "Full data ownership"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-gray-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-3 shadow-2xl">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1 bg-gray-700 rounded h-5 mx-4" />
            </div>
            <div className="flex gap-3">
              <div className="w-36 bg-gray-700 rounded-lg p-3 space-y-2">
                {["Dashboard", "Clients", "Leads", "Projects", "Invoices", "Reminders"].map((item) => (
                  <div key={item} className={`text-xs px-2 py-1.5 rounded ${item === "Dashboard" ? "bg-white text-gray-900 font-medium" : "text-gray-400"}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Clients", value: "12" },
                    { label: "Revenue", value: "$8,400" },
                    { label: "Projects", value: "5" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-700 rounded-lg p-3">
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-base font-bold text-white mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Recent Clients</p>
                    {["Acme Corp", "TechStart", "DesignCo"].map((c) => (
                      <div key={c} className="flex items-center gap-2 py-1">
                        <div className="w-5 h-5 bg-gray-500 rounded-full" />
                        <p className="text-xs text-gray-300">{c}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Pipeline</p>
                    {[
                      { label: "New", color: "bg-blue-500", width: "w-3/4" },
                      { label: "Qualified", color: "bg-yellow-500", width: "w-1/2" },
                      { label: "Won", color: "bg-green-500", width: "w-1/4" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 py-1">
                        <p className="text-xs text-gray-400 w-16">{item.label}</p>
                        <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                          <div className={`${item.color} ${item.width} h-1.5 rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "7", label: "Core Modules" },
            { value: "100%", label: "Data Ownership" },
            { value: "∞", label: "Clients & Leads" },
            { value: "Free", label: "To Get Started" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-center">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
          <p className="text-gray-500 mt-2">Built for freelancers and agencies who want to stay organized and professional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow hover:border-gray-200">
                <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          <p className="text-gray-500 mt-2">A complete workflow from first contact to final payment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflow.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="text-3xl font-bold text-gray-100 mb-3">{step.step}</div>
                <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{step.description}</p>
              </div>
              {index < workflow.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2 z-10 w-4 h-4 bg-gray-200 rounded-full items-center justify-center">
                  <ArrowRight className="h-2.5 w-2.5 text-gray-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get organized?</h2>
          <p className="text-gray-400 mt-2">Join thousands of freelancers managing their business with ClientOps.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/sign-up"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in"
              className="text-sm text-gray-400 hover:text-white transition-colors">
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Logo href="/" size="sm" variant="dark" />
          <p className="text-xs text-gray-400">Built with Next.js, Prisma & Clerk</p>
        </div>
      </footer>
    </div>
  )
}
