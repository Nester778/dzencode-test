<template>
  <div class="orders-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Приходы / {{ orders.value.length }}</h1>
      <button class="btn btn-success" @click="openCreateModal">
        <Plus :size="16" class="me-2" />
        Новый приход
      </button>
    </div>

    <div v-if="isLoading.value" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка заказов...</p>
    </div>

    <div v-else class="orders-container">
      <div class="row g-3">
        <div class="col-12" :class="{ 'col-lg-5': selectedOrder }">
          <div class="orders-list">
            <div v-if="orders.value.length === 0" class="empty-state text-center py-5">
              <Package :size="64" class="text-muted mb-3" />
              <h5>Заказов пока нет</h5>
              <p class="text-muted">Создайте первый заказ чтобы начать работу</p>
              <button class="btn btn-success mt-2" @click="openCreateModal">
                <Plus :size="16" class="me-2" />
                Создать заказ
              </button>
            </div>

            <div
                v-for="order in orders.value"
                :key="order._id"
                class="order-item card"
                :class="{ 'selected': selectedOrder?._id === order._id }"
                @click="selectOrder(order)"
            >
              <div class="card-body p-3">
                <div class="order-content">
                  <div class="order-header d-flex justify-content-between align-items-start mb-2">
                    <h6 class="order-title mb-0">{{ order.title }}</h6>
                    <button
                        class="btn btn-link text-danger p-0"
                        @click.stop="openDeleteModal(order)"
                        :disabled="isLoading.value"
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
                    :disabled="isLoading.value"
                >
                  <X :size="20" />
                </button>
              </div>
            </div>

            <div class="card-body">
              <div class="products-section">
                <h6 class="section-title mb-3">Продукты в заказе</h6>

                <div v-if="isLoadingProducts" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-success" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                  </div>
                  <p class="mt-2 text-muted small">Загрузка продуктов...</p>
                </div>

                <div v-else-if="!selectedOrder.products || selectedOrder.products.length === 0"
                     class="empty-products text-center py-4">
                  <Package :size="48" class="text-muted mb-2" />
                  <p class="text-muted">В этом заказе пока нет продуктов</p>
                </div>

                <div v-else class="products-list">
                  <div
                      v-for="product in selectedOrder.products"
                      :key="product._id"
                      class="product-item card mb-2"
                  >
                    <div class="card-body p-3">
                      <div class="row align-items-center">
                        <div class="col-md-4">
                          <div class="d-flex align-items-center">
                            <div class="product-photo me-3">
                              <img
                                  v-if="product.photo && product.photo !== 'pathToFile.jpg'"
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

        <div v-else-if="orders.value.length > 0" class="col-12">
          <div class="empty-state text-center py-5">
            <Package :size="64" class="text-muted mb-3" />
            <h5>Выберите приход</h5>
            <p class="text-muted">Выберите приход из списка чтобы посмотреть детали продуктов</p>
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
          <button
              class="btn btn-secondary"
              @click="closeDeleteModal"
              :disabled="isLoading.value"
          >
            Отмена
          </button>
          <button
              class="btn btn-danger"
              @click="confirmDelete"
              :disabled="isLoading.value"
          >
            <span v-if="isLoading.value" class="spinner-border spinner-border-sm me-2"></span>
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content card animate__animated animate__zoomIn" style="max-width: 500px;">
        <div class="card-header">
          <h5 class="mb-0">Создать новый приход</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="createOrder">
            <div class="mb-3">
              <label for="orderTitle" class="form-label">Название прихода</label>
              <input
                  v-model="newOrder.title"
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
                  v-model="newOrder.description"
                  class="form-control"
                  id="orderDescription"
                  rows="3"
                  placeholder="Введите описание прихода"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="orderDate" class="form-label">Дата прихода</label>
              <input
                  v-model="newOrder.date"
                  type="datetime-local"
                  class="form-control"
                  id="orderDate"
                  required
              >
            </div>
          </form>
        </div>
        <div class="card-footer d-flex gap-2 justify-content-end">
          <button
              class="btn btn-secondary"
              @click="closeCreateModal"
              :disabled="isLoading.value"
          >
            Отмена
          </button>
          <button
              class="btn btn-success"
              @click="createOrder"
              :disabled="isLoading.value || !newOrder.title"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Создать
          </button>
        </div>
      </div>
    </div>
    {{console.log(orders)}}
  </div>
</template>

<script setup lang="ts">
import { Plus, Trash2, X, Package, Edit } from 'lucide-vue-next'
import { useOrdersStore } from '~/composables/useStore'

const ordersStore = useOrdersStore()

const orders = computed(() => ordersStore.orders)
const isLoading = computed(() => ordersStore.isLoading)
const error = computed(() => ordersStore.error)

const selectedOrder = ref<any>(null)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const orderToDelete = ref<any>(null)
const isLoadingProducts = ref(false)

const newOrder = ref({
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 16)
})

onMounted(async () => {
  console.log('Компонент mounted, загружаем заказы...')
  await fetchOrders()
})

const fetchOrders = async () => {
  try {
    console.log('Начинаем загрузку заказов...')
    await ordersStore.fetchOrders()
    console.log('Заказы загружены, количество:', orders.value.length)
  } catch (err) {
    console.error('Ошибка при загрузке заказов:', err)
  }
}

const selectOrder = async (order: any) => {
  selectedOrder.value = order
  if (order.products && order.products.length === 0) {
    await loadOrderProducts(order._id)
  }
}

const loadOrderProducts = async (orderId: string) => {
  isLoadingProducts.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (err) {
    console.error('Ошибка при загрузке продуктов:', err)
  } finally {
    isLoadingProducts.value = false
  }
}

const openDeleteModal = (order: any) => {
  orderToDelete.value = order
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  orderToDelete.value = null
}

const confirmDelete = async () => {
  if (!orderToDelete.value) return

  try {
    await ordersStore.deleteOrder(orderToDelete.value._id)
    closeDeleteModal()

    if (selectedOrder.value?._id === orderToDelete.value._id) {
      selectedOrder.value = null
    }
  } catch (err) {
    console.error('Ошибка при удалении заказа:', err)
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
  newOrder.value = {
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createOrder = async () => {
  if (!newOrder.value.title.trim()) return

  try {
    const orderData = {
      title: newOrder.value.title,
      description: newOrder.value.description,
      date: newOrder.value.date
    }

    await ordersStore.createOrder(orderData)
    closeCreateModal()

    console.log('Заказ успешно создан!')
  } catch (err) {
    console.error('Ошибка при создании заказа:', err)
  }
}

const getProductsCount = (order: any) => {
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

const calculateTotal = (order: any) => {
  if (!order.products || order.products.length === 0) return '0 ₴ 0 $'

  const totalUAH = order.products.reduce((sum: number, product: any) => {
    const uahPrice = product.price.find((p: any) => p.symbol === 'UAH')
    return sum + (uahPrice?.value || 0)
  }, 0)

  const totalUSD = order.products.reduce((sum: number, product: any) => {
    const usdPrice = product.price.find((p: any) => p.symbol === 'USD')
    return sum + (usdPrice?.value || 0)
  }, 0)

  return `${totalUAH.toLocaleString('ru-RU')} ₴ ${totalUSD.toLocaleString('ru-RU')} $`
}

onUnmounted(() => {
  ordersStore.clearError()
})
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

.empty-state, .empty-products {
  color: #6c757d;
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

.spinner-border {
  width: 1rem;
  height: 1rem;
}

.empty-products {
  padding: 2rem;
}
</style>