import { User } from './user'

export type ApiResponse<T> = {
  status: string
  message?: string
  data: T
  meta?: PaginationMeta
}

export type MutateResponse<T> = {
  status: string
  message?: string
  data?: T
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type LoginResponse = {
  expires: string
  token: string
  user: User
}
