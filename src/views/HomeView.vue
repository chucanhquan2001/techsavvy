<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useMarketPrices } from '@/composables/useMarketPrices';
import { useNews } from '@/composables/useNews';
import { useTechTrends } from '@/composables/useTechTrends';
import { excerpt, formatDate, formatDateTime, formatPrice } from '@/utils/format';

const {
  items: marketItems,
  isLoading: marketLoading,
  error: marketError,
  category,
  hasPrev: marketHasPrev,
  hasNext: marketHasNext,
  meta: marketMeta,
  load: loadMarket,
  setCategory,
  nextPage: marketNext,
  prevPage: marketPrev,
} = useMarketPrices();

const {
  items: trendItems,
  isLoading: trendLoading,
  error: trendError,
  query,
  hasPrev: trendHasPrev,
  hasNext: trendHasNext,
  meta: trendMeta,
  load: loadTrends,
  search,
  nextPage: trendNext,
  prevPage: trendPrev,
} = useTechTrends();

const {
  items: newsItems,
  isLoading: newsLoading,
  error: newsError,
  load: loadNews,
} = useNews();

const searchInput = ref('');
const expandedNewsId = ref<number | null>(null);

const categories = computed(() => {
  const set = new Set<string>();
  marketItems.value.forEach((item) => {
    if (item.category) {
      set.add(item.category);
    }
  });
  if (category.value) {
    set.add(category.value);
  }
  return Array.from(set).sort();
});

function toggleNews(id: number): void {
  expandedNewsId.value = expandedNewsId.value === id ? null : id;
}

async function handleSearch(): Promise<void> {
  await search(searchInput.value.trim());
}

async function handleCategoryChange(event: Event): Promise<void> {
  const value = (event.target as HTMLSelectElement).value;
  await setCategory(value);
}

onMounted(() => {
  void loadMarket();
  void loadTrends();
  void loadNews();
});
</script>

