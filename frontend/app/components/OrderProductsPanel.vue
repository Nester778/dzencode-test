<template>
  <div class="order-details-panel card h-100">
    <div class="card-header bg-white border-bottom">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ order.title }}</h5>
        <button
            class="btn btn-link text-muted p-0"
            @click="$emit('close')"
            :disabled="loading"
        >
          <X :size="20" />
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="products-section">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="section-title mb-0">Продукты в заказе</h6>
          <button
              class="btn btn-success btn-sm"
              @click="openAddProductsModal"
              :disabled="loading"
          >
            <Plus :size="14" class="me-1" />
            Добавить продукты
          </button>
        </div>

        <div v-if="isLoadingProducts" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-success" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-2 text-muted small">Загрузка продуктов...</p>
        </div>

        <div v-else-if="!order.products || order.products.length === 0"
             class="empty-products text-center py-4">
          <Package :size="48" class="text-muted mb-2" />
          <p class="text-muted">В этом заказе пока нет продуктов</p>
          <button class="btn btn-success mt-2" @click="openAddProductsModal">
            <Plus :size="16" class="me-2" />
            Добавить продукты
          </button>
        </div>

        <div v-else class="products-list">
          <ProductCard
              v-for="product in order.products"
              :key="product._id"
              :product="product"
              :disabled="loading"
              @delete="removeProduct"
          />
        </div>
      </div>

      <div class="order-summary mt-4 pt-3 border-top">
        <div class="row">
          <div class="col-6">
            <div class="summary-label">Общая сумма:</div>
          </div>
          <div class="col-6 text-end">
            <div class="summary-value fw-bold text-success">
              {{ calculateTotal(order) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddProductsModal
      :show="showAddProductsModal"
      :order="order"
      :loading="isLoadingAddProducts"
      @update:show="showAddProductsModal = $event"
      @add-products="handleAddProducts"
      @close="closeAddProductsModal"
  />
</template>

<script setup lang="ts">
import { X, Package, Plus } from 'lucide-vue-next'
import { useOrdersStore } from '~/composables/useStore'
import ProductCard from '~/components/ProductCard.vue'
import AddProductsModal from '~/components/modals/AddProductsModal.vue'

interface Props {
  order: any
  loading?: boolean
  isLoadingProducts?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'update:order', order: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const ordersStore = useOrdersStore()

const showAddProductsModal = ref(false)
const isLoadingAddProducts = ref(false)

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

const openAddProductsModal = () => {
  showAddProductsModal.value = true
}

const closeAddProductsModal = () => {
  showAddProductsModal.value = false
}

const removeProduct = async (productId: string) => {
  try {
    await ordersStore.removeProductFromOrder({
      orderId: props.order._id,
      productId
    })
    const updatedOrder = {
      ...props.order,
      products: props.order.products.filter((p: any) => p._id !== productId)
    }
    emit('update:order', updatedOrder)
  } catch (err) {
    console.error('Ошибка при удалении продукта:', err)
  }
}

const handleAddProducts = async (products: any[]) => {
  isLoadingAddProducts.value = true
  try {
    const addedProducts = await ordersStore.addProductsToOrder({
      orderId: props.order._id,
      products
    })

    const updatedOrder = {
      ...props.order,
      products: [...(props.order.products || []), ...addedProducts]
    }
    emit('update:order', updatedOrder)

    closeAddProductsModal()
  } catch (err) {
    console.error('Ошибка при добавлении продуктов:', err)
  } finally {
    isLoadingAddProducts.value = false
  }
}
</script>

<style scoped>
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

.empty-products {
  color: #6c757d;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

@media (max-width: 991.98px) {
  .order-details-panel {
    margin-top: 2rem;
    height: auto;
  }
}
</style>