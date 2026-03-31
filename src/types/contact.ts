import type { Ref } from 'vue';

export interface ContactPayload {
  content: string;
}

export interface ContactResponseData {
  id?: number | string;
  content?: string;
  [key: string]: unknown;
}

export interface ContactResponse {
  success?: boolean;
  message?: string;
  data?: ContactResponseData | null;
  error?: string | null;
  errors?: string[];
}

export interface UseContactReturn {
  submitContact: (payload: ContactPayload) => Promise<ContactResponse | null>;
  isSubmitting: Readonly<Ref<boolean>>;
  submitSuccess: Readonly<Ref<string | null>>;
  submitError: Readonly<Ref<string | null>>;
}
