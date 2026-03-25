"use client"

import { ReactNode } from "react"

interface IconButtonProps {
  onClick?: () => void
  children: ReactNode
  className?: string
  title?: string
  variant?: "default" | "danger"
}

export default function IconButton({ onClick, children, className = "", title, variant = "default" }: IconButtonProps) {
  const variantClasses = {
    default: "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
    danger: "text-gray-400 hover:text-red-600 hover:bg-red-50",
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
