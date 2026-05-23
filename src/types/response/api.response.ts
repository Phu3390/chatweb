export interface ApiResponse<T> {
  code: number
  message: string
  data: T | null
}

export interface PageResponse<T> {
  content: T
  size: number
  returned: number
  cursor: object | null
  nextCursor: object | null
  hasMore: boolean //còn dữ liệu không để load tiếp
}