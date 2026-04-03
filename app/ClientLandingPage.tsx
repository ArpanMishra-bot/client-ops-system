// app/ClientLandingPage.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  FolderKanban, 
  FileText, 
  Bell, 
  LayoutDashboard, 
  CheckCircle, 
  Star, 
  Play, 
  ChevronRight, 
  Zap, 
  Minus, 
  Plus,
  Sparkles,
  Shield,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react"
import { motion, useInView } from "framer-motion"

// Consistent gradient classes (matching dashboard)
const gradients = {
  primary: "from-indigo-500 to-indigo-600",
  secondary: "from-purple-500 to-purple-600",
  hero: "from-indigo-500 to-purple-600",
  card: "from-indigo-50 to-purple-50",
}

// Animated counter component
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Accordion component for FAQ
function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass-card overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-indigo-50/30 transition-colors active:scale-[0.99]"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        {isOpen ? <Minus className="h-5 w-5 text-indigo-500" /> : <Plus className="h-5 w-5 text-indigo-500" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-500">{answer}</p>
        </div>
      )}
    </div>
  )
}

const features = [
  { 
    icon: LayoutDashboard, 
    title: "Live Dashboard", 
    description: "Real-time overview of your entire business", 
    benefit: "Know exactly where your business stands at a glance",
    details: ["Revenue tracking", "Active leads count", "Project progress", "Upcoming reminders"],
    gradient: gradients.primary
  },
  { 
    icon: Users, 
    title: "Client Management", 
    description: "Keep all your client information organized", 
    benefit: "Never lose client details again",
    details: ["Full contact profiles", "Company details", "Activity history", "Status tracking"],
    gradient: gradients.primary
  },
  { 
    icon: TrendingUp, 
    title: "Leads Pipeline", 
    description: "Visual kanban pipeline to track every deal", 
    benefit: "Close more deals with visual tracking",
    details: ["7 pipeline stages", "Deal value tracking", "Priority levels", "Drag & drop"],
    gradient: gradients.primary
  },
  { 
    icon: FolderKanban, 
    title: "Projects & Tasks", 
    description: "Manage projects with a full task board", 
    benefit: "Deliver projects on time, every time",
    details: ["4-stage task board", "Progress tracking", "Budget management", "Due dates"],
    gradient: gradients.primary
  },
  { 
    icon: FileText, 
    title: "Invoicing", 
    description: "Create professional invoices and get paid", 
    benefit: "Get paid faster with professional invoices",
    details: ["Line item builder", "Auto-numbering", "Status tracking", "Payment records"],
    gradient: gradients.primary
  },
  { 
    icon: Bell, 
    title: "Reminders", 
    description: "Never miss a follow-up or deadline", 
    benefit: "Stay on top of everything that matters",
    details: ["Follow-up alerts", "Meeting reminders", "Payment nudges", "Overdue tracking"],
    gradient: gradients.primary
  },
]

const testimonials = [
  { name: "Sarah Johnson", role: "Freelance Designer", content: "ClientOps has completely transformed how I manage my business. I've saved 10+ hours a week and my clients love the professional invoices.", rating: 5, avatar: "S" },
  { name: "Michael Chen", role: "Digital Agency Owner", content: "The leads pipeline alone is worth the price. I can now track every deal and never miss a follow-up. Best investment I've made.", rating: 5, avatar: "M" },
  { name: "Emily Rodriguez", role: "Marketing Consultant", content: "Finally, one tool that does everything. No more switching between 5 different apps. ClientOps is a game-changer.", rating: 5, avatar: "E" },
]

