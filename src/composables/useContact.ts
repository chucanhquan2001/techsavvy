import { readonly, ref } from 'vue';
import { postContact } from '@/services/contact';
import type { ContactPayload, ContactResponse, UseContactReturn } from '@/types/contact';

export function useContact(): UseContactReturn {
  const isSubmitting = ref(false);
  const submitSuccess = ref<string | null>(null);
  const submitError = ref<string | null>(null);

  async function submitContact(payload: ContactPayload): Promise<ContactResponse | null> {
    if (isSubmitting.value) {
      return null;
    }

    isSubmitting.value = true;
    submitSuccess.value = null;
    submitError.value = null;

    try {
      const response = await postContact(payload);
      submitSuccess.value = response.message || 'Đã gửi liên hệ thành công.';
      return response;
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Không thể gửi liên hệ lúc này.';
      return null;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    submitContact,
    isSubmitting: readonly(isSubmitting),
    submitSuccess: readonly(submitSuccess),
    submitError: readonly(submitError),
  };
}
