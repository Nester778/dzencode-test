<template>
  <div class="products-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Продукты</h1>
      <div class="d-flex align-items-center gap-3">
        <div class="filter-container">
          <label class="form-label small text-muted mb-1">Фильтр по типу</label>
          <select
              v-model="selectedType"
              class="form-select"
              style="min-width: 200px;"
          >
            <option value="all">Все типы</option>
            <option
                v-for="type in productTypes"
                :key="type"
                :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>

        <button class="btn btn-success">
          <Plus :size="16" class="me-2" />
          Новый продукт
        </button>
      </div>
    </div>
    <div class="products-container">
      <div class="row g-3">
        <div class="col-12">
          <div class="products-grid">
            <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="product-card card"
            >
              <div class="card-body p-4">
                <div class="product-content">
                  <div class="product-header d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 class="product-title mb-1">{{ product.title }}</h5>
                      <div class="product-type-badge">
                        <span class="badge bg-light text-dark">
                          <Package :size="12" class="me-1" />
                          {{ product.type }}
                        </span>
                      </div>
                    </div>
                    <button
                        class="btn btn-link text-danger p-0"
                        @click="openDeleteModal(product)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>

                  <div class="guarantee-section mb-3">
                    <div class="section-label small text-muted mb-2">Гарантия</div>
                    <div class="guarantee-dates">
                      <div class="date-item">
                        <span class="date-label">Начало:</span>
                        <span class="date-value">{{ formatDateLong(product.guarantee.start) }}</span>
                      </div>
                      <div class="date-item">
                        <span class="date-label">Окончание:</span>
                        <span class="date-value">{{ formatDateShort(product.guarantee.end) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="prices-section mb-3">
                    <div class="section-label small text-muted mb-2">Цена</div>
                    <div class="prices-list">
                      <div
                          v-for="price in product.price"
                          :key="price.symbol"
                          class="price-item d-flex justify-content-between align-items-center"
                          :class="{ 'default-price': price.isDefault }"
                      >
                        <span class="price-value">{{ formatPrice(price.value) }}</span>
                        <span class="price-currency">{{ price.symbol }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="meta-section">
                    <div class="row">
                      <div class="col-6">
                        <div class="meta-item">
                          <span class="meta-label small text-muted">Приход:</span>
                          <span class="meta-value">{{ getOrderTitle(product.order) }}</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="meta-item">
                          <span class="meta-label small text-muted">Серийный номер:</span>
                          <span class="meta-value">{{ product.serialNumber }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="status-section mt-3 pt-3 border-top">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="product-status">
                        <span
                            class="badge"
                            :class="product.isNew ? 'bg-success' : 'bg-secondary'"
                        >
                          {{ product.isNew ? 'Новый' : 'Б/У' }}
                        </span>
                      </div>
                      <div class="product-actions">
                        <button class="btn btn-outline-primary btn-sm">
                          <Edit :size="12" class="me-1" />
                          Редактировать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="empty-state text-center py-5">
        <Package :size="64" class="text-muted mb-3" />
        <h5>Продукты не найдены</h5>
        <p class="text-muted">Попробуйте изменить фильтр или добавить новые продукты</p>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content card animate__animated animate__zoomIn">
        <div class="card-header">
          <h5 class="mb-0">Удалить продукт</h5>
        </div>
        <div class="card-body">
          <p>Вы уверены что хотите удалить "{{ productToDelete?.title }}"?</p>
          <p class="text-muted small">Это действие нельзя отменить.</p>
        </div>
        <div class="card-footer d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" @click="closeDeleteModal">Отмена</button>
          <button class="btn btn-danger" @click="confirmDelete">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash2, Package, Edit } from 'lucide-vue-next'

interface Price {
  value: number
  symbol: string
  isDefault: boolean
}

interface Guarantee {
  start: string
  end: string
}

interface Product {
  id: number
  serialNumber: number
  isNew: number
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: number
  date: string
}

interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

const products = ref<Product[]>([])
const orders = ref<Order[]>([])
const selectedType = ref('all')
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)

onMounted(() => {
  loadSampleData()
})

const loadSampleData = () => {
  orders.value = [
    {
      id: 1,
      title: 'Основной приход',
      date: '2017-04-06T17:20:00',
      description: 'Основной приход оборудования',
      products: []
    },
    {
      id: 2,
      title: 'Дополнительный приход',
      date: '2017-09-06T17:20:00',
      description: 'Дополнительное оборудование',
      products: []
    },
    {
      id: 3,
      title: 'Специальный приход',
      date: '2017-06-06T17:20:00',
      description: 'Специальное оборудование',
      products: []
    }
  ]

  products.value = [
    {
      id: 1,
      serialNumber: 123456,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Монитор Dell UltraSharp',
      type: 'Monitors',
      specification: '27-дюймовый 4K монитор',
      guarantee: {
        start: '2024-01-15T00:00:00',
        end: '2026-01-15T00:00:00'
      },
      price: [
        { value: 450, symbol: 'USD', isDefault: false },
        { value: 16500, symbol: 'UAH', isDefault: true }
      ],
      order: 1,
      date: '2024-01-15T10:30:00'
    },
    {
      id: 2,
      serialNumber: 123457,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Смартфон Samsung Galaxy',
      type: 'Phones',
      specification: 'Flagship smartphone',
      guarantee: {
        start: '2024-02-20T00:00:00',
        end: '2025-02-20T00:00:00'
      },
      price: [
        { value: 800, symbol: 'USD', isDefault: false },
        { value: 32000, symbol: 'UAH', isDefault: true }
      ],
      order: 1,
      date: '2024-02-20T14:15:00'
    },
    {
      id: 3,
      serialNumber: 123458,
      isNew: 0,
      photo: 'pathToFile.jpg',
      title: 'Планшет Apple iPad',
      type: 'Tablets',
      specification: '11-inch Pro model',
      guarantee: {
        start: '2023-11-10T00:00:00',
        end: '2025-05-10T00:00:00'
      },
      price: [
        { value: 900, symbol: 'USD', isDefault: false },
        { value: 36000, symbol: 'UAH', isDefault: true }
      ],
      order: 2,
      date: '2023-11-10T09:45:00'
    },
    {
      id: 4,
      serialNumber: 123459,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Ноутбук Lenovo ThinkPad',
      type: 'Laptops',
      specification: 'Business laptop',
      guarantee: {
        start: '2024-03-01T00:00:00',
        end: '2027-03-01T00:00:00'
      },
      price: [
        { value: 1200, symbol: 'USD', isDefault: false },
        { value: 48000, symbol: 'UAH', isDefault: true }
      ],
      order: 3,
      date: '2024-03-01T16:20:00'
    },
    {
      id: 5,
      serialNumber: 123460,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Игровой монитор ASUS',
      type: 'Monitors',
      specification: '144Hz gaming monitor',
      guarantee: {
        start: '2024-01-25T00:00:00',
        end: '2026-01-25T00:00:00'
      },
      price: [
        { value: 350, symbol: 'USD', isDefault: false },
        { value: 12600, symbol: 'UAH', isDefault: true }
      ],
      order: 2,
      date: '2024-01-25T11:30:00'
    },
    {
      id: 6,
      serialNumber: 123461,
      isNew: 0,
      photo: 'pathToFile.jpg',
      title: 'Смартфон iPhone 13',
      type: 'Phones',
      specification: 'Previous generation',
      guarantee: {
        start: '2023-08-15T00:00:00',
        end: '2024-08-15T00:00:00'
      },
      price: [
        { value: 600, symbol: 'USD', isDefault: false },
        { value: 24000, symbol: 'UAH', isDefault: true }
      ],
      order: 1,
      date: '2023-08-15T13:00:00'
    }
  ]
}

const productTypes = computed(() => {
  const types = new Set(products.value.map(p => p.type))
  return Array.from(types).sort()
})

const filteredProducts = computed(() => {
  if (selectedType.value === 'all') {
    return products.value
  }
  return products.value.filter(product => product.type === selectedType.value)
})

const getOrderTitle = (orderId: number) => {
  const order = orders.value.find(o => o.id === orderId)
  return order?.title || 'Неизвестный приход'
}

const formatDateLong = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatPrice = (value: number) => {
  return value.toLocaleString('ru-RU')
}

const openDeleteModal = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const confirmDelete = () => {
  if (!productToDelete.value) return

  products.value = products.value.filter(p => p.id !== productToDelete.value!.id)
  closeDeleteModal()
}
</script>

<style scoped>
.products-page {
  padding: 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.filter-container .form-select {
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.products-container {
  min-height: 60vh;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-color: #28a745;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.product-type-badge .badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
}

.section-label {
  font-weight: 500;
}

.guarantee-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.date-label {
  color: #6c757d;
}

.date-value {
  font-weight: 500;
  color: #333;
}

.prices-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-item {
  padding: 6px 8px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.875rem;
}

.price-item.default-price {
  background: #e8f5e8;
  border: 1px solid #28a745;
}

.price-value {
  font-weight: 600;
  color: #333;
}

.price-currency {
  color: #6c757d;
  font-weight: 500;
}

.meta-section {
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.75rem;
}

.meta-value {
  font-weight: 500;
  color: #333;
}

.status-section {
  font-size: 0.875rem;
}

.product-status .badge {
  font-size: 0.75rem;
  padding: 4px 8px;
}

.empty-state {
  color: #6c757d;
  grid-column: 1 / -1;
}

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
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-header .d-flex {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .filter-container {
    width: 100%;
  }

  .filter-container .form-select {
    width: 100%;
  }
}
</style>