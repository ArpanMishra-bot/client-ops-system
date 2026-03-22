import Link from "next/link"
import { ArrowRight, Users, TrendingUp, FolderKanban, FileText, Bell, LayoutDashboard } from "lucide-react"

const features = [
  { icon: LayoutDashboard, title: "Live Dashboard", description: "Real-time overview of your entire business — revenue, clients, projects, and tasks in one place." },
  { icon: Users, title: "Client Management", description: "Keep all your client information organized. Track contacts, companies, and communication history." },
  { icon: TrendingUp, title: "Leads Pipeline", description: "Visual kanban pipeline to track every deal from first contact to closed won." },
  { icon: FolderKanban, title: "Projects & Tasks", description: "Manage projects with a full task board. Track progress, deadlines, and budgets." },
  { icon: FileText, title: "Invoicing", description: "Create professional invoices, track payments, and manage outstanding balances." },
  { icon: Bell, title: "Reminders", description: "Never miss a follow-up. Set reminders for clients, leads, and projects." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-base font-semibold text-gray-900">ClientOps</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 mb-6">
          ✦ Full-stack Client Operations System
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl mx-auto">
          Run your entire client business in one place
        </h1>
        <p className="text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
          Manage clients, track leads, deliver projects, and get paid — all from a single, beautifully designed dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link href="/sign-up"
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/sign-in"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-6 py-3">
            Sign in →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "7", label: "Core Modules" },
              { value: "100%", label: "Data Ownership" },
              { value: "∞", label: "Clients & Leads" },
              { value: "Free", label: "To Get Started" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to run your business</h2>
          <p className="text-gray-500 mt-3">Built for freelancers and agencies who want to stay organized and professional.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gray-900 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get organized?</h2>
          <p className="text-gray-400 mt-3">Start managing your clients and projects like a pro.</p>
          <Link href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors mt-8">
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-sm font-medium text-gray-900">ClientOps</span>
          </div>
          <p className="text-xs text-gray-400">Built with Next.js, Prisma, and Clerk</p>
        </div>
      </footer>
    </div>
  )
}
