<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

interface Experience {
  period: string;
  company: string;
  role: string;
  projects: string[];
  tech: string;
}

const introLine = 'PHP Developer | 3+ years of experience';
const introSummary =
  'I build practical, performance-oriented web systems and enjoy turning business workflows into reliable products with clean architecture and measurable impact.';

const experiences: Experience[] = [
  {
    period: '03/2023 - Present',
    company: 'IMAP Vietnam',
    role: 'Developer',
    projects: [
      'Ticket Project: Lead Developer for database design, requirement gathering, API development, and performance optimization with cache/queue/event listeners.',
      'LMS Student Website: Lead Frontend Developer using Vue 3, TypeScript, Pinia, and Tailwind CSS; built reusable UI and improved initial page load performance.',
      'Enterprise Management System (HRM/CRM/LMS): Developed core and specialized modules and internal APIs for business operations.',
    ],
    tech: 'PHP, Laravel, JavaScript, TypeScript, Vue 3, Vite, Pinia, MongoDB, MySQL, Docker',
  },
  {
    period: '08/2022 - 02/2023',
    company: 'VNEXT Software',
    role: 'Intern Developer',
    projects: [
      'Discovery Project: Developed customer care management features for Japanese clients.',
      'Completed assigned tasks successfully and received strong feedback from management.',
    ],
    tech: 'PHP, Zend Framework, JavaScript, MySQL',
  },
];

const technicalSkills: string[] = [
  'PHP (Laravel), JavaScript + TypeScript (Vue 3, jQuery), HTML5, CSS3 (Bootstrap, Tailwind CSS)',
  'MySQL, SQL Server, MongoDB',
  'Microservices, API Gateway, RESTful API',
  'Repository Pattern, Dependency Injection, Service Container (Laravel)',
  'Docker (basic), Git (GitHub/GitLab)',
];

const softSkills: string[] = [
  'Teamwork',
  'Effective communication',
  'Problem solving',
  'Time management',
  'Technical English (reading/research)',
];

const {
  status,
  user,
  expiresAt,
  error,
  isInitialized,
  isBusy,
  isAuthenticated,
  initialize,
  login,
  logout,
  refreshSession,
} = useAuth();

const userLabel = computed(() => {
  if (!user.value) {
    return 'Guest';
  }

  return (
    user.value.display_name ||
    user.value.name ||
    user.value.email ||
    user.value.username ||
    user.value.sub ||
    'Authenticated user'
  );
});

