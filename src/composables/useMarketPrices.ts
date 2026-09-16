import { computed, readonly, ref } from 'vue';
import {
  fetchMarketPrice,
  fetchMarketPriceHistory,
  fetchMarketPrices,
} from '@/services/marketPrices';
import type { ApiMeta } from '@/types/api';
import type {
  MarketPrice,
  MarketPriceHistoryParams,
  MarketPriceListParams,
} from '@/types/marketPrice';

export function useMarketPrices() {
  const items = ref<MarketPrice[]>([]);
  const meta = ref<ApiMeta>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(1);
  const category = ref('');

  const hasPrev = computed(() => (meta.value.current_page ?? 1) > 1);
  const hasNext = computed(
    () => (meta.value.current_page ?? 1) < (meta.value.last_page ?? 1)
  );

  async function load(overrides: Partial<MarketPriceListParams> = {}): Promise<void> {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    const params: MarketPriceListParams = {
      page: overrides.page ?? page.value,
      per_page: overrides.per_page ?? 20,
      category: (overrides.category ?? category.value) || undefined,
    };

    try {
      const response = await fetchMarketPrices(params);
      items.value = Array.isArray(response.data) ? response.data : [];
      meta.value = response.meta ?? {};
      page.value = meta.value.current_page ?? params.page ?? 1;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Không thể tải giá thị trường.';
      items.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function setCategory(value: string): Promise<void> {
    category.value = value;
    page.value = 1;
    await load({ page: 1, category: value || undefined });
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
    category: readonly(category),
    hasPrev,
    hasNext,
    load,
    setCategory,
    nextPage,
    prevPage,
  };
}

export function useMarketInstrument() {
  const snapshot = ref<MarketPrice | null>(null);
  const history = ref<MarketPrice[]>([]);
  const historyMeta = ref<ApiMeta>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const historyPage = ref(1);

  const hasPrev = computed(() => (historyMeta.value.current_page ?? 1) > 1);
  const hasNext = computed(
    () =>
      (historyMeta.value.current_page ?? 1) < (historyMeta.value.last_page ?? 1)
  );

  async function load(
    instrument: string,
    historyParams: MarketPriceHistoryParams = {}
  ): Promise<void> {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const page = historyParams.page ?? historyPage.value;
      const [snapshotRes, historyRes] = await Promise.all([
        fetchMarketPrice(instrument),
        fetchMarketPriceHistory(instrument, {
          page,
          per_page: historyParams.per_page ?? 20,
          from: historyParams.from,
          to: historyParams.to,
          source: historyParams.source,
        }),
      ]);

      snapshot.value = snapshotRes.data ?? null;
      history.value = Array.isArray(historyRes.data) ? historyRes.data : [];
      historyMeta.value = historyRes.meta ?? {};
      historyPage.value = historyMeta.value.current_page ?? page;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Không thể tải chi tiết giá thị trường.';
      snapshot.value = null;
      history.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function nextHistoryPage(instrument: string): Promise<void> {
    if (!hasNext.value) {
      return;
    }
    await load(instrument, { page: historyPage.value + 1 });
  }

  async function prevHistoryPage(instrument: string): Promise<void> {
    if (!hasPrev.value) {
      return;
    }
    await load(instrument, { page: historyPage.value - 1 });
  }

  return {
    snapshot: readonly(snapshot),
    history: readonly(history),
    historyMeta: readonly(historyMeta),
    isLoading: readonly(isLoading),
    error: readonly(error),
    historyPage: readonly(historyPage),
    hasPrev,
    hasNext,
    load,
    nextHistoryPage,
    prevHistoryPage,
  };
}
