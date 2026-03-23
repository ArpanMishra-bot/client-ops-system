import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { ArrowRight, Users, TrendingUp, FolderKanban, FileText, Bell, LayoutDashboard, CheckCircle } from "lucide-react"

const features = [
  {
    icon: LayoutDashboard,
    title: "Live Dashboard",
    description: "Real-time overview of your entire business.",
    details: ["Revenue tracking", "Active leads count", "Project progress", "Upcoming reminders"],
    color: "bg-indigo-50",
    iconColor: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Keep all your client information organized.",
    details: ["Full contact profiles", "Company details", "Activity history", "Status tracking"],
    color: "bg-blue-50",
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Leads Pipeline",
    description: "Visual kanban pipeline to track every deal.",
    details: ["7 pipeline stages", "Deal value tracking", "Priority levels", "Drag & drop"],
    color: "bg-purple-50",
    iconColor: "bg-purple-50 text-purple-600",
  },
  {
    icon: FolderKanban,
    title: "Projects & Tasks",
    description: "Manage projects with a full task board.",
    details: ["4-stage task board", "Progress tracking", "Budget management", "Due dates"],
    color: "bg-orange-50",
    iconColor: "bg-orange-50 text-orange-600",
  },
  {
    icon: FileText,
    title: "Invoicing",
    description: "Create professional invoices and get paid.",
    details: ["Line item builder", "Auto-numbering", "Status tracking", "Payment records"],
    color: "bg-green-50",
    iconColor: "bg-green-50 text-green-600",
  },
  {
    icon: Bell,
    title: "Reminders",
    description: "Never miss a follow-up or deadline.",
    details: ["Follow-up alerts", "Meeting reminders", "Payment nudges", "Overdue tracking"],
    color: "bg-red-50",
    iconColor: "bg-red-50 text-red-600",
  },
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
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
              Sign In
            </Link>
            <Link href="/sign-up" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Get Started <ArrowRight className="h-4 w-4" />
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
            <Link href="/sign-up" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign in →
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {["No credit card required", "Free forever", "Full data ownership"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-gray-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview — matching real app style */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          {/* Browser chrome */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
              phenomenal-empanada-101cf6.netlify.app/dashboard
            </div>
          </div>

          {/* Dashboard UI — white style matching real app */}
          <div className="flex bg-gray-50" style={{height: '420px'}}>
            {/* Sidebar */}
            <div className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
              <div className="h-14 flex items-center px-5 border-b border-gray-100">
                <Logo size="sm" variant="dark" />
              </div>
              <nav className="flex-1 px-3 py-3 space-y-0.5">
                {[
                  { label: "Dashboard", icon: LayoutDashboard, active: true },
                  { label: "Clients", icon: Users },
                  { label: "Leads", icon: TrendingUp },
                  { label: "Projects", icon: FolderKanban },
                  { label: "Invoices", icon: FileText },
                  { label: "Reminders", icon: Bell },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium ${item.active ? "bg-gray-900 text-white" : "text-gray-500"}`}>
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-5">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-5">
                <div className="mb-4">
                  <p className="text-base font-semibold text-gray-900">Welcome back, Arpan 👋</p>
                  <p className="text-xs text-gray-500 mt-0.5">Here's what's happening with your business today.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { label: "Active Clients", value: "12", sub: "Total active clients", icon: Users, color: "bg-blue-50 text-blue-600" },
                    { label: "Active Leads", value: "8", sub: "In pipeline", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
                    { label: "Total Revenue", value: "$8,400", sub: "From paid invoices", icon: FileText, color: "bg-green-50 text-green-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                          <p className="text-lg font-semibold text-gray-900 mt-0.5">{stat.value}</p>
                          <p className="text-xs text-gray-400">{stat.sub}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Recent Clients</p>
                    {["Acme Corp", "TechStart", "DesignCo"].map((c, i) => (
                      <div key={c} className="flex items-center gap-2 py-1">
                        <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{c[0]}</span>
                        </div>
                        <span className="text-xs text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Pipeline</p>
                    {[
                      { label: "New", width: "75%", color: "bg-blue-500" },
                      { label: "Qualified", width: "45%", color: "bg-yellow-500" },
                      { label: "Won", width: "25%", color: "bg-green-500" },
                    ].map((p) => (
                      <div key={p.label} className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{p.label}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className={`h-1.5 rounded-full ${p.color}`} style={{width: p.width}} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className={`${feature.color} rounded-xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{feature.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
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
          <p className="text-gray-400 mt-2">Join freelancers and agencies managing their business with ClientOps.</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
              Get started for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">
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
