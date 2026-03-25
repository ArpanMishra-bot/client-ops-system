"use client"

import { useEffect, useRef, useState } from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Logo from "@/components/shared/Logo"
import { ArrowRight, Users, TrendingUp, FolderKanban, FileText, Bell, LayoutDashboard, CheckCircle, Star, Play, ChevronRight, Quote, Zap, Shield, Clock, Award } from "lucide-react"
import { motion, useInView, useAnimation } from "framer-motion"

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

const features = [
  { icon: LayoutDashboard, title: "Live Dashboard", description: "Real-time overview of your entire business", benefit: "Know exactly where your business stands at a glance", details: ["Revenue tracking", "Active leads count", "Project progress", "Upcoming reminders"], color: "bg-indigo-50 text-indigo-600" },
  { icon: Users, title: "Client Management", description: "Keep all your client information organized", benefit: "Never lose client details again", details: ["Full contact profiles", "Company details", "Activity history", "Status tracking"], color: "bg-blue-50 text-blue-600" },
  { icon: TrendingUp, title: "Leads Pipeline", description: "Visual kanban pipeline to track every deal", benefit: "Close more deals with visual tracking", details: ["7 pipeline stages", "Deal value tracking", "Priority levels", "Drag & drop"], color: "bg-purple-50 text-purple-600" },
  { icon: FolderKanban, title: "Projects & Tasks", description: "Manage projects with a full task board", benefit: "Deliver projects on time, every time", details: ["4-stage task board", "Progress tracking", "Budget management", "Due dates"], color: "bg-orange-50 text-orange-600" },
  { icon: FileText, title: "Invoicing", description: "Create professional invoices and get paid", benefit: "Get paid faster with professional invoices", details: ["Line item builder", "Auto-numbering", "Status tracking", "Payment records"], color: "bg-green-50 text-green-600" },
  { icon: Bell, title: "Reminders", description: "Never miss a follow-up or deadline", benefit: "Stay on top of everything that matters", details: ["Follow-up alerts", "Meeting reminders", "Payment nudges", "Overdue tracking"], color: "bg-red-50 text-red-600" },
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

const workflow = [
  { step: "01", title: "Add a Lead", description: "Capture prospects and track them through your pipeline stages.", icon: TrendingUp },
  { step: "02", title: "Convert to Client", description: "When a deal closes, convert your lead to a full client profile.", icon: Users },
  { step: "03", title: "Deliver the Project", description: "Create a project, break it into tasks, and track progress.", icon: FolderKanban },
  { step: "04", title: "Get Paid", description: "Generate a professional invoice and mark it paid when received.", icon: FileText },
]

const stats = [
  { value: 5000, suffix: "+", label: "Active Users", prefix: "" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", prefix: "" },
  { value: 10, suffix: "k+", label: "Hours Saved", prefix: "" },
  { value: 4.9, suffix: "", label: "User Rating", prefix: "" },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/" size="md" variant="dark" />
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all">
              Sign In
            </Link>
            <Link href="/sign-up" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all hover:scale-[1.02] group">
              Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent" />
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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
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
              <Link href="/sign-up" className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-gray-800 transition-all hover:scale-[1.02] group">
                Start for free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-all">
                <Play className="h-4 w-4" />
                Watch demo
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs text-gray-500">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
          >
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
                  <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500">Active Clients</p>
                    <p className="text-2xl font-bold text-gray-900"><Counter target={12} /></p>
                    <p className="text-xs text-gray-400">+3 this month</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500">Active Leads</p>
                    <p className="text-2xl font-bold text-gray-900"><Counter target={8} /></p>
                    <p className="text-xs text-gray-400">In pipeline</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900"><Counter target={8400} prefix="$" /></p>
                    <p className="text-xs text-gray-400">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats - Animated Counters */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl font-bold text-gray-900">
                <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
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
                className="group bg-white rounded-xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.benefit}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ul className="space-y-2">
                    {feature.details.slice(0, 3).map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
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

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
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
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
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

      {/* Workflow */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How it works</h2>
          <p className="text-gray-500 mt-2">A complete workflow from first contact to final payment</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {workflow.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-200 mb-2">{step.step}</div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{step.description}</p>
                {i < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Logo Wall */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-100">
        <p className="text-center text-xs text-gray-400 uppercase tracking-wider mb-8">Trusted by innovative companies</p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
          {["Acme Inc", "TechStart", "DesignCo", "Creative Labs", "Studio 9", "Pixel Perfect"].map((logo) => (
            <div key={logo} className="text-gray-400 font-semibold text-sm">{logo}</div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900">{faq.q}</h3>
              <p className="text-sm text-gray-500 mt-2">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to get organized?</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Join 5,000+ freelancers and agencies managing their business with ClientOps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-xl text-base font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] group">
              Start for free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/sign-in" className="text-sm text-gray-300 hover:text-white transition-colors">
              Already have an account? Sign in →
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">No credit card required. Free forever plan available.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo href="/" size="sm" variant="dark" />
          <p className="text-xs text-gray-400">© 2024 ClientOps. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
