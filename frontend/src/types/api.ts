export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[] | null;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
