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
      path: authConfig.redirectPath,
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
    },
  ],
});

export default router;
