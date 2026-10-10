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

  const colorClass = variant === "light" ? "text-white" : "text-primary"

  return (
    <Link href={href} className={`${sizeClasses[size]} ${colorClass} font-bold tracking-tight`}>
      ClientOps
    </Link>
  )
}
