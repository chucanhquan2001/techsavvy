import { apiClient } from './apiClient';
import { apiConfig } from '@/config/api';
import type { ApiResponse } from '@/types/api';
import type {
  MarketPrice,
  MarketPriceHistoryParams,
  MarketPriceListParams,
} from '@/types/marketPrice';

export async function fetchMarketPrices(
  params: MarketPriceListParams = {}
): Promise<ApiResponse<MarketPrice[]>> {
  return apiClient.getEnvelope<MarketPrice[]>(
    apiConfig.endpoints.marketPrices,
    params
  );
}

export async function fetchMarketPrice(
  instrument: string,
  source?: string
): Promise<ApiResponse<MarketPrice>> {
  return apiClient.getEnvelope<MarketPrice>(
    `${apiConfig.endpoints.marketPrices}/${encodeURIComponent(instrument)}`,
    source ? { source } : undefined
  );
}

export async function fetchMarketPriceHistory(
  instrument: string,
  params: MarketPriceHistoryParams = {}
): Promise<ApiResponse<MarketPrice[]>> {
  return apiClient.getEnvelope<MarketPrice[]>(
    `${apiConfig.endpoints.marketPrices}/${encodeURIComponent(instrument)}/history`,
    params
  );
}
