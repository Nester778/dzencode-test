<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content animate__animated animate__zoomIn">
      <div class="modal-header">
        <h5 class="modal-title">Редактировать приход</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="editOrderTitle" class="form-label">Название прихода</label>
            <input
                v-model="formData.title"
                type="text"
                class="form-control"
                id="editOrderTitle"
                placeholder="Введите название прихода"
                required
            >
          </div>
          <div class="mb-3">
            <label for="editOrderDescription" class="form-label">Описание</label>
            <textarea
                v-model="formData.description"
                class="form-control"
                id="editOrderDescription"
                rows="3"
                placeholder="Введите описание прихода"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="editOrderDate" class="form-label">Дата прихода</label>
            <input
                v-model="formData.date"
                type="datetime-local"
                class="form-control"
                id="editOrderDate"
                required
            >
          </div>
        </form>
      </div>
      <div class="modal-footer">
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
          Сохранить
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
  order: any | null
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'update', orderData: OrderFormData & { _id: string }): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<OrderFormData>({
  title: '',
  description: '',
  date: ''
})

// Заполняем форму данными заказа при открытии модального окна
watch(() => props.show, (newVal) => {
  if (newVal && props.order) {
    formData.value = {
      title: props.order.title || '',
      description: props.order.description || '',
      date: props.order.date ? new Date(props.order.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
    }
  }
})

const close = () => {
  emit('update:show', false)
  emit('close')
}

const submit = () => {
  if (!formData.value.title.trim() || !props.order) return

  const orderData = {
    _id: props.order._id,
    ...formData.value
  }

  emit('update', orderData)
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
  max-width: 500px;
  width: 90%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: white;
  border-radius: 8px 8px 0 0;
}

.modal-body {
  padding: 1.5rem;
  background: white;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background: white;
  border-radius: 0 0 8px 8px;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
}

.form-control {
  background: white;
  border: 1px solid #dee2e6;
}

.form-control:focus {
  background: white;
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>