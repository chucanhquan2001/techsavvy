import type { PaginationParams, QueryParams } from './api';

export interface TechTrend {
  id?: number;
  type: string;
  source: string;
  source_url?: string | null;
  external_id?: string | null;
  title: string;
  slug: string;
  url: string | null;
  description?: string | null;
  readme_excerpt?: string | null;
  summary?: string | null;
  how_it_works?: string | null;
  technologies?: string[] | null;
  language?: string | null;
  topics?: string[] | null;
  stars?: number | null;
  forks?: number | null;
  stars_today?: number | null;
  published_at?: string | null;
  trend_date?: string | null;
  status?: string;
}

export interface TechTrendListParams extends PaginationParams, QueryParams {
  type?: string;
  source?: string;
  status?: string;
  technology?: string;
  date?: string;
  from?: string;
  to?: string;
  q?: string;
}
