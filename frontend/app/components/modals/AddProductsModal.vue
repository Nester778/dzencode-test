<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content animate__animated animate__zoomIn">
      <div class="modal-header">
        <h5 class="modal-title">Добавить новый продукт</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submit">
          <!-- Photo Upload -->
          <div class="mb-4">
            <label class="form-label">Фото продукта</label>
            <div class="photo-upload-container">
              <div class="current-photo mb-3" v-if="formData.photo">
                <p class="small text-muted mb-2">Выбранное фото:</p>
                <img
                    :src="formData.photo"
                    :alt="formData.title"
                    class="current-photo-img"
                    @error="handleImageError"
                >
              </div>
              <div class="upload-control">
                <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    class="d-none"
                    @change="handleFileUpload"
                >
                <button
                    type="button"
                    class="btn btn-outline-secondary w-100"
                    @click="$refs.fileInput.click()"
                >
                  <i class="bi bi-cloud-upload me-2"></i>
                  {{ formData.photo ? 'Изменить фото' : 'Загрузить фото' }}
                </button>
                <div class="file-info mt-2">
                  <p class="small text-muted mb-1">
                    Максимальный размер: 100KB
                  </p>
                  <div v-if="uploadedFile" class="file-details">
                    <p class="small text-success mb-1">
                      <i class="bi bi-check-circle me-1"></i>
                      Файл выбран: {{ uploadedFile.name }}
                    </p>
                    <p class="small text-muted mb-1">
                      Размер: {{ formatFileSize(uploadedFile.size) }}
                    </p>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        @click="removeUploadedFile"
                    >
                      Удалить
                    </button>
                  </div>
                  <div v-if="fileError" class="alert alert-danger small mt-2 mb-0">
                    {{ fileError }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="addProductTitle" class="form-label">Название продукта</label>
            <input
                v-model="formData.title"
                type="text"
                class="form-control"
                id="addProductTitle"
                placeholder="Введите название продукта"
                required
            >
          </div>

          <div class="mb-3">
            <label for="addProductType" class="form-label">Тип продукта</label>
            <select
                v-model="formData.type"
                class="form-select"
                id="addProductType"
                required
            >
              <option value="">Выберите тип</option>
              <option value="Monitors">Мониторы</option>
              <option value="Laptops">Ноутбуки</option>
              <option value="Phones">Телефоны</option>
              <option value="Tablets">Планшеты</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="addProductSpecification" class="form-label">Характеристики</label>
            <textarea
                v-model="formData.specification"
                class="form-control"
                id="addProductSpecification"
                rows="3"
                placeholder="Введите характеристики продукта"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="addProductSerialNumber" class="form-label">Серийный номер</label>
            <input
                v-model="formData.serialNumber"
                type="number"
                class="form-control"
                id="addProductSerialNumber"
                placeholder="Введите серийный номер"
                required
            >
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="addProductGuaranteeStart" class="form-label">Начало гарантии</label>
                <input
                    v-model="formData.guaranteeStart"
                    type="date"
                    class="form-control"
                    id="addProductGuaranteeStart"
                    required
                >
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="addProductGuaranteeEnd" class="form-label">Окончание гарантии</label>
                <input
                    v-model="formData.guaranteeEnd"
                    type="date"
                    class="form-control"
                    id="addProductGuaranteeEnd"
                    required
                >
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Цены</label>
            <div class="prices-container">
              <div
                  v-for="(price, index) in formData.prices"
                  :key="index"
                  class="price-input-group mb-2"
              >
                <div class="row g-2 align-items-center">
                  <div class="col-md-5">
                    <input
                        v-model="price.value"
                        type="number"
                        class="form-control form-control-sm"
                        :placeholder="`Цена в ${price.symbol}`"
                        required
                    >
                  </div>
                  <div class="col-md-3">
                    <select
                        v-model="price.symbol"
                        class="form-select form-select-sm"
                        required
                    >
                      <option value="UAH">UAH</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check">
                      <input
                          v-model="formData.defaultPriceIndex"
                          class="form-check-input"
                          type="radio"
                          :value="index"
                          :id="`defaultPrice${index}`"
                      >
                      <label class="form-check-label small" :for="`defaultPrice${index}`">
                        Основная
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input
                  v-model="formData.isNew"
                  class="form-check-input"
                  type="checkbox"
                  id="addProductIsNew"
              >
              <label class="form-check-label" for="addProductIsNew">
                Новый продукт
              </label>
            </div>
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
          Создать продукт
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Price {
  value: number
  symbol: string
  isDefault: boolean
}

interface ProductFormData {
  photo: string
  title: string
  type: string
  specification: string
  serialNumber: number
  guaranteeStart: string
  guaranteeEnd: string
  prices: Price[]
  defaultPriceIndex: number
  isNew: boolean
}

interface Props {
  show: boolean
  order: any
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'add-products', products: any[]): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const fileError = ref<string>('')

// Инициализируем пустую форму
const formData = ref<ProductFormData>({
  photo: '',
  title: '',
  type: '',
  specification: '',
  serialNumber: 0,
  guaranteeStart: '',
  guaranteeEnd: '',
  prices: [
    { value: 0, symbol: 'UAH', isDefault: true },
    { value: 0, symbol: 'USD', isDefault: false }
  ],
  defaultPriceIndex: 0,
  isNew: true
})

// Сбрасываем форму при открытии модального окна
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    photo: '',
    title: '',
    type: '',
    specification: '',
    serialNumber: 0,
    guaranteeStart: '',
    guaranteeEnd: '',
    prices: [
      { value: 0, symbol: 'UAH', isDefault: true },
      { value: 0, symbol: 'USD', isDefault: false }
    ],
    defaultPriceIndex: 0,
    isNew: true
  }
  uploadedFile.value = null
  fileError.value = ''
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/product-placeholder.jpg'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  fileError.value = ''

  if (target.files && target.files[0]) {
    const file = target.files[0]

    if (!file.type.startsWith('image/')) {
      fileError.value = 'Пожалуйста, выберите файл изображения (JPEG, PNG, GIF, etc.)'
      return
    }

    const maxSize = 100 * 1024
    if (file.size > maxSize) {
      fileError.value = `Размер файла превышает 100KB. Текущий размер: ${formatFileSize(file.size)}`
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      fileError.value = 'Поддерживаются только файлы: JPEG, PNG, GIF, WebP'
      return
    }

    uploadedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.photo = e.target.result as string
      }
    }
    reader.onerror = () => {
      fileError.value = 'Ошибка при чтении файла'
      uploadedFile.value = null
    }
    reader.readAsDataURL(file)
  }
}

