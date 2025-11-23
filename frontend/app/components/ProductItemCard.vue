<template>
  <div class="product-card card" @click="handleClick">
    <div class="card-body p-0">
      <!-- Product Image -->
      <div class="product-image-container">
        <img
            :src="product.photo"
            :alt="product.title"
            class="product-image"
            @error="handleImageError"
        />
        <div class="product-status-badge">
          <span class="badge" :class="product.isNew ? 'bg-success' : 'bg-secondary'">
            {{ product.isNew ? 'Новый' : 'Б/У' }}
          </span>
        </div>
      </div>

      <div class="product-content p-4">
        <!-- Header -->
        <div class="product-header mb-3">
          <h5 class="product-title mb-2">{{ product.title }}</h5>
          <div class="product-type-badge">
            <span class="badge bg-light text-dark">
              <Package :size="12" class="me-1" />
              {{ product.type }}
            </span>
          </div>
        </div>

        <!-- Specification -->
        <div v-if="product.specification" class="specification-section mb-3">
          <div class="section-label small text-muted mb-2">Характеристики</div>
          <p class="specification-text small mb-0">{{ product.specification }}</p>
        </div>

        <!-- Guarantee -->
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

        <!-- Prices -->
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

        <!-- Meta Information -->
        <div class="meta-section">
          <div class="row g-2">
            <div class="col-12">
              <div class="meta-item">
                <span class="meta-label small text-muted">Приход:</span>
                <span class="meta-value">{{ orderTitle }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="meta-item">
                <span class="meta-label small text-muted">Серийный номер:</span>
                <span class="meta-value text-mono">{{ product.serialNumber }}</span>
              </div>
            </div>
            <div class="col-12">
              <div class="meta-item">
                <span class="meta-label small text-muted">Дата создания:</span>
                <span class="meta-value">{{ formatDateShort(product.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'

interface Price {
  value: number
  symbol: string
  isDefault: boolean
}

interface Guarantee {
  start: string
  end: string
  _id: string
}

interface Product {
  _id: string
  serialNumber: number
  isNew: boolean
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: string | any
  date: string
  createdAt: string
  updatedAt: string
}

interface Props {
  product: Product
  orderTitle: string
}

interface Emits {
  (e: 'edit', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const defaultImage = '/images/product-placeholder.jpg'

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultImage
}

const handleClick = () => {
  emit('edit', props.product)
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
</script>

<style scoped>
.product-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #28a745;
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.product-status-badge .badge {
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-content {
  background: white;
}

.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.product-type-badge .badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
}

.section-label {
  font-weight: 500;
  color: #6c757d;
}

.specification-text {
  color: #495057;
  line-height: 1.4;
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
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.price-item:hover {
  background: #e9ecef;
}

.price-item.default-price {
  background: #e8f5e8;
  border: 1px solid #28a745;
  position: relative;
}

.price-value {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
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
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f8f9fa;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  color: #6c757d;
}

.meta-value {
  font-weight: 500;
  color: #333;
  text-align: right;
}

.text-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .product-image-container {
    height: 160px;
  }

  .product-content {
    padding: 1rem !important;
  }

  .meta-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .meta-value {
    text-align: left;
  }
}
</style>