<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header class="border-b border-line bg-ink">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
      <RouterLink
        to="/"
        class="font-display text-lg font-semibold tracking-tight text-white no-underline"
      >
        TechSavvy
      </RouterLink>

      <nav class="flex items-center gap-6 text-sm">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: route.path === '/' }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="nav-link"
          :class="{ active: route.path === '/about' }"
        >
          About
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #f8fafc;
}
</style>