const removeUploadedFile = () => {
  uploadedFile.value = null
  fileError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  formData.value.photo = ''
}

const close = () => {
  emit('update:show', false)
  emit('close')
}

const submit = () => {
  if (!formData.value.title.trim()) return

  if (fileError.value) {
    return
  }

  const prices = formData.value.prices.map((price, index) => ({
    ...price,
    isDefault: index === formData.value.defaultPriceIndex
  }))

  const productData = {
    photo: formData.value.photo,
    title: formData.value.title,
    type: formData.value.type,
    specification: formData.value.specification,
    serialNumber: formData.value.serialNumber,
    guarantee: {
      start: formData.value.guaranteeStart,
      end: formData.value.guaranteeEnd
    },
    price: prices,
    isNew: formData.value.isNew,
    // Добавляем ID заказа для привязки продукта
    orderId: props.order._id
  }

  // Отправляем массив с одним продуктом для совместимости с существующим интерфейсом
  emit('add-products', [productData])
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
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

.price-input-group {
  padding: 6px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.875rem;
}

.price-input-group .form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.price-input-group .form-select-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.photo-upload-container {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: #f8f9fa;
}

.current-photo-img {
  max-width: 100%;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #dee2e6;
}

.upload-control .btn {
  transition: all 0.2s ease;
}

.upload-control .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.file-info {
  font-size: 0.875rem;
}

.file-details {
  border-left: 3px solid #28a745;
  padding-left: 0.5rem;
}

.alert-danger {
  padding: 0.5rem;
  font-size: 0.8rem;
}

@media (max-width: 576px) {
  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }

  .price-input-group .row {
    flex-wrap: nowrap;
  }

  .price-input-group .col-md-5,
  .price-input-group .col-md-3,
  .price-input-group .col-md-4 {
    flex: 0 0 auto;
  }

  .price-input-group .col-md-5 {
    width: 45%;
  }

  .price-input-group .col-md-3 {
    width: 30%;
  }

  .price-input-group .col-md-4 {
    width: 25%;
  }
}
</style>