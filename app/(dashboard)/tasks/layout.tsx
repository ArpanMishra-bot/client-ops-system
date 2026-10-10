import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tasks",
  description: "See and manage tasks across all projects.",
}

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return children
}
