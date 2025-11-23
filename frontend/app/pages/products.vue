<template>
  <div class="products-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Продукты / {{ filteredProducts.length }}</h1>
      <div class="d-flex align-items-center gap-3">
        <div class="filter-container">
          <select
              v-model="selectedType"
              class="form-select"
              style="min-width: 200px;"
              @change="handleTypeFilterChange"
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
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка продуктов...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state text-center py-5">
      <AlertCircle :size="64" class="text-danger mb-3" />
      <h5>Ошибка при загрузке</h5>
      <p class="text-muted">{{ error }}</p>
      <button class="btn btn-primary mt-2" @click="loadProducts">
        Попробовать снова
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-container">
      <div class="products-grid">
        <ProductItemCard
            v-for="product in filteredProducts"
            :key="product._id"
            :product="product"
            :order-title="getOrderTitle(product.order)"
            @edit="openEditModal"
        />
      </div>

      <div v-if="filteredProducts.length === 0 && !isLoading" class="empty-state text-center py-5">
        <Package :size="64" class="text-muted mb-3" />
        <h5>Продукты не найдены</h5>
        <p class="text-muted">Попробуйте изменить фильтр</p>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <EditProductModal
        :show="showEditModal"
        :product="productToEdit"
        :loading="isLoadingEdit"
        @update:show="showEditModal = $event"
        @update="handleUpdateProduct"
        @close="closeEditModal"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, Package } from 'lucide-vue-next'
import ProductItemCard from '~/components/ProductItemCard.vue'
import EditProductModal from '~/components/modals/EditProductModal.vue'

// Store
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

// Refs
const selectedType = ref('all')
const showEditModal = ref(false)
const productToEdit = ref<any>(null)
const isLoadingEdit = ref(false)

// Computed
const products = computed(() => productsStore.products.value)
const filteredProducts = computed(() => productsStore.filteredProducts.value)
const isLoading = computed(() => productsStore.isLoading.value)
const error = computed(() => productsStore.error.value)
const productTypes = computed(() => productsStore.productTypes.value)

// Methods
const loadProducts = async () => {
  try {
    await productsStore.fetchProducts(selectedType.value)
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

const loadOrders = async () => {
  try {
    await ordersStore.fetchOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
  }
}

const handleTypeFilterChange = () => {
  productsStore.filterByType(selectedType.value)
}

const getOrderTitle = (order: any) => {
  if (typeof order === 'object' && order.title) {
    return order.title
  }

  const orderObj = ordersStore.orders.value.find(o => o._id === order)
  return orderObj?.title || 'Неизвестный приход'
}

const openEditModal = (product: any) => {
  productToEdit.value = product
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  productToEdit.value = null
}

const handleUpdateProduct = async (productData: any) => {
  isLoadingEdit.value = true
  try {
    await productsStore.updateProduct(productData)
    closeEditModal()
  } catch (err) {
    console.error('Ошибка при обновлении продукта:', err)
  } finally {
    isLoadingEdit.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([loadProducts(), loadOrders()])
})
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

.filter-container .form-select {
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.products-container {
  min-height: 60vh;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  color: #6c757d;
  grid-column: 1 / -1;
}

.loading-state,
.error-state {
  grid-column: 1 / -1;
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