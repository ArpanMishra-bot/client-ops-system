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
  const outer = variant === "dark" ? "#0f172a" : "rgba(255,255,255,0.15)"
  const inner = variant === "dark" ? "#6366f1" : "#818cf8"
  const dot = variant === "dark" ? "#ffffff" : "#ffffff"

  const icon = (
    <svg width={s.icon} height={s.icon} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3L32 10.5V25.5L18 33L4 25.5V10.5L18 3Z" fill={outer}/>
      <path d="M18 10L25 14V22L18 26L11 22V14L18 10Z" fill={inner}/>
      <circle cx="18" cy="18" r="3" fill={dot}/>
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
