import { SignIn } from "@clerk/nextjs"
import Logo from "@/components/shared/Logo"
import { CheckCircle } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Horizontal Button Bar - Same width as Clerk UI */}
        <div className="w-full px-6 pt-6">
          <div className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-xl border border-gray-200 shadow-sm py-2.5 flex items-center justify-center gap-2 cursor-pointer">
            <Logo href="/" size="sm" variant="dark" />
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm font-medium text-gray-700">Welcome back</span>
          </div>
        </div>

        {/* Clerk Sign In */}
        <div className="px-6 pb-6">
          <SignIn
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
                divider: "hidden",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-1.5 block",
                formFieldInput: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all",
                formButtonPrimary: "w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all mt-2",
                footer: "hidden",
                footerAction: "hidden",
                footerActionText: "hidden",
                footerActionLink: "hidden",
              },
            }}
          />
        </div>

        {/* Footer - Social Proof */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">Trusted by 5,000+ freelancers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