<template>
  <div class="min-h-screen bg-ink text-slate-200 font-body">
    <AppHeader />

    <main class="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <section>
        <p class="text-sm text-slate-400">Public API data</p>
        <h1 class="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
          TechSavvy Dashboard
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-400">
          Giá thị trường, tech trends và tin tức — tối giản, cập nhật từ API.
        </p>
      </section>

      <!-- Market Prices -->
      <section class="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="font-display text-lg font-semibold text-white">Giá thị trường</h2>
            <p class="mt-1 text-sm text-slate-400">
              {{ marketMeta.total != null ? `${marketMeta.total} bản ghi` : 'Snapshot mới nhất' }}
            </p>
          </div>

          <label class="block text-sm text-slate-400">
            Category
            <select
              class="mt-1 block w-full min-w-40 rounded-lg border border-line bg-slate-950 px-3 py-2 text-slate-200 outline-none focus:border-slate-500 sm:w-auto"
              :value="category"
              @change="handleCategoryChange"
            >
              <option value="">Tất cả</option>
              <option v-for="item in categories" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>
        </div>

        <p v-if="marketLoading" class="mt-6 text-sm text-slate-400">Đang tải giá thị trường…</p>

        <div
          v-else-if="marketError"
          class="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200"
        >
          <p>{{ marketError }}</p>
          <button class="mt-3 text-slate-200 underline" type="button" @click="loadMarket()">
            Thử lại
          </button>
        </div>

        <p v-else-if="!marketItems.length" class="mt-6 text-sm text-slate-400">
          Chưa có dữ liệu giá thị trường.
        </p>

        <div v-else class="mt-6 overflow-x-auto">
          <table class="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr class="border-b border-line text-slate-400">
                <th class="pb-3 pr-4 font-medium">Instrument</th>
                <th class="pb-3 pr-4 font-medium">Category</th>
                <th class="pb-3 pr-4 font-medium">Value</th>
                <th class="pb-3 pr-4 font-medium">Quoted</th>
                <th class="pb-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in marketItems"
                :key="`${item.instrument}-${item.source}-${item.quoted_at}`"
                class="border-b border-line/60 last:border-0"
              >
                <td class="py-3 pr-4">
                  <RouterLink
                    class="text-white underline-offset-2 hover:underline"
                    :to="`/markets/${encodeURIComponent(item.instrument)}`"
                  >
                    {{ item.instrument }}
                  </RouterLink>
                </td>
                <td class="py-3 pr-4">
                  <span class="pill">{{ item.category || '—' }}</span>
                </td>
                <td class="py-3 pr-4 text-slate-200">
                  {{ formatPrice(item.value, item.currency, item.unit) }}
                </td>
                <td class="py-3 pr-4 text-slate-400">
                  {{ formatDateTime(item.quoted_at) }}
                </td>
                <td class="py-3 text-slate-400">{{ item.source }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="(marketMeta.last_page ?? 1) > 1"
          class="mt-4 flex items-center justify-between text-sm text-slate-400"
        >
          <span>
            Trang {{ marketMeta.current_page ?? 1 }} / {{ marketMeta.last_page ?? 1 }}
          </span>
          <div class="flex gap-3">
            <button
              class="pager-btn"
              type="button"
              :disabled="!marketHasPrev || marketLoading"
              @click="marketPrev()"
            >
              Trước
            </button>
            <button
              class="pager-btn"
              type="button"
              :disabled="!marketHasNext || marketLoading"
              @click="marketNext()"
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      <!-- Tech Trends -->
      <section class="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="font-display text-lg font-semibold text-white">Tech trends</h2>
            <p class="mt-1 text-sm text-slate-400">
              {{ trendMeta.total != null ? `${trendMeta.total} trends` : 'Xu hướng công nghệ' }}
            </p>
          </div>

          <form class="flex w-full gap-2 sm:w-auto" @submit.prevent="handleSearch">
            <input
              v-model="searchInput"
              class="w-full rounded-lg border border-line bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-slate-500 sm:w-56"
              type="search"
              placeholder="Tìm theo tiêu đề…"
            />
            <button class="pager-btn" type="submit">Tìm</button>
          </form>
        </div>

        <p v-if="trendLoading" class="mt-6 text-sm text-slate-400">Đang tải tech trends…</p>

        <div
          v-else-if="trendError"
          class="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200"
        >
          <p>{{ trendError }}</p>
          <button class="mt-3 text-slate-200 underline" type="button" @click="loadTrends()">
            Thử lại
          </button>
        </div>

        <p v-else-if="!trendItems.length" class="mt-6 text-sm text-slate-400">
          {{ query ? 'Không tìm thấy trend phù hợp.' : 'Chưa có tech trends.' }}
        </p>

        <div v-else class="mt-6 grid gap-3">
          <RouterLink
            v-for="item in trendItems"
            :key="item.slug"
            :to="`/trends/${encodeURIComponent(item.slug)}`"
            class="block rounded-xl border border-line bg-slate-950/40 p-4 no-underline transition-colors hover:border-slate-500"
          >
            <div class="flex flex-wrap items-start justify-between gap-2">
              <h3 class="font-medium text-white">{{ item.title }}</h3>
              <div class="flex flex-wrap gap-2">
                <span v-if="item.language" class="pill">{{ item.language }}</span>
                <span v-if="item.stars != null" class="pill">★ {{ item.stars }}</span>
              </div>
            </div>
            <p v-if="item.summary" class="mt-2 text-sm text-slate-400">
              {{ excerpt(item.summary) }}
            </p>
            <div
              v-if="item.technologies?.length"
              class="mt-3 flex flex-wrap gap-1.5"
            >
              <span
                v-for="tech in item.technologies.slice(0, 5)"
                :key="tech"
                class="pill"
              >
                {{ tech }}
              </span>
            </div>
          </RouterLink>
        </div>

        <div
          v-if="(trendMeta.last_page ?? 1) > 1"
          class="mt-4 flex items-center justify-between text-sm text-slate-400"
        >
          <span>
            Trang {{ trendMeta.current_page ?? 1 }} / {{ trendMeta.last_page ?? 1 }}
          </span>
          <div class="flex gap-3">
            <button
              class="pager-btn"
              type="button"
              :disabled="!trendHasPrev || trendLoading"
              @click="trendPrev()"
            >
              Trước
            </button>
            <button
              class="pager-btn"
              type="button"
              :disabled="!trendHasNext || trendLoading"
              @click="trendNext()"
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      <!-- News -->
      <section class="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <h2 class="font-display text-lg font-semibold text-white">News</h2>
        <p class="mt-1 text-sm text-slate-400">Tin tức — bấm để xem nội dung</p>

        <p v-if="newsLoading" class="mt-6 text-sm text-slate-400">Đang tải tin tức…</p>

        <div
          v-else-if="newsError"
          class="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200"
        >
          <p>{{ newsError }}</p>
          <button class="mt-3 text-slate-200 underline" type="button" @click="loadNews()">
            Thử lại
          </button>
        </div>

        <p v-else-if="!newsItems.length" class="mt-6 text-sm text-slate-400">
          Chưa có tin tức.
        </p>

        <ul v-else class="mt-6 divide-y divide-line/80">
          <li v-for="item in newsItems" :key="item.id" class="py-4 first:pt-0 last:pb-0">
            <button
              class="w-full text-left"
              type="button"
              @click="toggleNews(item.id)"
            >
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h3 class="font-medium text-white">{{ item.title }}</h3>
                <span class="text-xs text-slate-500">{{ formatDate(item.createdAt) }}</span>
              </div>
              <p class="mt-1 text-sm text-slate-400">
                {{ excerpt(item.content) }}
              </p>
            </button>
            <div
              v-if="expandedNewsId === item.id"
              class="mt-3 rounded-xl border border-line bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap"
            >
              {{ item.content }}
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  border: 1px solid #374151;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  color: #cbd5e1;
  background: transparent;
}

.pager-btn {
  border: 1px solid #374151;
  border-radius: 0.5rem;
  background: transparent;
  padding: 0.4rem 0.75rem;
  color: #e2e8f0;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.pager-btn:hover:enabled {
  border-color: #64748b;
}

.pager-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
