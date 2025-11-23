<template>
  <div class="login-page min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="auth-card card border-0 shadow-lg">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h5 class="card-title fw-semibold text-dark mb-2">Вход в систему</h5>
                <p class="text-muted small">Введите ваши учетные данные</p>
              </div>

              <form @submit.prevent="handleLogin">
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

                <div class="mb-4">
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
                        placeholder="Введите ваш пароль"
                        required
                    >
                  </div>
                </div>

                <button
                    type="submit"
                    class="btn btn-success w-100 py-2 fw-semibold"
                >
                  Войти в систему
                </button>
              </form>

              <div class="text-center mt-4 pt-3 border-top">
                <p class="text-muted small mb-2">Еще нет аккаунта?</p>
                <NuxtLink to="/auth/register" class="btn btn-outline-primary btn-sm">
                  Создать аккаунт
                </NuxtLink>
              </div>

              <div class="text-center mt-4">
                <div class="test-credentials card border-warning">
                  <div class="card-body py-2">
                    <small class="text-warning">
                      <strong>Тестовые данные:</strong><br>
                      test@example.com / password123
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
import { Package, Mail, Lock, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '~/composables/useStore'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const handleLogin = async () => {
  try {
    await authStore.login(form.value)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

onUnmounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.login-page {
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

.btn-outline-primary {
  border-radius: 8px;
  border-width: 2px;
  font-weight: 500;
}

.test-credentials {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
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
  .login-page {
    padding: 1rem;
  }

  .auth-card {
    margin: 0 1rem;
  }
}
</style>