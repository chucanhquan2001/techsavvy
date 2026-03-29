const runtimeConfig = window.__APP_CONFIG__ ?? {};

function normalizePath(path: string | undefined, fallback: string): string {
  if (!path) {
    return fallback;
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export const authConfig = {
  serverUrl: runtimeConfig.AUTH_SERVER_URL || 'http://127.0.0.1:8000',
  clientId: runtimeConfig.AUTH_CLIENT_ID || 'techsavvy-web',
  scope: runtimeConfig.AUTH_SCOPE || 'openid profile email',
  redirectPath: normalizePath(runtimeConfig.AUTH_REDIRECT_PATH, '/'),
  sessionRevalidateMs: runtimeConfig.AUTH_SESSION_REVALIDATE_MS || 300000,
  sessionTtlSeconds: runtimeConfig.AUTH_SESSION_TTL_SECONDS || 2592000,
  endpoints: {
    authorize: normalizePath(runtimeConfig.AUTH_AUTHORIZE_PATH, '/oauth/authorize'),
    token: normalizePath(runtimeConfig.AUTH_TOKEN_PATH, '/api/v1/oauth/pkce/token'),
    session: normalizePath(runtimeConfig.AUTH_SESSION_PATH, '/api/v1/oauth/session'),
    logout: normalizePath(runtimeConfig.AUTH_LOGOUT_PATH, '/api/v1/oauth/logout'),
  },
  storageKeys: {
    state: 'techsavvy.auth.pkce.state',
    verifier: 'techsavvy.auth.pkce.verifier',
    returnTo: 'techsavvy.auth.return_to',
  },
} as const;

export function getAuthRedirectUri(): string {
  return new URL(authConfig.redirectPath, window.location.origin).toString();
}
