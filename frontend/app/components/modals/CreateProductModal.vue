<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content animate__animated animate__zoomIn" style="max-width: 600px;">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEditing ? 'Редактировать продукт' : 'Новый продукт' }}</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submit">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="productTitle" class="form-label">Название продукта *</label>
                <input
                    v-model="formData.title"
                    type="text"
                    class="form-control"
                    id="productTitle"
                    placeholder="Введите название продукта"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="productType" class="form-label">Тип *</label>
                <select
                    v-model="formData.type"
                    class="form-select"
                    id="productType"
                    required
                    :disabled="loading"
                >
                  <option value="">Выберите тип</option>
                  <option value="Monitors">Мониторы</option>
                  <option value="Phones">Телефоны</option>
                  <option value="Tablets">Планшеты</option>
                  <option value="Laptops">Ноутбуки</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="serialNumber" class="form-label">Серийный номер *</label>
                <input
                    v-model="formData.serialNumber"
                    type="number"
                    class="form-control"
                    id="serialNumber"
                    placeholder="Введите серийный номер"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="productSpecification" class="form-label">Спецификация *</label>
                <input
                    v-model="formData.specification"
                    type="text"
                    class="form-control"
                    id="productSpecification"
                    placeholder="Введите спецификацию"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="guaranteeStart" class="form-label">Начало гарантии *</label>
                <input
                    v-model="formData.guarantee.start"
                    type="date"
                    class="form-control"
                    id="guaranteeStart"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="guaranteeEnd" class="form-label">Окончание гарантии *</label>
                <input
                    v-model="formData.guarantee.end"
                    type="date"
                    class="form-control"
                    id="guaranteeEnd"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="priceUSD" class="form-label">Цена (USD) *</label>
                <input
                    v-model="formData.priceUSD"
                    type="number"
                    step="0.01"
                    class="form-control"
                    id="priceUSD"
                    placeholder="0.00"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="priceUAH" class="form-label">Цена (UAH) *</label>
                <input
                    v-model="formData.priceUAH"
                    type="number"
                    step="0.01"
                    class="form-control"
                    id="priceUAH"
                    placeholder="0.00"
                    required
                    :disabled="loading"
                >
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input
                  v-model="formData.isNew"
                  class="form-check-input"
                  type="checkbox"
                  id="isNew"
                  :disabled="loading"
              >
              <label class="form-check-label" for="isNew">
                Новый продукт
              </label>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3">
            {{ error }}
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
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isEditing ? 'Сохранить' : 'Создать' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/composables/useStore'

const ordersStore = useOrdersStore()

interface Props {
  show: boolean
  loading?: boolean
  product?: any | null
  isEditing?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'create', productData: any): void
  (e: 'update', productData: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  product: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const availableOrders = ref<any[]>([])
const error = ref<string>('')

const formData = ref({
  title: '',
  type: '',
  serialNumber: '',
  specification: '',
  guarantee: {
    start: '',
    end: ''
  },
  priceUSD: '',
  priceUAH: '',
  orderId: '',
  isNew: true
})

watch(() => props.show, async (newVal) => {
  if (newVal) {
    await loadOrders()
    resetForm()
    if (props.isEditing && props.product) {
      fillFormWithProductData()
    }
  }
})

const loadOrders = async () => {
  try {
    await ordersStore.fetchOrders()
    availableOrders.value = ordersStore.orders || []
  } catch (err) {
    console.error('Ошибка при загрузке заказов:', err)
    availableOrders.value = []
  }
}

const resetForm = () => {
  const today = new Date().toISOString().split('T')[0]
  const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  formData.value = {
    title: '',
    type: '',
    serialNumber: '',
    specification: '',
    guarantee: {
      start: today,
      end: oneYearLater
    },
    priceUSD: '',
    priceUAH: '',
    orderId: '',
    isNew: true
  }
  error.value = ''
}

const fillFormWithProductData = () => {
  if (!props.product) return

  const product = props.product
  const usdPrice = product.price.find((p: any) => p.symbol === 'USD')
  const uahPrice = product.price.find((p: any) => p.symbol === 'UAH')

  formData.value = {
    title: product.title || '',
    type: product.type || '',
    serialNumber: product.serialNumber?.toString() || '',
    specification: product.specification || '',
    guarantee: {
      start: product.guarantee?.start ? new Date(product.guarantee.start).toISOString().split('T')[0] : '',
      end: product.guarantee?.end ? new Date(product.guarantee.end).toISOString().split('T')[0] : ''
    },
    priceUSD: usdPrice?.value?.toString() || '',
    priceUAH: uahPrice?.value?.toString() || '',
    orderId: typeof product.order === 'object' ? product.order._id : product.order,
    isNew: product.isNew || true
  }
}

const isFormValid = computed(() => {
  return (
      formData.value.title.trim() &&
      formData.value.type &&
      formData.value.serialNumber &&
      formData.value.specification &&
      formData.value.guarantee.start &&
      formData.value.guarantee.end &&
      formData.value.priceUSD &&
      formData.value.priceUAH &&
      formData.value.orderId
  )
})

const close = () => {
  emit('update:show', false)
  emit('close')
}

const submit = () => {
  if (!isFormValid.value) return

  try {
    const productData = {
      title: formData.value.title.trim(),
      type: formData.value.type,
      serialNumber: parseInt(formData.value.serialNumber),
      specification: formData.value.specification.trim(),
      guarantee: {
        start: new Date(formData.value.guarantee.start),
        end: new Date(formData.value.guarantee.end)
      },
      price: [
        { value: parseFloat(formData.value.priceUSD), symbol: 'USD', isDefault: false },
        { value: parseFloat(formData.value.priceUAH), symbol: 'UAH', isDefault: true }
      ],
      orderId: formData.value.orderId,
      isNew: formData.value.isNew,
      photo: 'pathToFile.jpg' // По умолчанию
    }

    if (props.isEditing && props.product) {
      emit('update', { ...productData, _id: props.product._id })
    } else {
      emit('create', productData)
    }
  } catch (err) {
    error.value = 'Ошибка при обработке данных формы'
    console.error('Form submission error:', err)
  }
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
  z-index: 1060;
}

.modal-content {
  width: 90%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  overflow-y: auto;
  flex: 1;
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

.form-control, .form-select {
  background: white;
  border: 1px solid #dee2e6;
}

.form-control:focus, .form-select:focus {
  background: white;
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-control:disabled, .form-select:disabled {
  background-color: #f8f9fa;
  opacity: 1;
}
</style>