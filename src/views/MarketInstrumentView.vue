<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useMarketInstrument } from '@/composables/useMarketPrices';
import { formatDateTime, formatPrice } from '@/utils/format';

const route = useRoute();
const {
  snapshot,
  history,
  historyMeta,
  isLoading,
  error,
  hasPrev,
  hasNext,
  load,
  nextHistoryPage,
  prevHistoryPage,
} = useMarketInstrument();

function instrument(): string {
  return decodeURIComponent(String(route.params.instrument ?? ''));
}

function loadCurrent(): void {
  const value = instrument();
  if (value) {
    void load(value);
  }
}

onMounted(loadCurrent);
watch(() => route.params.instrument, loadCurrent);
</script>

<template>
  <div class="min-h-screen bg-ink text-slate-200 font-body">
    <AppHeader />

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <RouterLink to="/" class="text-sm text-slate-400 no-underline hover:text-slate-200">
        ← Quay lại dashboard
      </RouterLink>

      <p v-if="isLoading" class="mt-8 text-sm text-slate-400">Đang tải…</p>

      <div
        v-else-if="error"
        class="mt-8 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200"
      >
        <p>{{ error }}</p>
        <button class="mt-3 text-slate-200 underline" type="button" @click="loadCurrent">
          Thử lại
        </button>
      </div>

      <template v-else>
        <section class="mt-6 rounded-2xl border border-line bg-card p-5 sm:p-8">
          <p class="text-sm text-slate-400">Market instrument</p>
          <h1 class="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">
            {{ instrument() }}
          </h1>

          <div v-if="snapshot" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-line bg-slate-950/40 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Value</p>
              <p class="mt-2 text-lg text-white">
                {{ formatPrice(snapshot.value, snapshot.currency, snapshot.unit) }}
              </p>
            </div>
            <div class="rounded-xl border border-line bg-slate-950/40 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Category</p>
              <p class="mt-2 text-lg text-white">{{ snapshot.category || '—' }}</p>
            </div>
            <div class="rounded-xl border border-line bg-slate-950/40 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Source</p>
              <p class="mt-2 text-lg text-white">{{ snapshot.source }}</p>
            </div>
            <div class="rounded-xl border border-line bg-slate-950/40 p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">Quoted at</p>
              <p class="mt-2 text-lg text-white">
                {{ formatDateTime(snapshot.quoted_at) }}
              </p>
            </div>
          </div>

          <p v-else class="mt-6 text-sm text-slate-400">
            Không có snapshot hiện tại cho instrument này.
          </p>
        </section>

        <section class="mt-6 rounded-2xl border border-line bg-card p-5 sm:p-8">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="font-display text-lg font-semibold text-white">History</h2>
              <p class="mt-1 text-sm text-slate-400">
                {{
                  historyMeta.total != null
                    ? `${historyMeta.total} bản ghi lịch sử`
                    : 'Lịch sử giá'
                }}
              </p>
            </div>
          </div>

          <p v-if="!history.length" class="mt-6 text-sm text-slate-400">
            Chưa có lịch sử giá.
          </p>

          <div v-else class="mt-6 overflow-x-auto">
            <table class="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-line text-slate-400">
                  <th class="pb-3 pr-4 font-medium">Quoted</th>
                  <th class="pb-3 pr-4 font-medium">Value</th>
                  <th class="pb-3 pr-4 font-medium">Category</th>
                  <th class="pb-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in history"
                  :key="`${row.quoted_at}-${row.source}-${row.value}`"
                  class="border-b border-line/60 last:border-0"
                >
                  <td class="py-3 pr-4 text-slate-300">
                    {{ formatDateTime(row.quoted_at) }}
                  </td>
                  <td class="py-3 pr-4 text-white">
                    {{ formatPrice(row.value, row.currency, row.unit) }}
                  </td>
                  <td class="py-3 pr-4">
                    <span class="pill">{{ row.category || '—' }}</span>
                  </td>
                  <td class="py-3 text-slate-400">{{ row.source }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="(historyMeta.last_page ?? 1) > 1"
            class="mt-4 flex items-center justify-between text-sm text-slate-400"
          >
            <span>
              Trang {{ historyMeta.current_page ?? 1 }} /
              {{ historyMeta.last_page ?? 1 }}
            </span>
            <div class="flex gap-3">
              <button
                class="pager-btn"
                type="button"
                :disabled="!hasPrev || isLoading"
                @click="prevHistoryPage(instrument())"
              >
                Trước
              </button>
              <button
                class="pager-btn"
                type="button"
                :disabled="!hasNext || isLoading"
                @click="nextHistoryPage(instrument())"
              >
                Sau
              </button>
            </div>
          </div>
        </section>
      </template>
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
