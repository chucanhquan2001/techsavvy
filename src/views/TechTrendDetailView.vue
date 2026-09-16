<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useTechTrendDetail } from '@/composables/useTechTrends';
import { formatDate, formatDateTime } from '@/utils/format';

const route = useRoute();
const { item, isLoading, error, load } = useTechTrendDetail();

function loadCurrent(): void {
  const slug = String(route.params.slug ?? '');
  if (slug) {
    void load(slug);
  }
}

onMounted(loadCurrent);
watch(() => route.params.slug, loadCurrent);
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

      <article v-else-if="item" class="mt-6 rounded-2xl border border-line bg-card p-5 sm:p-8">
        <div class="flex flex-wrap gap-2">
          <span v-if="item.type" class="pill">{{ item.type }}</span>
          <span v-if="item.source" class="pill">{{ item.source }}</span>
          <span v-if="item.language" class="pill">{{ item.language }}</span>
        </div>

        <h1 class="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
          {{ item.title }}
        </h1>

        <div class="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
          <span v-if="item.stars != null">★ {{ item.stars }}</span>
          <span v-if="item.forks != null">Forks {{ item.forks }}</span>
          <span v-if="item.stars_today != null">+{{ item.stars_today }} hôm nay</span>
          <span v-if="item.trend_date">{{ formatDate(item.trend_date) }}</span>
          <span v-else-if="item.published_at">
            {{ formatDateTime(item.published_at) }}
          </span>
        </div>

        <p v-if="item.url" class="mt-4">
          <a
            class="text-sm text-slate-300 underline-offset-2 hover:underline"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
          >
            {{ item.url }}
          </a>
        </p>

        <section v-if="item.summary" class="mt-8">
          <h2 class="text-sm font-medium uppercase tracking-wide text-slate-500">
            Summary
          </h2>
          <p class="mt-2 whitespace-pre-wrap text-slate-300 leading-relaxed">
            {{ item.summary }}
          </p>
        </section>

        <section v-if="item.how_it_works" class="mt-8">
          <h2 class="text-sm font-medium uppercase tracking-wide text-slate-500">
            How it works
          </h2>
          <p class="mt-2 whitespace-pre-wrap text-slate-300 leading-relaxed">
            {{ item.how_it_works }}
          </p>
        </section>

        <section v-if="item.description" class="mt-8">
          <h2 class="text-sm font-medium uppercase tracking-wide text-slate-500">
            Description
          </h2>
          <p class="mt-2 whitespace-pre-wrap text-slate-300 leading-relaxed">
            {{ item.description }}
          </p>
        </section>

        <section
          v-if="item.technologies?.length"
          class="mt-8"
        >
          <h2 class="text-sm font-medium uppercase tracking-wide text-slate-500">
            Technologies
          </h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tech in item.technologies"
              :key="tech"
              class="pill"
            >
              {{ tech }}
            </span>
          </div>
        </section>

        <section v-if="item.topics?.length" class="mt-8">
          <h2 class="text-sm font-medium uppercase tracking-wide text-slate-500">
            Topics
          </h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="topic in item.topics" :key="topic" class="pill">
              {{ topic }}
            </span>
          </div>
        </section>
      </article>
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
</style>
