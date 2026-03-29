function base64UrlEncode(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function randomString(length = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);

  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => charset[value % charset.length]).join('');
}

export async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomString(96);
  const hashedVerifier = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier),
  );

  return {
    verifier,
    challenge: base64UrlEncode(hashedVerifier),
  };
}

export function createState(): string {
  return randomString(40);
}
