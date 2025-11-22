<template>
  <div class="login-page min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow animate__animated animate__fadeIn">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="card-title">📦 Orders & Products</h2>
                <p class="text-muted">Войдите в свой аккаунт</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="user@example.com"
                      required
                  >
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                      v-model="form.password"
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="••••••••"
                      required
                  >
                </div>

                <button
                    type="submit"
                    class="btn btn-primary w-100 py-2"
                    :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Войти
                </button>
              </form>

              <div class="text-center mt-3">
                <small class="text-muted">
                  Тестовые данные: test@example.com / password123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: Заменить на реальный API вызов
    console.log('Login attempt:', form.value)

    // Имитация успешного входа
    setTimeout(() => {
      localStorage.setItem('auth_token', 'fake-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: form.value.email
      }))
      router.push('/orders')
    }, 1000)

  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
}

.form-control {
  border-radius: 8px;
  padding: 12px;
}
</style>