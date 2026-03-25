import { SignUp } from "@clerk/nextjs"
import Logo from "@/components/shared/Logo"
import { CheckCircle } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="text-center pt-8 pb-6 px-8 border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <Logo href="/" size="md" variant="dark" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start managing your client business today</p>
        </div>

        {/* Clerk Sign Up */}
        <div className="px-8 pb-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent p-0",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtons: "flex flex-col gap-3",
                socialButtonsBlockButton: "bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all w-full",
                socialButtonsBlockButtonText: "text-sm font-medium",
                divider: "text-xs text-gray-400",
                dividerLine: "bg-gray-200",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-1.5 block",
                formFieldInput: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all",
                formButtonPrimary: "w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all mt-2",
                footer: "hidden",
                footerAction: "hidden",
                footerActionLink: "hidden",
              },
            }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">Free forever — No credit card required</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Start growing your business today
          </p>
        </div>
      </div>
    </div>
  )
}
