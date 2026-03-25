"use client"

import { ReactNode } from "react"
import Link from "next/link"

interface PrimaryButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
}

export default function PrimaryButton({ href, onClick, children, className = "", type = "button", disabled = false }: PrimaryButtonProps) {
  const baseClass = `inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClass}>
      {children}
    </button>
  )
}
