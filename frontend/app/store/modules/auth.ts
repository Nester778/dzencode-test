// store/modules/auth.ts
import type { User, LoginData, RegisterData, AuthResponse } from '~/types'
import { safeLocalStorage } from '~/utils/storage'
import type { AuthActionContext } from '~/types/vuex'

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
}

export const auth = {
    namespaced: true,

    state: (): AuthState => ({
        user: null,
        token: safeLocalStorage.getItem('auth_token'),
        isLoading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state: AuthState) => !!state.token,
        getUser: (state: AuthState) => state.user,
        isLoading: (state: AuthState) => state.isLoading,
        error: (state: AuthState) => state.error
    },

    mutations: {
        SET_USER(state: AuthState, user: User) {
            state.user = user
        },

        SET_TOKEN(state: AuthState, token: string) {
            state.token = token
            safeLocalStorage.setItem('auth_token', token)
        },

        SET_LOADING(state: AuthState, isLoading: boolean) {
            state.isLoading = isLoading
        },

        SET_ERROR(state: AuthState, error: string | null) {
            state.error = error
        },

        CLEAR_AUTH(state: AuthState) {
            state.user = null
            state.token = null
            state.error = null
            safeLocalStorage.removeItem('auth_token')
        }
    },

    actions: {
        async login({ commit, dispatch }: AuthActionContext, credentials: LoginData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const response = await $api.post<AuthResponse>('/auth/login', credentials)

                const { token, user } = response.data

                commit('SET_TOKEN', token)
                commit('SET_USER', user)

                if ($api.defaults.headers.common) {
                    $api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                }

                if (process.client) {
                    navigateTo('/orders')
                }

                return response.data
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при входе в систему'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async register({ commit }: AuthActionContext, userData: RegisterData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const { $api } = useNuxtApp()
                const response = await $api.post<AuthResponse>('/auth/register', userData)

                const { token, user } = response.data

                commit('SET_TOKEN', token)
                commit('SET_USER', user)

                if ($api.defaults.headers.common) {
                    $api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                }

                if (process.client) {
                    navigateTo('/orders')
                }

                return response.data
            } catch (error: any) {
                const message = error.response?.data?.message || 'Ошибка при регистрации'
                commit('SET_ERROR', message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async fetchUser({ commit, state, dispatch }: AuthActionContext) {
            if (!state.token) return

            try {
                const { $api } = useNuxtApp()
                const response = await $api.get<User>('/auth/me')

                const user = response.data
                commit('SET_USER', user)

                return user
            } catch (error) {
                console.error('Fetch user error:', error)
                dispatch('logout')
            }
        },

        logout({ commit }: AuthActionContext) {
            commit('CLEAR_AUTH')

            const { $api } = useNuxtApp()
            if ($api.defaults.headers.common) {
                delete $api.defaults.headers.common['Authorization']
            }

            if (process.client) {
                navigateTo('/auth/login')
            }
        },

        clearError({ commit }: AuthActionContext) {
            commit('SET_ERROR', null)
        },

        initialize({ dispatch }: AuthActionContext) {
            const token = safeLocalStorage.getItem('auth_token')
            if (token) {
                dispatch('fetchUser')
            }
        }
    }
}