<template>
  <div class="register-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-card card border-0 shadow-lg">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h5 class="card-title fw-semibold text-dark mb-2">Регистрация</h5>
                <p class="text-muted small">Заполните информацию для создания аккаунта</p>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label for="name" class="form-label small text-muted fw-semibold">Полное имя</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <User :size="16" class="text-muted" />
                    </span>
                    <input
                        v-model="form.name"
                        type="text"
                        class="form-control border-start-0"
                        id="name"
                        placeholder="Иван Иванов"
                        required
                    >
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label small text-muted fw-semibold">Email</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Mail :size="16" class="text-muted" />
                    </span>
                    <input
                        v-model="form.email"
                        type="email"
                        class="form-control border-start-0"
                        id="email"
                        placeholder="user@example.com"
                        required
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label small text-muted fw-semibold">Пароль</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Lock :size="16" class="text-muted" />
                    </span>
                    <input
                        v-model="form.password"
                        type="password"
                        class="form-control border-start-0"
                        id="password"
                        placeholder="Минимум 6 символов"
                        required
                        minlength="6"
                    >
                  </div>
                  <div class="form-text small text-muted">
                    Пароль должен содержать минимум 6 символов
                  </div>
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label small text-muted fw-semibold">Подтверждение пароля</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <Lock :size="16" class="text-muted" />
                    </span>
                    <input
                        v-model="form.confirmPassword"
                        type="password"
                        class="form-control border-start-0"
                        id="confirmPassword"
                        placeholder="Повторите ваш пароль"
                        required
                    >
                  </div>
                  <div v-if="form.password !== form.confirmPassword && form.confirmPassword" class="form-text small text-danger">
                    Пароли не совпадают
                  </div>
                </div>

                <button
                    type="submit"
                    class="btn btn-success w-100 py-2 fw-semibold"
                    :disabled="form.password !== form.confirmPassword"
                >
                  <span><UserPlus :size="16" class="me-2" /></span>
                  Создать аккаунт
                </button>
              </form>

              <div class="text-center mt-4 pt-3 border-top">
                <p class="text-muted small mb-2">Уже есть аккаунт?</p>
                <NuxtLink to="/auth/login" class="btn btn-outline-secondary btn-sm">
                  <LogIn :size="14" class="me-1" />
                  Войти в систему
                </NuxtLink>
              </div>

              <div class="text-center mt-4">
                <div class="info-card card border-info">
                  <div class="card-body py-2">
                    <small class="text-info">
                      <strong>После регистрации</strong> вы получите доступ ко всем функциям системы управления заказами и продуктами.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, Mail, Lock, User, UserPlus, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '~/composables/useStore'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const handleRegister = async () => {

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

onUnmounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.register-page {
  padding: 2rem 0;
}

.auth-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.input-group-text {
  border-radius: 8px 0 0 8px;
  border: 1px solid #e9ecef;
  background: #f8f9fa;
}

.form-control {
  border-radius: 0 8px 8px 0;
  border: 1px solid #e9ecef;
  border-left: none;
  padding: 12px;
  transition: all 0.2s ease;
}

.form-control:focus {
  box-shadow: none;
  border-color: #28a745;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
}

.btn-success:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary {
  border-radius: 8px;
  border-width: 2px;
  font-weight: 500;
}

.info-card {
  background: rgba(23, 162, 184, 0.1);
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.auth-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .register-page {
    padding: 1rem;
  }

  .auth-card {
    margin: 0 1rem;
  }
}
</style>