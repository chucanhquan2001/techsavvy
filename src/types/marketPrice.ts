import type { PaginationParams, QueryParams } from './api';

export interface MarketPrice {
  id?: number;
  instrument: string;
  category: string;
  value: string | number;
  currency: string;
  unit: string | null;
  quoted_at: string;
  source: string;
  source_type?: string;
}

export interface MarketPriceListParams extends PaginationParams, QueryParams {
  category?: string;
  instrument?: string;
  currency?: string;
  source?: string;
}

export interface MarketPriceHistoryParams extends PaginationParams, QueryParams {
  from?: string;
  to?: string;
  source?: string;
}
