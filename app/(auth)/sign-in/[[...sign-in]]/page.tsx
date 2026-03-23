import { SignIn } from "@clerk/nextjs"
import Logo from "@/components/shared/Logo"

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <Logo href="/" size="md" variant="dark" />
        <p className="text-sm text-gray-500 mt-2">
          Run your entire client business in one place
        </p>
        <div className="w-full h-px bg-gray-200 mt-4" />
      </div>
      <SignIn />
      <p className="text-xs text-gray-400 text-center mt-5">
        Protected by Clerk · Built with Next.js
      </p>
    </div>
  )
}
