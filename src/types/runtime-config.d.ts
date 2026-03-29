export {};

declare global {
  interface Window {
    __APP_CONFIG__: {
      API_BASE_URL: string;
      AUTH_SERVER_URL?: string;
      AUTH_CLIENT_ID?: string;
      AUTH_SCOPE?: string;
      AUTH_REDIRECT_PATH?: string;
      AUTH_AUTHORIZE_PATH?: string;
      AUTH_TOKEN_PATH?: string;
      AUTH_SESSION_PATH?: string;
      AUTH_LOGOUT_PATH?: string;
      AUTH_SESSION_REVALIDATE_MS?: number;
      AUTH_SESSION_TTL_SECONDS?: number;
    };
  }
}
