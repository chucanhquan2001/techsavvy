import { apiClient } from './apiClient';
import { apiConfig } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type { NewsItem } from '@/types/news';

export async function fetchNews(): Promise<ApiResponse<NewsItem[]>> {
  return apiClient.getEnvelope<NewsItem[]>(apiConfig.endpoints.news);
}
