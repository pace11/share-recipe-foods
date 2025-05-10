export type ApiResponse<T> = {
  status: string
  message?: string
  data: T
  meta?: PaginationMeta
}

export type MutateResponse = {
  status: string
  message?: string
  data: unknown | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}
