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

            <OrderCard
                v-for="order in orders.value"
                :key="order._id"
                :order="order"
                :selected="selectedOrder?._id === order._id"
                @select="selectOrder"
                @edit="openEditModal"
                @delete="openDeleteModal"
                :disabled="isLoading.value"
            />
          </div>
        </div>

        <div v-if="selectedOrder" class="col-12 col-lg-7">
          <OrderProductsPanel
              :order="selectedOrder"
              :loading="isLoading.value"
              :isLoadingProducts="isLoadingProducts"
              @close="selectedOrder = null"
              @update:order="handleOrderUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Модальные окна -->
    <DeleteOrderModal
        :show="showDeleteModal"
        :order="orderToDelete"
        :loading="isLoading.value"
        @update:show="showDeleteModal = $event"
        @confirm="confirmDelete"
        @close="closeDeleteModal"
    />

    <CreateOrderModal
        :show="showCreateModal"
        :loading="isLoading.value"
        @update:show="showCreateModal = $event"
        @create="createOrder"
        @close="closeCreateModal"
    />

    <EditOrderModal
        :show="showEditModal"
        :order="orderToEdit"
        :loading="isLoadingEdit"
        @update:show="showEditModal = $event"
        @update="handleUpdateOrder"
        @close="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus, X, Package, Edit } from 'lucide-vue-next'
import { useOrdersStore } from '~/composables/useStore'
import OrderCard from '~/components/OrderCard.vue'
import DeleteOrderModal from '~/components/modals/DeleteOrderModal.vue'
import CreateOrderModal from '~/components/modals/CreateOrderModal.vue'
import EditOrderModal from '~/components/modals/EditOrderModal.vue'
import OrderProductsPanel from '~/components/OrderProductsPanel.vue'

const ordersStore = useOrdersStore()

const orders = computed(() => ordersStore.orders)
const isLoading = computed(() => ordersStore.isLoading)
const error = computed(() => ordersStore.error)

const selectedOrder = ref<any>(null)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const orderToDelete = ref<any>(null)
const orderToEdit = ref<any>(null)
const isLoadingProducts = ref(false)
const isLoadingEdit = ref(false)

onMounted(async () => {
  await fetchOrders()
})

const fetchOrders = async () => {
  try {
    await ordersStore.fetchOrders()
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

const openEditModal = (order: any) => {
  orderToEdit.value = order
  showEditModal.value = true
}

const openDeleteModal = (order: any) => {
  orderToDelete.value = order
  showDeleteModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  orderToEdit.value = null
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

const handleOrderUpdate = (updatedOrder: any) => {
  selectedOrder.value = updatedOrder
}

const handleUpdateOrder = async (orderData: any) => {
  isLoadingEdit.value = true
  try {
    await ordersStore.updateOrder(orderData)
    closeEditModal()
  } catch (err) {
    console.error('Ошибка при обновлении заказа:', err)
  } finally {
    isLoadingEdit.value = false
  }
}

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const createOrder = async (orderData: any) => {
  try {
    await ordersStore.createOrder(orderData)
    closeCreateModal()
  } catch (err) {
    console.error('Ошибка при создании заказа:', err)
  }
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
/* Стили остаются такими же */
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