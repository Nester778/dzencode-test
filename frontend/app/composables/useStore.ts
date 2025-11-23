export const useStore = () => {
    try {
        const nuxtApp = useNuxtApp()
        return nuxtApp.$store
    } catch (error) {
        console.warn('Store not available:', error)
        return null
    }
}

export const useOrdersStore = () => {
    const store = useStore()

    const fallbackState = {
        orders: [],
        isLoading: false,
        error: null,
        selectedOrder: null
    }

    return {
        orders: computed(() => store?.state?.orders?.orders || fallbackState.orders),
        isLoading: computed(() => store?.state?.orders?.isLoading || fallbackState.isLoading),
        error: computed(() => store?.state?.orders?.error || fallbackState.error),
        selectedOrder: computed(() => store?.state?.orders?.selectedOrder || fallbackState.selectedOrder),

        fetchOrders: () => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve([])
            }
            return store.dispatch('orders/fetchOrders')
        },
        fetchOrderById: (id: string) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('orders/fetchOrderById', id)
        },
        createOrder: (orderData: any) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('orders/createOrder', orderData)
        },
        updateOrder: (orderData: { _id: string; title: string; description: string; date: string }) =>
            store.dispatch('orders/updateOrder', orderData),
        deleteOrder: (id: string) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve()
            }
            return store.dispatch('orders/deleteOrder', id)
        },
        selectOrder: (order: any) => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('orders/selectOrder', order)
        },
        clearSelectedOrder: () => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('orders/clearSelectedOrder')
        },
        clearError: () => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('orders/clearError')
        },
        addProductsToOrder: (data: { orderId: string; products: any[] }) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve([])
            }
            return store.dispatch('orders/addProductsToOrder', data)
        },
        removeProductFromOrder: (data: { orderId: string; productId: string }) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve()
            }
            return store.dispatch('orders/removeProductFromOrder', data)
        }
    }
}
export const useAuthStore = () => {
    const store = useStore()

    const fallbackState = {
        user: null,
        token: null,
        isLoading: false,
        error: null
    }

    return {
        user: computed(() => store?.state?.auth?.user || fallbackState.user),
        token: computed(() => store?.state?.auth?.token || fallbackState.token),
        isLoading: computed(() => store?.state?.auth?.isLoading || fallbackState.isLoading),
        error: computed(() => store?.state?.auth?.error || fallbackState.error),
        isAuthenticated: computed(() => store?.getters?.['auth/isAuthenticated'] || false),

        login: (credentials: any) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('auth/login', credentials)
        },
        register: (userData: any) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('auth/register', userData)
        },
        logout: () => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve()
            }
            return store.dispatch('auth/logout')
        },
        fetchUser: () => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('auth/fetchUser')
        },
        clearError: () => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('auth/clearError')
        },
        initialize: () => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve()
            }
            return store.dispatch('auth/initialize')
        }
    }
}

export const useProductsStore = () => {
    const store = useStore()

    const fallbackState = {
        products: [],
        filteredProducts: [],
        selectedType: 'all',
        isLoading: false,
        error: null
    }

    return {
        products: computed(() => store?.state?.products?.products || fallbackState.products),
        filteredProducts: computed(() => store?.state?.products?.filteredProducts || fallbackState.filteredProducts),
        selectedType: computed(() => store?.state?.products?.selectedType || fallbackState.selectedType),
        isLoading: computed(() => store?.state?.products?.isLoading || fallbackState.isLoading),
        error: computed(() => store?.state?.products?.error || fallbackState.error),
        productTypes: computed(() => store?.getters?.['products/productTypes'] || ['all']),

        fetchProducts: (type?: string) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve([])
            }
            return store.dispatch('products/fetchProducts', type)
        },
        fetchProductById: (id: string) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('products/fetchProductById', id)
        },
        createProduct: (productData: any) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('products/createProduct', productData)
        },
        deleteProduct: (id: string) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve()
            }
            return store.dispatch('products/deleteProduct', id)
        },
        updateProduct: (productData: any) => {
            if (!store) {
                console.warn('Store not available')
                return Promise.resolve(null)
            }
            return store.dispatch('products/updateProduct', productData)
        },
        filterByType: (type: string) => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('products/filterByType', type)
        },
        clearError: () => {
            if (!store) {
                console.warn('Store not available')
                return
            }
            store.dispatch('products/clearError')
        }
    }
}

export const useWebSocketStore = () => {
    const store = useStore()

    const fallbackState = {
        activeSessions: 0,
        isConnected: false
    }

    return {
        activeSessions: computed(() => store?.state?.websocket?.activeSessions || fallbackState.activeSessions),
        isConnected: computed(() => store?.state?.websocket?.isConnected || fallbackState.isConnected)
    }
}