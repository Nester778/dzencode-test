<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content animate__animated animate__zoomIn" style="max-width: 800px;">
      <div class="modal-header">
        <h5 class="modal-title">Добавить продукты в заказ</h5>
      </div>
      <div class="modal-body">
        <div v-if="isLoadingProducts" class="text-center py-4">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-2 text-muted">Загрузка продуктов...</p>
        </div>

        <div v-else-if="loadError" class="text-center py-4">
          <div class="alert alert-danger">
            <p>Ошибка при загрузке продуктов</p>
            <button class="btn btn-outline-danger btn-sm" @click="loadProducts">
              Попробовать снова
            </button>
          </div>
        </div>

        <div v-else>
          <div class="search-section mb-3">
            <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Поиск по названию, типу или серийному номеру..."
            >
          </div>

          <div class="products-list">
            <ProductSelectCard
                v-for="product in filteredProducts"
                :key="product._id"
                :product="product"
                :selected="selectedProducts.includes(product._id)"
                @toggle="toggleProduct(product._id)"
            />
          </div>

          <div v-if="filteredProducts.length === 0 && !isLoadingProducts" class="text-center py-4">
            <Package :size="48" class="text-muted mb-2" />
            <p class="text-muted">Продукты не найдены</p>
            <button v-if="searchQuery" class="btn btn-outline-secondary btn-sm" @click="searchQuery = ''">
              Очистить поиск
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="selected-count me-auto">
          Выбрано: {{ selectedProducts.length }}
        </div>
        <button
            class="btn btn-secondary"
            @click="close"
            :disabled="loading"
        >
          Отмена
        </button>
        <button
            class="btn btn-success"
            @click="addProducts"
            :disabled="loading || selectedProducts.length === 0"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Добавить выбранные
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'
import { useProductsStore } from '~/composables/useStore'
import ProductSelectCard from '~/components/ProductSelectCard.vue'

const productsStore = useProductsStore()

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

const searchQuery = ref('')
const selectedProducts = ref<string[]>([])
const isLoadingProducts = ref(false)
const loadError = ref(false)

// Используем computed для получения продуктов из стора
const availableProducts = computed(() => {
  return productsStore.products || []
})

// Загружаем продукты при открытии модального окна
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await loadProducts()
    selectedProducts.value = []
    searchQuery.value = ''
  }
})

const loadProducts = async () => {
  isLoadingProducts.value = true
  loadError.value = false
  try {
    console.log('Загрузка продуктов...')
    await productsStore.fetchProducts()
    console.log('Продукты загружены:', availableProducts.value)
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error)
    loadError.value = true
  } finally {
    isLoadingProducts.value = false
  }
}

const filteredProducts = computed(() => {
  const products = availableProducts.value

  if (!products.length) return []

  if (!searchQuery.value.trim()) return products

  const query = searchQuery.value.toLowerCase().trim()
  return products.filter(product => {
    return (
        product.title?.toLowerCase().includes(query) ||
        product.type?.toLowerCase().includes(query) ||
        product.serialNumber?.toString().includes(query)
    )
  })
})

const toggleProduct = (productId: string) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const close = () => {
  emit('update:show', false)
  emit('close')
}

const addProducts = () => {
  const selectedProductsData = availableProducts.value.filter(product =>
      selectedProducts.value.includes(product._id)
  )

  console.log('Добавляем продукты:', selectedProductsData)
  emit('add-products', selectedProductsData)
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

.products-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selected-count {
  font-weight: 500;
  color: #28a745;
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