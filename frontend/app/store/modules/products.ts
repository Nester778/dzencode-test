// store/products.ts
import type { Product } from '~/types'

interface ProductsState {
    products: Product[]
    filteredProducts: Product[]
    selectedType: string
    isLoading: boolean
    error: string | null
}

export const products = {
    namespaced: true,

    state: (): ProductsState => ({
        products: [],
        filteredProducts: [],
        selectedType: 'all',
        isLoading: false,
        error: null
    }),

    getters: {
        allProducts: (state: ProductsState) => state.products,
        displayedProducts: (state: ProductsState) => state.filteredProducts,
        selectedType: (state: ProductsState) => state.selectedType,
        isLoading: (state: ProductsState) => state.isLoading,
        error: (state: ProductsState) => state.error,
        productTypes: (state: ProductsState) => {
            const types = new Set(state.products.map(p => p.type))
            return Array.from(types)
        }
    },

    mutations: {
        SET_PRODUCTS(state: ProductsState, products: Product[]) {
            state.products = products
            if (state.selectedType === 'all') {
                state.filteredProducts = products
            } else {
                state.filteredProducts = products.filter(p => p.type === state.selectedType)
            }
        },

        FILTER_PRODUCTS_BY_TYPE(state: ProductsState, type: string) {
            state.selectedType = type
            if (type === 'all') {
                state.filteredProducts = state.products
            } else {
                state.filteredProducts = state.products.filter(p => p.type === type)
            }
        },

        SET_LOADING(state: ProductsState, isLoading: boolean) {
            state.isLoading = isLoading
        },

        SET_ERROR(state: ProductsState, error: string | null) {
            state.error = error
        },

        ADD_PRODUCT(state: ProductsState, product: Product) {
            state.products.unshift(product)
            if (state.selectedType === 'all' || product.type === state.selectedType) {
                state.filteredProducts.unshift(product)
            }
        },

        UPDATE_PRODUCT(state: ProductsState, updatedProduct: Product) {
            const index = state.products.findIndex(p => p._id === updatedProduct._id)
            if (index !== -1) {
                state.products.splice(index, 1, updatedProduct)

                const filteredIndex = state.filteredProducts.findIndex(p => p._id === updatedProduct._id)
                if (filteredIndex !== -1) {
                    if (state.selectedType === 'all' || updatedProduct.type === state.selectedType) {
                        state.filteredProducts.splice(filteredIndex, 1, updatedProduct)
                    } else {
                        state.filteredProducts.splice(filteredIndex, 1)
                    }
                } else if (state.selectedType === 'all' || updatedProduct.type === state.selectedType) {
                    state.filteredProducts.unshift(updatedProduct)
                }
            }
        },

        REMOVE_PRODUCT(state: ProductsState, productId: string) {
            state.products = state.products.filter(p => p._id !== productId)
            state.filteredProducts = state.filteredProducts.filter(p => p._id !== productId)
        }
    },

    actions: {
        async fetchProducts({ commit, state }: any, type?: string) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const params = type && type !== 'all' ? { type } : {}
                const products = await $api.get<Product[]>('/products', { params })

                commit('SET_PRODUCTS', products)

                if (type && type !== state.selectedType) {
                    commit('FILTER_PRODUCTS_BY_TYPE', type)
                }

                return products
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при загрузке продуктов'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchProductById({ commit }: any, productId: string) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const product = await $api.get<Product>(`/products/${productId}`)
                return product
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при загрузке продукта'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async createProduct({ commit }: any, productData: Partial<Product>) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const product = await $api.post<Product>('/products', productData)
                commit('ADD_PRODUCT', product)
                return product
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при создании продукта'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async deleteProduct({ commit }: any, productId: string) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                await $api.delete(`/products/${productId}`)
                commit('REMOVE_PRODUCT', productId)
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при удалении продукта'
                commit('SET_ERROR', message)
                throw error
            }
        },

        async updateProduct({ commit }: any, productData: any) {
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const updatedProduct = await $api.put<Product>(`/products/${productData._id}`, productData)
                commit('UPDATE_PRODUCT', updatedProduct)
                return updatedProduct
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при обновлении продукта'
                commit('SET_ERROR', message)
                throw error
            }
        },

        filterByType({ commit }: any, type: string) {
            commit('FILTER_PRODUCTS_BY_TYPE', type)
        },

        clearError({ commit }: any) {
            commit('SET_ERROR', null)
        }
    }
}