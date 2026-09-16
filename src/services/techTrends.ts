import { apiClient } from './apiClient';
import { apiConfig } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type { TechTrend, TechTrendListParams } from '@/types/techTrend';

export async function fetchTechTrends(
  params: TechTrendListParams = {}
): Promise<ApiResponse<TechTrend[]>> {
  return apiClient.getEnvelope<TechTrend[]>(
    apiConfig.endpoints.techTrends,
    params
  );
}

export async function fetchTechTrend(
  slug: string
): Promise<ApiResponse<TechTrend>> {
  return apiClient.getEnvelope<TechTrend>(
    `${apiConfig.endpoints.techTrends}/${encodeURIComponent(slug)}`
  );
}
