<template>
  <div
      class="product-select-card card"
      :class="{ 'selected': selected }"
      @click="$emit('toggle')"
  >
    <div class="card-body">
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
        <div class="flex-grow-1">
          <div class="product-title fw-semibold">{{ product.title }}</div>
          <div class="product-type text-muted small">{{ product.type }}</div>
          <div class="price-info mt-1">
            <div
                v-for="price in product.price"
                :key="price.symbol"
                class="price-item small"
                :class="{ 'default-price': price.isDefault }"
            >
              {{ price.value }} {{ price.symbol }}
            </div>
          </div>
          <div class="product-meta mt-1">
            <small class="text-muted">
              Серийный номер: {{ product.serialNumber }}
            </small>
          </div>
          <div class="product-meta">
            <small class="text-muted">
              Гарантия: {{ formatDate(product.guarantee.start) }} - {{ formatDate(product.guarantee.end) }}
            </small>
          </div>
        </div>
        <div class="checkmark">
          <div v-if="selected" class="selected-indicator">
            <Check :size="20" class="text-success" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package, Check } from 'lucide-vue-next'

interface Props {
  product: any
  selected?: boolean
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.product-select-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: 0;
}

.product-select-card:hover {
  border-color: #28a745;
}

.product-select-card.selected {
  border-color: #28a745;
  background-color: #f8fff9;
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

.price-item {
  font-size: 0.8rem;
  margin-bottom: 1px;
}

.price-item.default-price {
  font-weight: 600;
  color: #28a745;
}

.product-meta {
  font-size: 0.75rem;
}

.checkmark {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>