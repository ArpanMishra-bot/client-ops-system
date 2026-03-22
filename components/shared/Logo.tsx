import Link from "next/link"
import { cn } from "@/lib/utils"

type Props = {
  size?: "sm" | "md" | "lg"
  variant?: "dark" | "light"
  href?: string
  showText?: boolean
}

export default function Logo({
  size = "md",
  variant = "dark",
  href,
  showText = true,
}: Props) {
  const sizes = {
    sm: { icon: 24, text: "text-sm", gap: "gap-2" },
    md: { icon: 32, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 40, text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const textColor = variant === "dark" ? "text-gray-900" : "text-white"
  const iconBg = variant === "dark" ? "#111827" : "#ffffff"
  const iconFg = variant === "dark" ? "#ffffff" : "#111827"
  const accentColor = variant === "dark" ? "#6366f1" : "#a5b4fc"

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="40" height="40" rx="10" fill={iconBg} />

      {/* Connection lines */}
      <line x1="14" y1="20" x2="26" y2="14" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="20" x2="26" y2="26" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="14" x2="26" y2="26" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* Left node — main hub */}
      <circle cx="14" cy="20" r="4" fill={iconFg} />

      {/* Top right node */}
      <circle cx="26" cy="14" r="3" fill={iconFg} opacity="0.9" />

      {/* Bottom right node */}
      <circle cx="26" cy="26" r="3" fill={iconFg} opacity="0.9" />

      {/* Center dot accent */}
      <circle cx="14" cy="20" r="1.5" fill={accentColor} />
    </svg>
  )

  const content = (
    <div className={`flex items-center ${s.gap}`}>
      {icon}
      {showText && (
        <span className={`font-semibold ${s.text} ${textColor} tracking-tight`}>
          ClientOps
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
