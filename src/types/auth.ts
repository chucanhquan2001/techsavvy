export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticating'
  | 'authenticated'
  | 'guest';

export interface AuthUser {
  id?: string | number;
  sub?: string;
  name?: string;
  email?: string;
  username?: string;
  display_name?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  authenticated: boolean;
  user: AuthUser | null;
  expires_at: string | null;
}

export interface AuthSessionResponse {
  data?: {
    authenticated?: boolean;
    user?: AuthUser | null;
    expires_at?: string | null;
  };
  authenticated?: boolean;
  user?: AuthUser | null;
  expires_at?: string | null;
  message?: string;
}

export interface TokenExchangeResponse {
  data?: {
    user?: AuthUser | null;
    expires_at?: string | null;
  };
  message?: string;
}

export interface AuthCallbackPayload {
  code: string | null;
  state: string | null;
  callbackError: string | null;
  callbackErrorDescription: string | null;
}

export interface UseAuthReturn {
  status: Readonly<import('vue').Ref<AuthStatus>>;
  user: Readonly<import('vue').Ref<AuthUser | null>>;
  expiresAt: Readonly<import('vue').Ref<string | null>>;
  error: Readonly<import('vue').Ref<string | null>>;
  isInitialized: Readonly<import('vue').Ref<boolean>>;
  isBusy: Readonly<import('vue').Ref<boolean>>;
  isAuthenticated: Readonly<import('vue').Ref<boolean>>;
  initialize: (force?: boolean) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  completeCallback: (payload: AuthCallbackPayload) => Promise<string | null>;
}
