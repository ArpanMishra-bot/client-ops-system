// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_CURRENCY = "INR"

const CURRENCY_LOCALES: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
}

function localeFor(currency: string): string {
  return CURRENCY_LOCALES[currency] ?? "en-IN"
}

function symbolFor(currency: string): string {
  return currency === "USD" ? "$" : currency === "INR" ? "₹" : `${currency} `
}

// Full currency with 2 decimal places (defaults to Indian rupees, en-IN grouping)
export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
  currencyDisplay: "symbol" | "code" = "symbol"
): string {
  return new Intl.NumberFormat(localeFor(currency), {
    style: 'currency',
    currency,
    currencyDisplay,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Whole-number amount without decimals (e.g. ₹1,25,000)
export function formatAmount(value: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(localeFor(currency), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

// Compact currency. INR uses K / L (lakh) / Cr (crore); USD uses K / M.
export function formatCompactCurrency(value: number, currency: string = DEFAULT_CURRENCY): string {
  const sym = symbolFor(currency)
  if (currency === "USD") {
    if (value >= 1000000) return `${sym}${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${sym}${(value / 1000).toFixed(0)}K`
    return `${sym}${value.toFixed(2)}`
  }
  if (value >= 10000000) return `${sym}${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `${sym}${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `${sym}${(value / 1000).toFixed(0)}K`
  return `${sym}${value.toFixed(2)}`
}
