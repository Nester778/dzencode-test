<template>
  <div class="orders-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Приходы / {{ orders.length }}</h1>
      <button class="btn btn-success">
        <Plus :size="16" class="me-2" />
        Новый приход
      </button>
    </div>

    <div class="orders-container">
      <div class="row g-3">
        <div class="col-12" :class="{ 'col-lg-5': selectedOrder }">
          <div class="orders-list">
            <div
                v-for="order in orders"
                :key="order.id"
                class="order-item card"
                :class="{ 'selected': selectedOrder?.id === order.id }"
                @click="selectOrder(order)"
            >
              <div class="card-body p-3">
                <div class="order-content">
                  <div class="order-header d-flex justify-content-between align-items-start mb-2">
                    <h6 class="order-title mb-0">{{ order.title }}</h6>
                    <button
                        class="btn btn-link text-danger p-0"
                        @click.stop="openDeleteModal(order)"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>

                  <div class="order-details">
                    <div class="order-description text-muted small mb-2">
                      {{ order.description }}
                    </div>

                    <div class="order-meta d-flex justify-content-between align-items-center">
                      <div class="products-count">
                        {{ getProductsCount(order) }} Продукта
                      </div>
                      <div class="order-date">
                        {{ formatDateShort(order.date) }}
                      </div>
                      <div class="order-total">
                        {{ calculateTotal(order) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedOrder" class="col-12 col-lg-7">
          <div class="order-details-panel card h-100">
            <div class="card-header bg-white border-bottom">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">{{ selectedOrder.title }}</h5>
                <button
                    class="btn btn-link text-muted p-0"
                    @click="selectedOrder = null"
                >
                  <X :size="20" />
                </button>
              </div>
            </div>

            <div class="card-body">
              <div class="products-section">
                <h6 class="section-title mb-3">Продукты в заказе</h6>
                <div class="products-list">
                  <div
                      v-for="product in selectedOrder.products"
                      :key="product.id"
                      class="product-item card mb-2"
                  >
                    <div class="card-body p-3">
                      <div class="row align-items-center">
                        <div class="col-md-4">
                          <div class="d-flex align-items-center">
                            <div class="product-photo me-3">
                              <img
                                  v-if="product.photo"
                                  :src="product.photo"
                                  :alt="product.title"
                                  class="img-thumbnail"
                              >
                              <div v-else class="no-photo bg-light rounded d-flex align-items-center justify-content-center">
                                <Package :size="24" class="text-muted" />
                              </div>
                            </div>
                            <div>
                              <div class="product-title fw-semibold">{{ product.title }}</div>
                              <div class="product-type text-muted small">{{ product.type }}</div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="guarantee-info">
                            <div class="guarantee-date small">
                              {{ formatDate(product.guarantee.start) }} - {{ formatDate(product.guarantee.end) }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="price-info">
                            <div
                                v-for="price in product.price"
                                :key="price.symbol"
                                class="price-item"
                                :class="{ 'default-price': price.isDefault }"
                            >
                              {{ price.value }} {{ price.symbol }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-2 text-end">
                          <button class="btn btn-outline-secondary btn-sm">
                            <Edit :size="14" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-summary mt-4 pt-3 border-top">
                <div class="row">
                  <div class="col-6">
                    <div class="summary-label">Общая сумма:</div>
                  </div>
                  <div class="col-6 text-end">
                    <div class="summary-value fw-bold text-success">
                      {{ calculateTotal(selectedOrder) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content card animate__animated animate__zoomIn">
        <div class="card-header">
          <h5 class="mb-0">Удалить приход</h5>
        </div>
        <div class="card-body">
          <p>Вы уверены что хотите удалить "{{ orderToDelete?.title }}"?</p>
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
import { Plus, Trash2, X, Package, Edit } from 'lucide-vue-next'

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

const orders = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const showDeleteModal = ref(false)
const orderToDelete = ref<Order | null>(null)

onMounted(() => {
  loadSampleData()
})

const loadSampleData = () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      serialNumber: 1234,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Product 1',
      type: 'Monitors',
      specification: 'Specification 1',
      guarantee: {
        start: '2017-06-29 12:09:33',
        end: '2018-06-29 12:09:33'
      },
      price: [
        { value: 100, symbol: 'USD', isDefault: false },
        { value: 2600, symbol: 'UAH', isDefault: true }
      ],
      order: 1,
      date: '2017-06-29 12:09:33'
    },
    {
      id: 2,
      serialNumber: 5678,
      isNew: 1,
      photo: 'pathToFile.jpg',
      title: 'Product 2',
      type: 'Phones',
      specification: 'Specification 2',
      guarantee: {
        start: '2017-06-29 12:09:33',
        end: '2018-06-29 12:09:33'
      },
      price: [
        { value: 200, symbol: 'USD', isDefault: false },
        { value: 5200, symbol: 'UAH', isDefault: true }
      ],
      order: 2,
      date: '2017-06-29 12:09:33'
    }
  ]

  orders.value = [
    {
      id: 1,
      title: 'Длинное прердинное длинночее название прихода',
      date: '2017-04-06T17:20:00',
      description: 'Описание прихода 1',
      products: Array(23).fill(null).map((_, i) => ({
        ...sampleProducts[0],
        id: i + 1,
        title: `Product ${i + 1}`,
        price: [
          { value: 100 + i * 10, symbol: 'USD', isDefault: false },
          { value: 2600 + i * 100, symbol: 'UAH', isDefault: true }
        ]
      }))
    },
    {
      id: 2,
      title: 'Длинное название прихода',
      date: '2017-09-06T17:20:00',
      description: 'Описание прихода 2',
      products: Array(23).fill(null).map((_, i) => ({
        ...sampleProducts[1],
        id: i + 24,
        title: `Product ${i + 24}`,
        price: [
          { value: 200 + i * 10, symbol: 'USD', isDefault: false },
          { value: 5200 + i * 100, symbol: 'UAH', isDefault: true }
        ]
      }))
    },
    {
      id: 3,
      title: 'Длинное прердинное длинночее название прихода',
      date: '2017-06-06T17:20:00',
      description: 'Описание прихода 3',
      products: Array(15).fill(null).map((_, i) => ({
        ...sampleProducts[0],
        id: i + 47,
        title: `Product ${i + 47}`,
        price: [
          { value: 150 + i * 10, symbol: 'USD', isDefault: false },
          { value: 3900 + i * 100, symbol: 'UAH', isDefault: true }
        ]
      }))
    },
    {
      id: 4,
      title: 'Длинное прердинное название прихода',
      date: '2017-02-06T17:20:00',
      description: 'Описание прихода 4',
      products: Array(8).fill(null).map((_, i) => ({
        ...sampleProducts[1],
        id: i + 62,
        title: `Product ${i + 62}`,
        price: [
          { value: 180 + i * 10, symbol: 'USD', isDefault: false },
          { value: 4680 + i * 100, symbol: 'UAH', isDefault: true }
        ]
      }))
    }
  ]
}

const selectOrder = (order: Order) => {
  selectedOrder.value = order
}

const openDeleteModal = (order: Order) => {
  orderToDelete.value = order
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  orderToDelete.value = null
}

const confirmDelete = () => {
  if (!orderToDelete.value) return

  orders.value = orders.value.filter(o => o.id !== orderToDelete.value!.id)
  if (selectedOrder.value?.id === orderToDelete.value.id) {
    selectedOrder.value = null
  }
  closeDeleteModal()
}

const getProductsCount = (order: Order) => {
  return order.products?.length || 0
}

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('ru-RU', { month: 'short' })
  const year = date.getFullYear()
  return `${day} / ${month} / ${year}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const calculateTotal = (order: Order) => {
  if (!order.products) return '0 ₴'

  const total = order.products.reduce((sum, product) => {
    const uahPrice = product.price.find(p => p.symbol === 'UAH')
    return sum + (uahPrice?.value || 0)
  }, 0)

  const usdTotal = order.products.reduce((sum, product) => {
    const usdPrice = product.price.find(p => p.symbol === 'USD')
    return sum + (usdPrice?.value || 0)
  }, 0)

  return `${total.toLocaleString('ru-RU')} ₴ ${usdTotal.toLocaleString('ru-RU')} $`
}
</script>

<style scoped>
.orders-page {
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

.orders-container {
  min-height: 60vh;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.order-item {
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.order-item:hover {
  border-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.order-item.selected {
  border-color: #28a745;
  background-color: #f8fff9;
}

.order-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.order-description {
  font-size: 0.8rem;
  line-height: 1.2;
}

.order-meta {
  font-size: 0.8rem;
  color: #6c757d;
}

.products-count {
  font-weight: 500;
}

.order-date {
  color: #495057;
}

.order-total {
  font-weight: 600;
  color: #28a745;
}

.order-details-panel {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.order-details-panel .card-body {
  overflow-y: auto;
  flex: 1;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.products-list {
  max-height: 400px;
  overflow-y: auto;
}

.product-item {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: #28a745;
}

.product-photo .no-photo {
  width: 50px;
  height: 50px;
}

.product-title {
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.product-type {
  font-size: 0.8rem;
}

.guarantee-date {
  color: #6c757d;
}

.price-item {
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.price-item.default-price {
  font-weight: 600;
  color: #28a745;
}

.empty-state {
  color: #6c757d;
  margin-top: 2rem;
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

@media (max-width: 991.98px) {
  .orders-list {
    max-height: none;
  }

  .order-details-panel {
    margin-top: 2rem;
    height: auto;
  }
}

.orders-list, .order-details-panel {
  transition: all 0.3s ease;
}
</style>