<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content card animate__animated animate__zoomIn">
      <div class="card-header bg-white">
        <h5 class="mb-0">Удалить приход</h5>
      </div>
      <div class="card-body bg-white">
        <p>Вы уверены что хотите удалить "{{ order?.title }}"?</p>
        <p class="text-muted small">Это действие нельзя отменить.</p>
      </div>
      <div class="card-footer bg-white d-flex gap-2 justify-content-end">
        <button
            class="btn btn-secondary"
            @click="close"
            :disabled="loading"
        >
          Отмена
        </button>
        <button
            class="btn btn-danger"
            @click="confirm"
            :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  order: any | null
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const close = () => {
  emit('update:show', false)
  emit('close')
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  border: none;
  border-radius: 8px;
  background: white;
}

.card-header,
.card-body,
.card-footer {
  background: white;
  border-color: #dee2e6;
}
</style>