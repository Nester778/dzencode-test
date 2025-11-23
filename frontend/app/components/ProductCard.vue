<template>
  <div class="product-card card">
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
          <div class="action-container">
            <button
                class="action-btn delete-btn"
                @click="openDeleteModal"
                :disabled="disabled"
                title="Удалить продукт"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Модальное окно удаления продукта -->
  <DeleteProductModal
      :show="showDeleteModal"
      :product="productToDelete"
      :loading="isLoadingDelete"
      @update:show="showDeleteModal = $event"
      @confirm="handleDeleteProduct"
      @close="closeDeleteModal"
  />
</template>

<script setup lang="ts">
import { Package, Trash2 } from 'lucide-vue-next'
import DeleteProductModal from '~/components/modals/DeleteProductModal.vue'

interface Props {
  product: any
  disabled?: boolean
}

interface Emits {
  (e: 'delete', productId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDeleteModal = ref(false)
const productToDelete = ref<any>(null)
const isLoadingDelete = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const openDeleteModal = () => {
  productToDelete.value = props.product
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}

const handleDeleteProduct = () => {
  emit('delete', props.product._id)
  closeDeleteModal()
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.product-card:hover {
  border-color: #d1d9e6;
  background: #f8fafc;
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

.action-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.action-btn {
  border: none;
  background: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  opacity: 1;
  background: #f1f5f9;
}

.delete-btn {
  color: #6b7280;
}

.delete-btn:hover {
  color: #ef4444;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-card .card-body {
    padding: 1rem;
  }

  .product-card .row > div {
    margin-bottom: 0.5rem;
  }

  .product-card .row > div:last-child {
    margin-bottom: 0;
    text-align: left !important;
  }

  .action-container {
    justify-content: flex-start;
  }
}
</style>