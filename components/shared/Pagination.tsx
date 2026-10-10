import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  basePath: string
  page: number
  totalPages: number
  total: number
  pageSize: number
}

export default function Pagination({ basePath, page, totalPages, total, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`)
  const linkClass =
    "inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
  const disabledClass =
    "inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed"

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-gray-500">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={linkClass}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        ) : (
          <span className={disabledClass}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </span>
        )}
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={href(page + 1)} className={linkClass}>
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className={disabledClass}>
            Next <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  )
}
