import Link from "next/link"

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
    sm: { icon: 26, text: "text-sm", gap: "gap-2" },
    md: { icon: 32, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 40, text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const textColor = variant === "dark" ? "text-gray-900" : "text-white"
  const primary = variant === "dark" ? "#0f172a" : "#ffffff"

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top bar */}
      <rect x="6" y="6" width="28" height="5" rx="2.5" fill={primary} />
      {/* Bottom bar */}
      <rect x="6" y="29" width="28" height="5" rx="2.5" fill={primary} />
      {/* Left bar */}
      <rect x="6" y="6" width="5" height="28" rx="2.5" fill={primary} />
      {/* Middle bar — shorter, accent */}
      <rect x="6" y="17.5" width="18" height="5" rx="2.5" fill="#6366f1" />
    </svg>
  )

  const content = (
    <div className={`flex items-center ${s.gap}`}>
      {icon}
      {showText && (
        <span className={`font-bold ${s.text} ${textColor} tracking-tight`}>
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
