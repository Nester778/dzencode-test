<template>
  <div class="order-details-sidebar animate__animated animate__fadeInRight">
    <div class="sidebar-header">
      <h3>Детали прихода</h3>
      <button class="btn-close" @click="$emit('close')">×</button>
    </div>

    <div class="sidebar-content">
      <div class="order-info">
        <h4 class="order-title">{{ order.title }}</h4>
        <p class="order-description">{{ order.description }}</p>

        <div class="order-meta">
          <div class="meta-item">
            <span class="meta-label">Продуктов:</span>
            <span class="meta-value">{{ getProductsCount() }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Дата создания:</span>
            <span class="meta-value">{{ formatDate(order.date) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Сумма:</span>
            <span class="meta-value total-amount">{{ calculateTotal() }} ₽</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Сумма USD:</span>
            <span class="meta-value">{{ calculateTotalUSD() }} $</span>
          </div>
        </div>
      </div>

      <div class="products-section">
        <h5>Продукты в приходе</h5>
        <div class="products-list">
          <div
              v-for="product in order.products"
              :key="product._id"
              class="product-item"
          >
            <div class="product-info">
              <span class="product-title">{{ product.title || 'Продукт' }}</span>
              <span class="product-price">{{ getProductPrice(product) }} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  _id: string
  title?: string
  price: Array<{ value: number; symbol: string; isDefault: boolean }>
}

interface Order {
  _id: string
  title: string
  date: string
  description: string
  products?: Product[]
}

interface Props {
  order: Order
}

interface Emits {
  (e: 'close'): void
  (e: 'order-deleted', orderId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getProductsCount = () => {
  return props.order.products?.length || 0
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleDateString('ru-RU', options)
}

const calculateTotal = () => {
  if (!props.order.products) return 0
  return props.order.products.reduce((total, product) => {
    const rubPrice = product.price.find(p => p.symbol === 'RUB')
    return total + (rubPrice?.value || 0)
  }, 0).toLocaleString('ru-RU')
}

const calculateTotalUSD = () => {
  if (!props.order.products) return 0
  return props.order.products.reduce((total, product) => {
    const usdPrice = product.price.find(p => p.symbol === 'USD')
    return total + (usdPrice?.value || 0)
  }, 0)
}

const getProductPrice = (product: Product) => {
  const rubPrice = product.price.find(p => p.symbol === 'RUB')
  return rubPrice?.value.toLocaleString('ru-RU') || '0'
}
</script>

<style scoped>
.order-details-sidebar {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f8f9fa;
  color: #dc3545;
}

.sidebar-content {
  padding: 20px;
}

.order-info {
  margin-bottom: 30px;
}

.order-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
}

.order-description {
  color: #6c757d;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.order-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.meta-label {
  color: #6c757d;
  font-weight: 500;
}

.meta-value {
  font-weight: 600;
  color: #333;
}

.total-amount {
  color: #28a745;
  font-size: 1.1em;
}

.products-section h5 {
  margin: 0 0 15px 0;
  font-weight: 600;
  color: #333;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  font-weight: 500;
  color: #333;
}

.product-price {
  font-weight: 600;
  color: #28a745;
}
</style>