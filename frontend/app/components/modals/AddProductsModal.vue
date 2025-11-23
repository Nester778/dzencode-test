<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content animate__animated animate__zoomIn">
      <div class="modal-header">
        <h5 class="modal-title">Добавить новый продукт</h5>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submit">
          <div class="mb-4">
            <label class="form-label">Фото продукта <span class="text-muted small">(необязательно)</span></label>
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
            <label for="addProductTitle" class="form-label">Название продукта <span class="text-danger">*</span></label>
            <input
                v-model="formData.title"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.title }"
                id="addProductTitle"
                placeholder="Введите название продукта"
                required
            >
            <div v-if="errors.title" class="invalid-feedback">
              {{ errors.title }}
            </div>
          </div>

          <div class="mb-3">
            <label for="addProductType" class="form-label">Тип продукта <span class="text-danger">*</span></label>
            <select
                v-model="formData.type"
                class="form-select"
                :class="{ 'is-invalid': errors.type }"
                id="addProductType"
                required
            >
              <option value="">Выберите тип</option>
              <option value="Monitors">Мониторы</option>
              <option value="Laptops">Ноутбуки</option>
              <option value="Phones">Телефоны</option>
              <option value="Tablets">Планшеты</option>
            </select>
            <div v-if="errors.type" class="invalid-feedback">
              {{ errors.type }}
            </div>
          </div>

          <div class="mb-3">
            <label for="addProductSpecification" class="form-label">Характеристики <span class="text-danger">*</span></label>
            <textarea
                v-model="formData.specification"
                class="form-control"
                :class="{ 'is-invalid': errors.specification }"
                id="addProductSpecification"
                rows="3"
                placeholder="Введите характеристики продукта"
                required
            ></textarea>
            <div v-if="errors.specification" class="invalid-feedback">
              {{ errors.specification }}
            </div>
          </div>

          <div class="mb-3">
            <label for="addProductSerialNumber" class="form-label">Серийный номер <span class="text-danger">*</span></label>
            <input
                v-model="formData.serialNumber"
                type="number"
                class="form-control"
                :class="{ 'is-invalid': errors.serialNumber }"
                id="addProductSerialNumber"
                placeholder="Введите серийный номер"
                required
                min="1"
            >
            <div v-if="errors.serialNumber" class="invalid-feedback">
              {{ errors.serialNumber }}
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="addProductGuaranteeStart" class="form-label">Начало гарантии <span class="text-danger">*</span></label>
                <input
                    v-model="formData.guaranteeStart"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.guaranteeStart }"
                    id="addProductGuaranteeStart"
                    required
                >
                <div v-if="errors.guaranteeStart" class="invalid-feedback">
                  {{ errors.guaranteeStart }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="addProductGuaranteeEnd" class="form-label">Окончание гарантии <span class="text-danger">*</span></label>
                <input
                    v-model="formData.guaranteeEnd"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.guaranteeEnd }"
                    id="addProductGuaranteeEnd"
                    required
                >
                <div v-if="errors.guaranteeEnd" class="invalid-feedback">
                  {{ errors.guaranteeEnd }}
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Цены <span class="text-danger">*</span></label>
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
                        :class="{ 'is-invalid': errors[`price_${index}`] }"
                        :placeholder="`Цена в ${price.symbol}`"
                        required
                        min="0"
                        step="0.01"
                    >
                    <div v-if="errors[`price_${index}`]" class="invalid-feedback">
                      {{ errors[`price_${index}`] }}
                    </div>
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
            :disabled="loading"
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
const errors = ref<Record<string, string>>({})

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
  errors.value = {}
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.title.trim()) {
    errors.value.title = 'Название продукта обязательно для заполнения'
  }

  if (!formData.value.type) {
    errors.value.type = 'Тип продукта обязателен для выбора'
  }

  if (!formData.value.specification.trim()) {
    errors.value.specification = 'Характеристики обязательны для заполнения'
  }

  if (!formData.value.serialNumber || formData.value.serialNumber <= 0) {
    errors.value.serialNumber = 'Введите корректный серийный номер'
  }

  if (!formData.value.guaranteeStart) {
    errors.value.guaranteeStart = 'Дата начала гарантии обязательна'
  }

  if (!formData.value.guaranteeEnd) {
    errors.value.guaranteeEnd = 'Дата окончания гарантии обязательна'
  }

  formData.value.prices.forEach((price, index) => {
    if (!price.value || price.value <= 0) {
      errors.value[`price_${index}`] = `Цена в ${price.symbol} должна быть больше 0`
    }
  })

  if (formData.value.guaranteeStart && formData.value.guaranteeEnd) {
    const startDate = new Date(formData.value.guaranteeStart)
    const endDate = new Date(formData.value.guaranteeEnd)

    if (endDate < startDate) {
      errors.value.guaranteeEnd = 'Дата окончания гарантии не может быть раньше даты начала'
    }
  }

  return Object.keys(errors.value).length === 0
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
  if (!validateForm()) {
    return
  }

  if (fileError.value) {
    return
  }

  const prices = formData.value.prices.map((price, index) => ({
    ...price,
    isDefault: index === formData.value.defaultPriceIndex
  }))

  const productData = {
    photo: formData.value.photo,
    title: formData.value.title.trim(),
    type: formData.value.type,
    specification: formData.value.specification.trim(),
    serialNumber: formData.value.serialNumber,
    guarantee: {
      start: formData.value.guaranteeStart,
      end: formData.value.guaranteeEnd
    },
    price: prices,
    isNew: formData.value.isNew,
    orderId: props.order._id
  }

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

.text-danger {
  color: #dc3545 !important;
}

.text-muted {
  color: #6c757d !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.is-invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 3.6.4.4.4-.4'/%3e%3cpath d='M6 7v1'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
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