const faqs = [
  { q: "Is there a free trial?", a: "Yes! You can start for free and use all core features. No credit card required." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can cancel your subscription at any time with no hidden fees." },
  { q: "Is my data secure?", a: "Your data is encrypted and stored securely. We take security seriously." },
  { q: "Can I import my existing clients?", a: "Yes, you can import clients via CSV or add them manually." },
]

const stats = [
  { value: 5000, suffix: "+", label: "Active Users", prefix: "" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", prefix: "" },
  { value: 10, suffix: "k+", label: "Hours Saved", prefix: "" },
  { value: 4.9, suffix: "", label: "User Rating", prefix: "" },
]

export default function ClientLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Matching dashboard header style */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/" size="md" variant="dark" />
          <div className="flex items-center gap-3">
            <Link 
              href="/sign-in" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all active:scale-95"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - With glassmorphism */}
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"
        />
        
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold mb-6">
              <Zap className="h-3 w-3" />
              Trusted by 5,000+ freelancers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Run your entire{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                client business
              </span>{" "}
              in one place
            </h1>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              Manage clients, track leads, deliver projects, and get paid — all from a single, beautifully designed dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link 
                href="/sign-up" 
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="#demo" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-all active:scale-95"
              >
                <Play className="h-4 w-4" />
                Watch demo
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-gray-500">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview - Glass card style */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="glass-card overflow-hidden shadow-2xl">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 text-center">
                  app.clientops.com/dashboard
                </div>
              </div>
              <div className="bg-white p-6">
                <div className="border border-gray-100 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Welcome back, Arpan 👋</p>
                      <p className="text-xs text-gray-500">Here's what's happening with your business today.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all active:scale-95">
                      <p className="text-sm text-gray-500">Active Clients</p>
                      <p className="text-2xl font-bold text-gray-900"><Counter target={12} /></p>
                      <p className="text-xs text-gray-400">+3 this month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all active:scale-95">
                      <p className="text-sm text-gray-500">Active Leads</p>
                      <p className="text-2xl font-bold text-gray-900"><Counter target={8} /></p>
                      <p className="text-xs text-gray-400">In pipeline</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all active:scale-95">
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900"><Counter target={8420} prefix="$" /></p>
                      <p className="text-xs text-gray-400">This month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    {/* Stats Section - Glass cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center hover:shadow-lg transition-all"
            >
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section - Glass cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to succeed</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Built for freelancers and agencies who want to stay organized and professional.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradients.primary} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.benefit}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Pricing Section - Glass card */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <p className="text-gray-500 mt-2">Start for free. No credit card required.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card p-8 text-center hover:shadow-xl transition-all">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              Free Forever
            </div>
            <p className="text-5xl font-bold text-gray-900">$0</p>
            <p className="text-sm text-gray-500 mt-2">per month</p>
            <ul className="mt-6 space-y-3 text-left">
              <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-emerald-500" /> All core features</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-emerald-500" /> Unlimited clients & leads</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-emerald-500" /> Unlimited invoices</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="h-4 w-4 text-emerald-500" /> 5 projects included</li>
            </ul>
            <Link 
              href="/sign-up" 
              className="mt-8 inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section - Glass cards */}
      <section className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by freelancers worldwide</h2>
            <p className="text-gray-500 mt-2">Join thousands of satisfied users</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Glass cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          <p className="text-gray-500 mt-2">Got questions? We've got answers</p>
        </motion.div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <AccordionItem question={faq.q} answer={faq.a} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - Premium gradient */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to get organized?</h2>
            <p className="text-indigo-100 mt-2 max-w-2xl mx-auto">
              Join 5,000+ freelancers and agencies managing their business with ClientOps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link 
                href="/sign-up" 
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl text-base font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/sign-in" 
                className="text-sm text-indigo-100 hover:text-white transition-colors active:scale-95"
              >
                Already have an account? Sign in →
              </Link>
            </div>
            <p className="text-xs text-indigo-200 mt-4">No credit card required. Free forever plan available.</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo href="/" size="sm" variant="dark" />
          <p className="text-xs text-gray-400">© 2024 ClientOps. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors active:scale-95">Privacy</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors active:scale-95">Terms</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors active:scale-95">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
      }
