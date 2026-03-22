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
    sm: { box: "w-6 h-6 text-xs rounded-md", text: "text-sm", gap: "gap-2" },
    md: { box: "w-8 h-8 text-sm rounded-lg", text: "text-base", gap: "gap-2.5" },
    lg: { box: "w-10 h-10 text-base rounded-xl", text: "text-xl", gap: "gap-3" },
  }

  const s = sizes[size]
  const textColor = variant === "dark" ? "text-gray-900" : "text-white"
  const boxBg = variant === "dark" ? "bg-indigo-600" : "bg-white"
  const boxText = variant === "dark" ? "text-white" : "text-indigo-600"

  const content = (
    <div className={`flex items-center ${s.gap}`}>
      <div className={`${s.box} ${boxBg} flex items-center justify-center font-bold ${boxText} shrink-0`}>
        CO
      </div>
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
