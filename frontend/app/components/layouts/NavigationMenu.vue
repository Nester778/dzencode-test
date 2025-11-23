<template>
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
</template>

<script setup lang="ts">
import { useAuthStore } from '~/composables/useStore'

const authStore = useAuthStore()
const route = useRoute()

const userInitials = computed(() => {
  return authStore.user?.value?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
})

const userName = computed(() => authStore.user?.value?.name || 'Пользователь')
const userEmail = computed(() => authStore.user?.value?.email || '')

const handleLogout = () => {
  authStore.logout()
}

onMounted(() => {
  if (process.client) {
    authStore.initialize()
  }
})
</script>

<style scoped>
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
</style>