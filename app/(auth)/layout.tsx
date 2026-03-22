import Logo from "@/components/shared/Logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12">
        <Logo href="/" size="md" variant="light" />
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Run your entire client business in one place
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Manage clients, track leads, deliver projects, and get paid — all from one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { value: "7", label: "Core Modules" },
              { value: "100%", label: "Data Ownership" },
              { value: "∞", label: "Clients & Leads" },
              { value: "Free", label: "To Get Started" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[
            { quote: "ClientOps helped me close 3x more deals by keeping my pipeline organized.", author: "Sarah M., Freelance Designer" },
            { quote: "Finally a tool that handles clients, projects AND invoices in one place.", author: "James K., Agency Owner" },
          ].map((testimonial) => (
            <div key={testimonial.author} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-gray-300 italic">"{testimonial.quote}"</p>
              <p className="text-xs text-gray-500 mt-2">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="lg:hidden">
            <Logo href="/" size="lg" variant="dark" />
          </div>
          {children}
          <p className="text-xs text-gray-400">
            Protected by Clerk · Built with Next.js
          </p>
        </div>
      </div>
    </div>
  )
}
