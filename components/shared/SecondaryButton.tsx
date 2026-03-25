"use client"

import { ReactNode } from "react"
import Link from "next/link"

interface SecondaryButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
}

export default function SecondaryButton({ href, onClick, children, className = "", type = "button", disabled = false }: SecondaryButtonProps) {
  const baseClass = `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${className}`

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
