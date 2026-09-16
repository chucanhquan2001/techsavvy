import { createRouter, createWebHistory } from 'vue-router';
import { authConfig } from '@/config/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/trends/:slug',
      name: 'tech-trend-detail',
      component: () => import('@/views/TechTrendDetailView.vue'),
    },
    {
      path: '/markets/:instrument',
      name: 'market-instrument',
      component: () => import('@/views/MarketInstrumentView.vue'),
    },
    {
      path: authConfig.redirectPath,
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
