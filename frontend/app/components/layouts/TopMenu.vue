<!-- components/TopMenu.vue -->
<template>
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
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { useWebSocketStore } from '~/composables/useStore'

const websocketStore = useWebSocketStore()

const currentDate = ref('')
const currentWeekday = ref('')
const currentTime = ref('')

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

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
.top-header {
  height: 70px;
  z-index: 1030;
  padding-top: 10px;
  padding-bottom: 10px;
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