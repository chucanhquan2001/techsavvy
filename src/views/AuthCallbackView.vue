<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();
const { status, error, isBusy, completeCallback, login } = useAuth();

const statusLabel = computed(() => {
  switch (status.value) {
    case 'authenticating':
      return 'Đang hoàn tất đăng nhập bằng PKCE';
    case 'loading':
      return 'Đang đồng bộ phiên từ auth server';
    case 'authenticated':
      return 'Phiên đã sẵn sàng, đang chuyển hướng';
    case 'guest':
      return 'Chưa có phiên đăng nhập';
    default:
      return 'Đang chuẩn bị xác thực';
  }
});

onMounted(() => {
  const code = typeof route.query.code === 'string' ? route.query.code : null;
  const state = typeof route.query.state === 'string' ? route.query.state : null;
  const callbackError = typeof route.query.error === 'string' ? route.query.error : null;
  const callbackErrorDescription =
    typeof route.query.error_description === 'string' ? route.query.error_description : null;

  void completeCallback({
    code,
    state,
    callbackError,
    callbackErrorDescription,
  }).then((returnTo) => {
    if (returnTo && !error.value) {
      void router.replace(returnTo);
    }
  });
});
</script>

<template>
  <div class="relative overflow-hidden bg-ink text-slate-200 font-body">
    <div class="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-neon/20 blur-3xl"></div>
    <div class="pointer-events-none absolute top-56 -right-16 h-72 w-72 rounded-full bg-skyline/20 blur-3xl"></div>

    <main class="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section class="w-full reveal rounded-3xl border border-line bg-card/85 p-6 backdrop-blur-sm sm:p-9">
        <p class="font-display text-sm uppercase tracking-[0.3em] text-neon">Auth Callback</p>
        <h1 class="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          {{ error ? 'Đăng nhập chưa hoàn tất' : 'Đang hoàn tất đăng nhập' }}
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          {{
            error
              ? error
              : 'Ứng dụng đang xác thực PKCE, đổi authorization code sang HttpOnly cookie và khôi phục phiên an toàn từ auth server.'
          }}
        </p>

        <div class="mt-6 rounded-2xl border border-line/80 bg-slate-950/60 p-4">
          <p class="text-sm text-slate-400">Trạng thái</p>
          <p class="mt-2 text-lg font-semibold text-white">{{ statusLabel }}</p>
          <p class="mt-3 text-sm text-slate-300">
            {{
              error
                ? 'Bạn có thể thử đăng nhập lại sau khi kiểm tra cấu hình callback, CORS và cookie policy.'
                : 'Bạn sẽ được đưa về trang trước đó ngay sau khi phiên được khôi phục.'
            }}
          </p>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button v-if="error" class="action-button action-primary" :disabled="isBusy" @click="login">
            Thử đăng nhập lại
          </button>
          <button v-else class="action-button action-secondary" :disabled="true">
            Đang xử lý...
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.action-button {
  border: 0;
  border-radius: 0.9rem;
  padding: 0.85rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.action-button:hover:enabled {
  transform: translateY(-1px);
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-primary {
  background: linear-gradient(135deg, #34d399, #14b8a6);
  color: #031b17;
}

.action-secondary {
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(71, 85, 105, 0.8);
}

.reveal {
  opacity: 0;
  transform: translateY(14px);
  animation: rise 0.75s ease forwards;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