const expiresAtLabel = computed(() => {
  if (!expiresAt.value) {
    return 'Session managed by auth server';
  }

  const date = new Date(expiresAt.value);

  if (Number.isNaN(date.getTime())) {
    return expiresAt.value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
});

const statusLabel = computed(() => {
  switch (status.value) {
    case 'authenticating':
      return 'Đang hoàn tất đăng nhập bằng PKCE';
    case 'loading':
      return isAuthenticated.value ? 'Đang đồng bộ lại phiên' : 'Đang kiểm tra phiên đăng nhập';
    case 'authenticated':
      return 'Đăng nhập an toàn qua HttpOnly cookie';
    case 'guest':
      return 'Chưa có phiên đăng nhập';
    default:
      return 'Đang khởi tạo bảo mật';
  }
});

onMounted(() => {
  void initialize();
});
</script>

<template>
  <div class="relative overflow-hidden bg-ink text-slate-200 font-body">
    <div class="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-neon/20 blur-3xl"></div>
    <div class="pointer-events-none absolute top-56 -right-16 h-72 w-72 rounded-full bg-skyline/20 blur-3xl"></div>

    <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section class="reveal delay-1 rounded-3xl border border-line bg-card/80 p-6 backdrop-blur-sm sm:p-9">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-3xl">
            <p class="font-display text-sm uppercase tracking-[0.3em] text-neon">Portfolio</p>
            <h1 class="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">Chuc Anh Quan</h1>
            <p class="mt-3 text-lg text-slate-300 sm:text-xl">{{ introLine }}</p>

            <div class="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <a class="chip" href="tel:0853009301">0853 009 301</a>
              <a class="chip" href="mailto:chucquann2011@gmail.com">chucquann2011@gmail.com</a>
              <a class="chip" href="https://quanca.net" target="_blank" rel="noreferrer">quanca.net</a>
              <p class="chip">Me Tri, Ha Noi</p>
              <p class="chip">Male | 04-02-2001</p>
            </div>

            <p class="mt-6 max-w-3xl text-slate-300">{{ introSummary }}</p>
          </div>

          <aside class="w-full max-w-md rounded-3xl border border-neon/30 bg-slate-950/70 p-5 shadow-[0_20px_80px_rgba(52,211,153,0.12)]">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm uppercase tracking-[0.28em] text-neon">Secure Login</p>
                <h2 class="mt-2 font-display text-2xl font-bold text-white">OAuth2 PKCE</h2>
              </div>
              <span class="status-pill" :data-state="status">
                {{ isInitialized ? statusLabel : 'Đang boot session' }}
              </span>
            </div>

            <p class="mt-4 text-sm leading-6 text-slate-300">
              Flow: redirect sang auth server, callback nhận <code>code</code>, exchange bằng PKCE và giữ access token trong
              <code>HttpOnly cookie</code>. Toàn bộ API gọi bằng <code>credentials: 'include'</code>.
            </p>

            <div class="mt-5 rounded-2xl border border-line/80 bg-card/70 p-4">
              <template v-if="isAuthenticated">
                <p class="text-sm text-slate-400">Đã đăng nhập</p>
                <p class="mt-1 text-xl font-semibold text-white">{{ userLabel }}</p>
                <p class="mt-3 text-sm text-slate-300">
                  Hết hạn phiên: <span class="text-white">{{ expiresAtLabel }}</span>
                </p>
              </template>

              <template v-else>
                <p class="text-sm text-slate-400">Trạng thái hiện tại</p>
                <p class="mt-1 text-xl font-semibold text-white">
                  {{ isBusy ? 'Đang kiểm tra phiên...' : 'Sẵn sàng đăng nhập an toàn' }}
                </p>
                <p class="mt-3 text-sm text-slate-300">
                  Nếu cookie trên auth server còn hiệu lực, app sẽ tự khôi phục phiên khi bạn quay lại web.
                </p>
              </template>
            </div>

            <p v-if="error" class="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
              {{ error }}
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              <button class="action-button action-primary" :disabled="isBusy" @click="login">
                {{ isAuthenticated ? 'Đăng nhập lại' : 'Đăng nhập' }}
              </button>
              <button class="action-button action-secondary" :disabled="isBusy" @click="refreshSession">
                Kiểm tra phiên
              </button>
              <button
                class="action-button action-secondary"
                :disabled="isBusy || !isAuthenticated"
                @click="logout"
              >
                Đăng xuất
              </button>
            </div>

            <ul class="mt-5 space-y-2 text-sm text-slate-400">
              <li>- Không lưu access token trong localStorage/sessionStorage.</li>
              <li>- `state` và `code_verifier` chỉ tồn tại tạm thời trong `sessionStorage`.</li>
              <li>- Thời gian giữ phiên đổi được trong `public/env.js` qua `AUTH_SESSION_TTL_SECONDS`.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="reveal delay-2 mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article class="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
          <h2 class="section-title">Work Experience</h2>
          <div class="mt-6 space-y-6">
            <div
              v-for="experience in experiences"
              :key="experience.company"
              class="rounded-2xl border border-line/80 bg-slate-900/40 p-5"
            >
              <p class="text-sm text-neon">{{ experience.period }}</p>
              <h3 class="mt-1 text-xl font-semibold text-white">
                {{ experience.company }} · {{ experience.role }}
              </h3>
              <ul class="mt-3 space-y-2 text-sm text-slate-300 sm:text-base">
                <li v-for="project in experience.projects" :key="project">- {{ project }}</li>
              </ul>
              <p class="mt-3 text-sm text-slate-400">
                <span class="font-medium text-slate-200">Tech stack:</span> {{ experience.tech }}
              </p>
            </div>
          </div>
        </article>

        <div class="space-y-6">
          <article class="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
            <h2 class="section-title">Education</h2>
            <div class="mt-4 space-y-2 text-slate-300">
              <p class="text-neon">08/2019 - 02/2023</p>
              <p class="font-semibold text-white">FPT Polytechnic</p>
              <p>Information Technology (GPA: 8.5/10)</p>
              <p>Three-time Excellent Student award recipient.</p>
            </div>
          </article>

          <article class="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
            <h2 class="section-title">Awards</h2>
            <p class="mt-4 rounded-xl border border-neon/30 bg-neon/10 p-3 text-neon">
              2025 - Employee of the Year
            </p>
          </article>
        </div>
      </section>

      <section class="reveal delay-3 mt-8 grid gap-6 lg:grid-cols-2">
        <article class="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
          <h2 class="section-title">Technical Skills</h2>
          <ul class="mt-5 space-y-3 text-slate-300">
            <li v-for="skill in technicalSkills" :key="skill">- {{ skill }}</li>
          </ul>
        </article>

        <article class="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
          <h2 class="section-title">Soft Skills & Interests</h2>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="skill in softSkills"
              :key="skill"
              class="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-200"
            >
              {{ skill }}
            </span>
          </div>
          <div class="mt-6 rounded-2xl border border-skyline/30 bg-skyline/10 p-4">
            <p class="text-sm uppercase tracking-widest text-skyline">Interests</p>
            <p class="mt-1 text-white">Sports & Traveling</p>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.section-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f8fafc;
}

.chip {
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.3s ease;
}

.chip:hover {
  border-color: #34d399;
  color: #ecfeff;
  transform: translateY(-2px);
}

.status-pill {
  border-radius: 999px;
  border: 1px solid #374151;
  padding: 0.45rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e5e7eb;
}

.status-pill[data-state='authenticated'] {
  border-color: rgba(52, 211, 153, 0.4);
  background: rgba(52, 211, 153, 0.12);
  color: #bbf7d0;
}

.status-pill[data-state='authenticating'],
.status-pill[data-state='loading'],
.status-pill[data-state='idle'] {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
}

.status-pill[data-state='guest'] {
  border-color: rgba(251, 191, 36, 0.25);
  background: rgba(251, 191, 36, 0.1);
  color: #fde68a;
}

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

.delay-1 {
  animation-delay: 0.1s;
}

.delay-2 {
  animation-delay: 0.25s;
}

.delay-3 {
  animation-delay: 0.4s;
}

@keyframes rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
