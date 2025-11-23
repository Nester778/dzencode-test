<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content card animate__animated animate__zoomIn" style="max-width: 500px;">
      <div class="card-header bg-white">
        <h5 class="mb-0">Создать новый приход</h5>
      </div>
      <div class="card-body bg-white">
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="orderTitle" class="form-label">Название прихода</label>
            <input
                v-model="formData.title"
                type="text"
                class="form-control"
                id="orderTitle"
                placeholder="Введите название прихода"
                required
            >
          </div>
          <div class="mb-3">
            <label for="orderDescription" class="form-label">Описание</label>
            <textarea
                v-model="formData.description"
                class="form-control"
                id="orderDescription"
                rows="3"
                placeholder="Введите описание прихода"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="orderDate" class="form-label">Дата прихода</label>
            <input
                v-model="formData.date"
                type="datetime-local"
                class="form-control"
                id="orderDate"
                required
            >
          </div>
        </form>
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
            class="btn btn-success"
            @click="submit"
            :disabled="loading || !formData.title"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Создать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OrderFormData {
  title: string
  description: string
  date: string
}

interface Props {
  show: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'create', orderData: OrderFormData): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<OrderFormData>({
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 16)
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    formData.value = {
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 16)
    }
  }
})

const close = () => {
  emit('update:show', false)
  emit('close')
}

const submit = () => {
  if (!formData.value.title.trim()) return
  emit('create', { ...formData.value })
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

.form-control {
  background: white;
  border-color: #dee2e6;
}

.form-control:focus {
  background: white;
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>