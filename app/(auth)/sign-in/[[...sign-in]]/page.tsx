import { SignIn } from "@clerk/nextjs"
import Logo from "@/components/shared/Logo"

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="lg:hidden">
        <Logo href="/" size="lg" variant="dark" />
      </div>
      <SignIn />
    </div>
  )
}
