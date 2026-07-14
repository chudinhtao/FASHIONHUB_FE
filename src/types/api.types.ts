// ── REQUEST TYPES (Queries & Filters) ────────────────────────
export interface BaseQuery {
  keyword?: string;
  isActive?: boolean;
}

export interface PaginationQuery {
  page?: number;       // Mặc định là 1
  limit?: number;      // Mặc định là 10
}

export interface SortQuery {
  sortBy?: string;
  orderBy?: 'ASC' | 'DESC';
}

export interface ListQuery extends BaseQuery, PaginationQuery, SortQuery {
  [key: string]: any;
}

// ── RESPONSE TYPES (Standard API Envelopes) ───────────────────
export interface ApiErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: ApiErrorDetail[] | null;
  timestamp: string;
  path: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedMeta {
  itemCount: number;      // Số lượng item ở trang hiện tại
  totalItems: number;     // Tổng số lượng item trong DB thỏa mãn bộ lọc
  itemsPerPage: number;   // Số lượng item trên một trang (limit)
  totalPages: number;     // Tổng số trang
  currentPage: number;    // Trang hiện tại
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginatedMeta;
}
