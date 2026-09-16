export type ApiStatus = 'ok' | 'fail' | 'error' | 'unauthorized';

export interface ApiMeta {
  timestamp?: string;
  path?: string;
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T;
  errors?: string[] | Record<string, string[]> | null;
  meta?: ApiMeta;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type ListQueryParams = QueryParams & {
  page?: number;
  per_page?: number;
};
