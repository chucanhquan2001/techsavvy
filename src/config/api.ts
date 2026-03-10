/**
 * API Configuration
 */

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  endpoints: {
    trackVisit: '/track-visit',
  },
} as const;

export type ApiEndpoint = keyof typeof apiConfig.endpoints;
