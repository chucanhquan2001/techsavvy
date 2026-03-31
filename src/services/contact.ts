import type { ContactPayload, ContactResponse } from '@/types/contact';

const CONTACT_API_URL = 'http://api.quanca.net/api/contact';

export async function postContact(payload: ContactPayload): Promise<ContactResponse> {
  const response = await fetch(CONTACT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data: ContactResponse | null = null;

  try {
    data = (await response.json()) as ContactResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Gửi liên hệ thất bại (${response.status}).`);
  }

  return data ?? {
    success: true,
    message: 'Gửi liên hệ thành công.',
  };
}
