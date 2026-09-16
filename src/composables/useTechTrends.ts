import { computed, readonly, ref } from 'vue';
import { fetchTechTrend, fetchTechTrends } from '@/services/techTrends';
import type { ApiMeta } from '@/types/api';
import type { TechTrend, TechTrendListParams } from '@/types/techTrend';

export function useTechTrends() {
  const items = ref<TechTrend[]>([]);
  const meta = ref<ApiMeta>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(1);
  const query = ref('');

  const hasPrev = computed(() => (meta.value.current_page ?? 1) > 1);
  const hasNext = computed(
    () => (meta.value.current_page ?? 1) < (meta.value.last_page ?? 1)
  );

  async function load(overrides: Partial<TechTrendListParams> = {}): Promise<void> {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    const params: TechTrendListParams = {
      page: overrides.page ?? page.value,
      per_page: overrides.per_page ?? 12,
      q: (overrides.q ?? query.value) || undefined,
    };

    try {
      const response = await fetchTechTrends(params);
      items.value = Array.isArray(response.data) ? response.data : [];
      meta.value = response.meta ?? {};
      page.value = meta.value.current_page ?? params.page ?? 1;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Không thể tải tech trends.';
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function search(value: string): Promise<void> {
    query.value = value;
    page.value = 1;
    await load({ page: 1, q: value || undefined });
  }

  async function nextPage(): Promise<void> {
    if (!hasNext.value) {
      return;
    }
    await load({ page: page.value + 1 });
  }

  async function prevPage(): Promise<void> {
    if (!hasPrev.value) {
      return;
    }
    await load({ page: page.value - 1 });
  }

  return {
    items: readonly(items),
    meta: readonly(meta),
    isLoading: readonly(isLoading),
    error: readonly(error),
    page: readonly(page),
    query: readonly(query),
    hasPrev,
    hasNext,
    load,
    search,
    nextPage,
    prevPage,
  };
}

export function useTechTrendDetail() {
  const item = ref<TechTrend | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function load(slug: string): Promise<void> {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetchTechTrend(slug);
      item.value = response.data ?? null;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Không thể tải chi tiết trend.';
      item.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    item: readonly(item),
    isLoading: readonly(isLoading),
    error: readonly(error),
    load,
  };
}
