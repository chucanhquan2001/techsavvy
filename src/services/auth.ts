import { authConfig, getAuthRedirectUri } from '@/config/auth';
import { createPkcePair, createState } from '@/utils/pkce';
import type { AuthSession, AuthSessionResponse, TokenExchangeResponse } from '@/types/auth';

function joinUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

function normalizeSession(payload: AuthSessionResponse | null): AuthSession {
  const data = payload?.data;
  const authenticated = data?.authenticated ?? payload?.authenticated ?? false;
  const user = data?.user ?? payload?.user ?? null;
  const expiresAt = data?.expires_at ?? payload?.expires_at ?? null;

  return {
    authenticated,
    user: authenticated ? user : null,
    expires_at: authenticated ? expiresAt : null,
  };
}

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json() as Promise<T>;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const payload = await parseJsonSafely<{ message?: string; error?: string }>(response);

  return payload?.message || payload?.error || `Request failed with status ${response.status}`;
}

function setTransientValue(key: string, value: string): void {
  sessionStorage.setItem(key, value);
}

function getTransientValue(key: string): string | null {
  return sessionStorage.getItem(key);
}

function removeTransientValue(key: string): void {
  sessionStorage.removeItem(key);
}

export function getStoredReturnTo(): string {
  return getTransientValue(authConfig.storageKeys.returnTo) || '/';
}

export function consumeStoredReturnTo(): string {
  const returnTo = getStoredReturnTo();
  removeTransientValue(authConfig.storageKeys.returnTo);

  return returnTo;
}

export function clearAuthFlowState(options: { preserveReturnTo?: boolean } = {}): void {
  removeTransientValue(authConfig.storageKeys.state);
  removeTransientValue(authConfig.storageKeys.verifier);

  if (!options.preserveReturnTo) {
    removeTransientValue(authConfig.storageKeys.returnTo);
  }
}

export async function buildAuthorizeUrl(): Promise<string> {
  const { verifier, challenge } = await createPkcePair();
  const state = createState();
  const redirectUri = getAuthRedirectUri();
  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const authorizeUrl = joinUrl(authConfig.serverUrl, authConfig.endpoints.authorize);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: authConfig.clientId,
    redirect_uri: redirectUri,
    scope: authConfig.scope,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  if (authConfig.sessionTtlSeconds > 0) {
    params.set('session_ttl_seconds', String(authConfig.sessionTtlSeconds));
  }

  setTransientValue(authConfig.storageKeys.state, state);
  setTransientValue(authConfig.storageKeys.verifier, verifier);
  setTransientValue(authConfig.storageKeys.returnTo, returnTo);
  console.log(`${authorizeUrl}?${params.toString()}`);
  return `${authorizeUrl}?${params.toString()}`;
}

export async function exchangeCodeForCookieSession(
  code: string,
  state: string,
): Promise<TokenExchangeResponse | null> {
  const storedState = getTransientValue(authConfig.storageKeys.state);
  const codeVerifier = getTransientValue(authConfig.storageKeys.verifier);

  if (!storedState || storedState !== state || !codeVerifier) {
    clearAuthFlowState();
    throw new Error('Invalid PKCE state. Please try logging in again.');
  }

  const response = await fetch(joinUrl(authConfig.serverUrl, authConfig.endpoints.token), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: authConfig.clientId,
      code,
      redirect_uri: getAuthRedirectUri(),
      code_verifier: codeVerifier,
      session_ttl_seconds: authConfig.sessionTtlSeconds,
    }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    clearAuthFlowState();
    throw new Error(message);
  }

  clearAuthFlowState({ preserveReturnTo: true });
  return parseJsonSafely<TokenExchangeResponse>(response);
}

export async function fetchSession(): Promise<AuthSession> {
  const response = await fetch(joinUrl(authConfig.serverUrl, authConfig.endpoints.session), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (response.status === 401) {
    return {
      authenticated: false,
      user: null,
      expires_at: null,
    };
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return normalizeSession(await parseJsonSafely<AuthSessionResponse>(response));
}

export async function logoutSession(): Promise<void> {
  const response = await fetch(joinUrl(authConfig.serverUrl, authConfig.endpoints.logout), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok && response.status !== 401) {
    throw new Error(await parseErrorMessage(response));
  }
}
