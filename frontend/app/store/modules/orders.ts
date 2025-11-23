import type { Order } from '~/types'

interface OrdersState {
    orders: Order[]
    selectedOrder: Order | null
    isLoading: boolean
    error: string | null
}

export const orders = {
    namespaced: true,

    state: (): OrdersState => ({
        orders: [],
        selectedOrder: null,
        isLoading: false,
        error: null
    }),

    getters: {
        allOrders: (state: OrdersState) => state.orders,
        selectedOrder: (state: OrdersState) => state.selectedOrder,
        isLoading: (state: OrdersState) => state.isLoading,
        error: (state: OrdersState) => state.error,
        ordersCount: (state: OrdersState) => state.orders.length
    },

    mutations: {
        SET_ORDERS(state: OrdersState, orders: Order[]) {
            state.orders = orders
        },

        SET_SELECTED_ORDER(state: OrdersState, order: Order) {
            state.selectedOrder = order
        },

        CLEAR_SELECTED_ORDER(state: OrdersState) {
            state.selectedOrder = null
        },

        ADD_ORDER(state: OrdersState, order: Order) {
            state.orders.unshift(order)
        },

        UPDATE_ORDER(state: OrdersState, updatedOrder: Order) {
            const index = state.orders.findIndex(o => o._id === updatedOrder._id)
            if (index !== -1) {
                state.orders.splice(index, 1, updatedOrder)
                if (state.selectedOrder?._id === updatedOrder._id) {
                    state.selectedOrder = updatedOrder
                }
            }
        },

        REMOVE_ORDER(state: OrdersState, orderId: string) {
            state.orders = state.orders.filter(o => o._id !== orderId)
            if (state.selectedOrder?._id === orderId) {
                state.selectedOrder = null
            }
        },

        SET_LOADING(state: OrdersState, isLoading: boolean) {
            state.isLoading = isLoading
        },

        SET_ERROR(state: OrdersState, error: string | null) {
            state.error = error
        }
    },

    actions: {
        async fetchOrders({ commit }: any) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const orders = await $api.get<Order[]>('/orders')
                commit('SET_ORDERS', orders)
                return orders
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при загрузке заказов'
                console.error('Ошибка загрузки:', message)
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchOrderById({ commit }: any, orderId: string) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const order = await $api.get<Order>(`/orders/${orderId}`)
                commit('SET_SELECTED_ORDER', order)
                return order
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при загрузке заказа'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async createOrder({ commit }: any, orderData: Partial<Order>) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const order = await $api.post<Order>('/orders', orderData)
                commit('ADD_ORDER', order)
                return order
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при создании заказа'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async deleteOrder({ commit }: any, orderId: string) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                await $api.delete(`/orders/${orderId}`)
                commit('REMOVE_ORDER', orderId)
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при удалении заказа'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async updateOrder({ commit }: any, orderData: { _id: string; title: string; description: string; date: string }) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const updatedOrder = await $api.put<Order>(`/orders/${orderData._id}`, orderData)
                commit('UPDATE_ORDER', updatedOrder)
                return updatedOrder
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при обновлении заказа'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async addProductsToOrder({ commit, state }: any, { orderId, products }: { orderId: string; products: any[] }) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()

                const addedProducts = []
                for (const product of products) {
                    const productData = {
                        ...product,
                        order: orderId
                    }
                    const addedProduct = await $api.post('/products', productData)
                    addedProducts.push(addedProduct)
                }

                const order = state.orders.find((o: Order) => o._id === orderId)
                if (order) {
                    const updatedOrder = {
                        ...order,
                        products: [...(order.products || []), ...addedProducts]
                    }
                    commit('UPDATE_ORDER', updatedOrder)

                    if (state.selectedOrder?._id === orderId) {
                        commit('SET_SELECTED_ORDER', updatedOrder)
                    }
                }

                return addedProducts
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при добавлении продуктов в заказ'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async removeProductFromOrder({ commit, state }: any, { orderId, productId }: { orderId: string; productId: string }) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                await $api.delete(`/products/${productId}`)

                const order = state.orders.find((o: Order) => o._id === orderId)
                if (order) {
                    const updatedOrder = {
                        ...order,
                        products: (order.products || []).filter((p: any) => p._id !== productId)
                    }
                    commit('UPDATE_ORDER', updatedOrder)

                    if (state.selectedOrder?._id === orderId) {
                        commit('SET_SELECTED_ORDER', updatedOrder)
                    }
                }
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при удалении продукта из заказа'
                commit('SET_ERROR', message)
                throw error
            }
        },

        selectOrder({ commit }: any, order: Order) {
            commit('SET_SELECTED_ORDER', order)
        },

        clearSelectedOrder({ commit }: any) {
            commit('CLEAR_SELECTED_ORDER')
        },

        clearError({ commit }: any) {
            commit('SET_ERROR', null)
        }
    }
}