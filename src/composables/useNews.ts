import { readonly, ref } from 'vue';
import { fetchNews } from '@/services/news';
import type { NewsItem } from '@/types/news';

export function useNews() {
  const items = ref<NewsItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetchNews();
      items.value = Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Không thể tải tin tức.';
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    items: readonly(items),
    isLoading: readonly(isLoading),
    error: readonly(error),
    load,
  };
}
