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
    sm: { icon: 24, text: "text-sm", gap: "gap-2" },
    md: { icon: 30, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 38, text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const textColor = variant === "dark" ? "text-gray-900" : "text-white"
  const strokeColor = variant === "dark" ? "#0f172a" : "#ffffff"
  const accent = "#818cf8"

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Letter C — no background */}
      <path
        d="M30 13C27 11 23 11 20 12.5C15.5 14.5 12 18.5 12 22C12 25.5 15.5 29.5 20 31.5C23 33 27 33 30 31"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Accent dot */}
      <circle cx="32" cy="22" r="3" fill={accent} />
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
