import type { ReactNode } from "react"

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
