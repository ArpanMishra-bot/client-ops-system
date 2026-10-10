import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reminders",
  description: "Stay on top of follow-ups and deadlines.",
}

export default function RemindersLayout({ children }: { children: React.ReactNode }) {
  return children
}
