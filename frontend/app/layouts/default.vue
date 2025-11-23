<template>
  <div class="app-layout">
    <!-- Верхняя панель -->
    <header class="top-header navbar navbar-light bg-white border-bottom fixed-top">
      <div class="container">
        <div class="navbar-brand fw-bold inventory-title">
          INVENTORY
        </div>

        <div class="search-container mx-4 flex-grow-1">
          <div class="input-group">
            <span class="input-group-text bg-light border-0">
              <i class="bi bi-search"></i>
            </span>
            <input
                type="text"
                class="form-control border-0 bg-light"
                placeholder="Поиск..."
            >
          </div>
        </div>

        <div class="datetime-container">
          <div class="d-flex align-items-center gap-4">
            <div class="current-datetime">
              <div class="current-weekday">{{ currentWeekday }}</div>
              <div class="datetime-details d-flex align-items-center gap-2">
                <span class="current-date">{{ currentDate }}</span>
                <div class="time-container d-flex align-items-center gap-1">
                  <Clock :size="12" color="#28a745" />
                  <span class="current-time">{{ currentTime }}</span>
                </div>
              </div>
            </div>
            <div class="active-sessions badge">
              Активных: {{ activeSessions }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="main-content">
      <div class="container-fluid">
        <div class="row">
          <aside class="sidebar col-md-3 col-lg-2 bg-light border-end vh-100 sticky-top">
            <nav class="nav flex-column py-4">
              <div class="sidebar-section mb-4">
                <h6 class="sidebar-title text-uppercase text-muted small fw-bold mb-3">Навигация</h6>
                <NuxtLink
                    to="/orders"
                    class="nav-link sidebar-link"
                    :class="{ 'active': $route.path === '/orders' }"
                >
                  <i class="bi bi-inbox me-2"></i>
                  Приходы
                </NuxtLink>
                <NuxtLink
                    to="/products"
                    class="nav-link sidebar-link"
                    :class="{ 'active': $route.path === '/products' }"
                >
                  <i class="bi bi-box-seam me-2"></i>
                  Продукты
                </NuxtLink>
              </div>

              <div class="sidebar-section">
                <h6 class="sidebar-title text-uppercase text-muted small fw-bold mb-3">Аккаунт</h6>
                <div class="user-info p-3 bg-white rounded">
                  <div class="d-flex align-items-center">
                    <div class="user-avatar text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                         style="width: 40px; height: 40px;">
                      {{ userInitials }}
                    </div>
                    <div class="user-details">
                      <div class="user-name fw-semibold">{{ userName }}</div>
                      <div class="user-email text-muted small">{{ userEmail }}</div>
                    </div>
                  </div>
                  <button
                      @click="handleLogout"
                      class="btn btn-outline-danger btn-sm w-100 mt-3"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </nav>
          </aside>

          <main class="main-area col-md-9 col-lg-10">
            <div class="content-wrapper py-4">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { useAuthStore, useWebSocketStore } from '~/composables/useStore'

const authStore = useAuthStore()
const websocketStore = useWebSocketStore()

const currentDate = ref('')
const currentWeekday = ref('')
const currentTime = ref('')

const userInitials = computed(() => {
  return authStore.user?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
})

const userName = computed(() => authStore.user?.name || 'Пользователь')
const userEmail = computed(() => authStore.user?.email || '')
const activeSessions = computed(() => websocketStore.activeSessions)

const updateDateTime = () => {
  const now = new Date()

  currentWeekday.value = now.toLocaleDateString('ru-RU', {
    weekday: 'long'
  }).replace(/\b\w/g, l => l.toUpperCase())

  currentDate.value = now.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(' г.', '').replace(/\./g, '')

  currentTime.value = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  if (process.client) {
    authStore.initialize()
  }

  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
/* Стили остаются без изменений */
.app-layout {
  min-height: 100vh;
}

.top-header {
  height: 70px;
  z-index: 1030;
  padding-top: 10px;
  padding-bottom: 10px;
}

.main-content {
  margin-top: 70px;
}

.sidebar {
  padding: 0;
  min-height: calc(100vh - 70px);
}

.sidebar-title {
  padding: 0 1.5rem;
}

.sidebar-link {
  padding: 12px 1.5rem;
  color: #495057;
  border-radius: 0;
  transition: all 0.2s ease;
  text-decoration: none;
}

.sidebar-link:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.sidebar-link.active {
  background-color: #28a745;
  color: white;
  border-right: 3px solid #1e7e34;
}

.sidebar-link i {
  width: 20px;
  text-align: center;
}

.user-avatar {
  background-color: #28a745 !important;
  font-size: 0.9rem;
  font-weight: 600;
}

.main-area {
  background-color: #f8f9fa;
  min-height: calc(100vh - 70px);
}

.content-wrapper {
  padding: 0 2rem;
}

.search-container .input-group {
  max-width: 400px;
}

.search-container .form-control {
  border-radius: 20px;
}

.search-container .input-group-text {
  border-radius: 20px 0 0 20px;
}

.datetime-container {
  min-width: 220px;
}

.current-datetime {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: left;
}

.current-weekday {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 2px;
  font-weight: 600;
}

.datetime-details {
  font-size: 0.8rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-date {
  font-weight: 500;
}

.time-container {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #495057;
}

.current-time {
  font-weight: 600;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.active-sessions {
  background-color: #28a745 !important;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  border: none;
}
</style>