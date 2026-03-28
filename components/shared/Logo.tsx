"use client"

import Link from "next/link"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
}

export default function Logo({ href = "/", size = "md", variant = "dark" }: LogoProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  }

  const gradientClass = "bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent font-bold"

  return (
    <Link href={href} className={`${sizeClasses[size]} ${gradientClass} tracking-tight`}>
      ClientOps
    </Link>
  )
}
