/**
 * API Configuration
 */

const runtimeConfig = window.__APP_CONFIG__;

export const apiConfig = {
  baseUrl:
    runtimeConfig.API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000/api',
  timeout: 10000,
  endpoints: {
    trackVisit: '/track-visit',
  },
} as const;

export type ApiEndpoint = keyof typeof apiConfig.endpoints;
