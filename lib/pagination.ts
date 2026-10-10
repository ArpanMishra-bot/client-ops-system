export const PAGE_SIZE = 20

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const n = Number.parseInt(raw ?? "1", 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export function buildPaginated<T>(items: T[], total: number, page: number): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}
