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
  const accent = variant === "dark" ? "#6366f1" : "#818cf8"

  const icon = (
    <svg width={s.icon} height={s.icon} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="3" width="12" height="12" rx="3" transform="rotate(45 18 3)" fill={primary}/>
      <rect x="18" y="15" width="10" height="10" rx="2.5" transform="rotate(45 18 15)" fill={accent}/>
      <rect x="18" y="25" width="8" height="8" rx="2" transform="rotate(45 18 25)" fill={primary} opacity="0.3"/>
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
