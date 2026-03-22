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
    sm: { icon: 28, text: "text-sm", gap: "gap-2" },
    md: { icon: 36, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 44, text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const textColor = variant === "dark" ? "text-gray-900" : "text-white"
  const strokeColor = variant === "dark" ? "#0f172a" : "#ffffff"

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* C */}
      <path
        d="M115,50 A45,45 0 1,0 115,130"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* O */}
      <circle
        cx="100"
        cy="90"
        r="32"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        opacity="0.85"
      />
      {/* Accent dot */}
      <circle cx="130" cy="60" r="5" fill="#6366f1" />
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
