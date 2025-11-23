<template>
  <div
      class="order-card"
      :class="{ selected }"
      @click="handleSelect"
  >
    <div class="main-content">
      <h5 class="order-title" :title="order.title">
        {{ order.title }}
      </h5>

      <div class="order-row">
        <div class="order-block">
          <span class="value">{{ getProductsCount }}</span>
          <span class="label">Продукта</span>
        </div>

        <div class="order-block">
          <span class="value">{{ formatDateShort }}</span>
        </div>

        <div class="order-block amount">
          <span class="value">{{ calculateTotal }}</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button
          class="action-btn edit-btn"
          @click.stop="handleEdit"
          :disabled="disabled"
          title="Редактировать заказ"
      >
        <Edit :size="16" />
      </button>
      <button
          class="action-btn delete-btn"
          @click.stop="handleDelete"
          :disabled="disabled"
          title="Удалить заказ"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, Edit } from 'lucide-vue-next'

interface Props {
  order: any
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false
})

const emit = defineEmits<{
  select: [order: any]
  edit: [order: any]  // Добавляем emit для редактирования
  delete: [order: any]
}>()

const getProductsCount = computed(() => {
  return props.order.products?.length || 0
})

const formatDateShort = computed(() => {
  const date = new Date(props.order.date)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('ru-RU', { month: 'short' })
  const year = date.getFullYear()
  return `${day} / ${month} / ${year}`
})

const calculateTotal = computed(() => {
  const order = props.order
  if (!order.products?.length) return '0 ₴ / 0 $'

  const totalUAH = order.products.reduce((sum, p) => {
    const v = p.price.find((x:any) => x.symbol === 'UAH')?.value || 0
    return sum + v
  }, 0)

  const totalUSD = order.products.reduce((sum, p) => {
    const v = p.price.find((x:any) => x.symbol === 'USD')?.value || 0
    return sum + v
  }, 0)

  return `${totalUSD.toLocaleString('ru-RU')} $ / ${totalUAH.toLocaleString('ru-RU')} ₴`
})

const handleSelect = () => {
  if (!props.disabled) emit('select', props.order)
}

const handleEdit = () => {
  if (!props.disabled) {
    emit('edit', props.order)  // Эмитим событие редактирования
  }
}

const handleDelete = () => {
  if (!props.disabled) emit('delete', props.order)
}
</script>

<style scoped>
/* Стили остаются без изменений */
.order-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e6ed;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
}

.order-card:hover {
  background: #f8fafc;
  border-color: #d1d9e6;
}

.order-card.selected {
  border-color: #28a745;
  background: #f1fff3;
  box-shadow: 0 0 0 1px #28a745;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.order-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.order-row {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #8b97a3;
}

.order-block {
  display: flex;
  align-items: center;
  gap: 6px;
}

.value {
  color: #505c67;
  font-weight: 500;
}

.amount .value {
  color: #1c7c3b;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
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

.edit-btn {
  color: #6b7280;
}

.edit-btn:hover {
  color: #3b82f6;
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
  .order-card {
    flex-direction: column;
    gap: 8px;
  }

  .actions {
    align-self: flex-end;
  }

  .order-row {
    gap: 16px;
    flex-wrap: wrap;
  }
}
</style>