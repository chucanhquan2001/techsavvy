import { computed, readonly, ref } from 'vue';
import { authConfig } from '@/config/auth';
import type { AuthCallbackPayload, AuthSession, AuthStatus, AuthUser, UseAuthReturn } from '@/types/auth';
import {
  buildAuthorizeUrl,
  consumeStoredReturnTo,
  exchangeCodeForCookieSession,
  fetchSession,
  logoutSession,
} from '@/services/auth';

const status = ref<AuthStatus>('idle');
const user = ref<AuthUser | null>(null);
const expiresAt = ref<string | null>(null);
const error = ref<string | null>(null);
const isInitialized = ref(false);

const isBusy = computed(() => status.value === 'loading' || status.value === 'authenticating');
const isAuthenticated = computed(() => status.value === 'authenticated');

let initializePromise: Promise<void> | null = null;
let lastValidatedAt = 0;
let listenersBound = false;

function applySession(session: AuthSession): void {
  user.value = session.user;
  expiresAt.value = session.expires_at;
  status.value = session.authenticated ? 'authenticated' : 'guest';
  error.value = null;
  lastValidatedAt = Date.now();
}

function clearSessionState(nextStatus: AuthStatus = 'guest'): void {
  user.value = null;
  expiresAt.value = null;
  status.value = nextStatus;
}

function shouldRevalidate(force = false): boolean {
  if (force) {
    return true;
  }

  if (!lastValidatedAt) {
    return true;
  }

  return Date.now() - lastValidatedAt >= authConfig.sessionRevalidateMs;
}

async function restoreSession(force = false): Promise<void> {
  if (!shouldRevalidate(force)) {
    return;
  }

  status.value = 'loading';

  try {
    applySession(await fetchSession());
  } catch (restoreError) {
    clearSessionState();
    error.value =
      restoreError instanceof Error ? restoreError.message : 'Unable to restore the current session.';
  }
}

async function completeCallback(payload: AuthCallbackPayload): Promise<string | null> {
  const returnTo = consumeStoredReturnTo();
  const { code, state, callbackError, callbackErrorDescription } = payload;

  status.value = 'authenticating';

  if (callbackError) {
    clearSessionState();
    error.value = callbackErrorDescription || callbackError;
    return null;
  }

  if (!code || !state) {
    clearSessionState();
    error.value = 'Authorization callback is missing required PKCE parameters.';
    return null;
  }

  await exchangeCodeForCookieSession(code, state);
  await restoreSession(true);

  return returnTo;
}

function bindLifecycleListeners(): void {
  if (listenersBound || typeof window === 'undefined') {
    return;
  }

  const revalidate = () => {
    if (document.visibilityState === 'visible' && shouldRevalidate()) {
      void restoreSession(true);
    }
  };

  window.addEventListener('focus', revalidate);
  document.addEventListener('visibilitychange', revalidate);
  listenersBound = true;
}

async function initialize(force = false): Promise<void> {
  if (initializePromise && !force) {
    return initializePromise;
  }

  initializePromise = (async () => {
    error.value = null;
    await restoreSession(force);

    bindLifecycleListeners();
    isInitialized.value = true;
  })().finally(() => {
    initializePromise = null;
  });

  return initializePromise;
}

async function login(): Promise<void> {
  error.value = null;
  const authorizeUrl = await buildAuthorizeUrl();
  window.location.assign(authorizeUrl);
}

async function logout(): Promise<void> {
  status.value = 'loading';
  error.value = null;

  try {
    await logoutSession();
  } catch (logoutError) {
    error.value =
      logoutError instanceof Error ? logoutError.message : 'Unable to log out from auth server.';
  } finally {
    clearSessionState();
    lastValidatedAt = 0;
  }
}

async function refreshSession(): Promise<void> {
  await restoreSession(true);
}

export function useAuth(): UseAuthReturn {
  return {
    status: readonly(status),
    user: readonly(user),
    expiresAt: readonly(expiresAt),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    isBusy: readonly(isBusy),
    isAuthenticated: readonly(isAuthenticated),
    initialize,
    login,
    logout,
    refreshSession,
    completeCallback,
  };
}
