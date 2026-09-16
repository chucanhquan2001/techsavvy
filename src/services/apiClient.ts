/**
 * Base API Client
 * Singleton instance for making HTTP requests
 */

import { apiConfig } from '@/config/api';
import type { ApiResponse, QueryParams } from '@/types/api';

interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: QueryParams;
  withCredentials?: boolean;
}

function buildUrl(baseUrl: string, endpoint: string, params?: QueryParams): string {
  const url = new URL(`${baseUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = apiConfig.baseUrl;
    this.timeout = apiConfig.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.timeout,
      params,
      withCredentials = false,
      ...fetchOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(buildUrl(this.baseUrl, endpoint, params), {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...fetchOptions.headers,
        },
        credentials: withCredentials ? 'include' : 'omit',
      });

      clearTimeout(timeoutId);

      let data: T | null = null;

      try {
        data = (await response.json()) as T;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const message =
          data && typeof data === 'object' && 'message' in data
            ? String((data as { message?: string }).message)
            : `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
    });
  }

  async getEnvelope<T>(
    endpoint: string,
    params?: QueryParams
  ): Promise<ApiResponse<T>> {
    const response = await this.get<ApiResponse<T>>(endpoint, params);

    if (response.status && response.status !== 'ok') {
      throw new Error(response.message || 'Request failed');
    }

    return response;
  }
}

export const apiClient = new ApiClient();
