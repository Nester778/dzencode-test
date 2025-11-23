import axios, { type AxiosInstance } from 'axios'
import { safeLocalStorage } from '~/utils/storage'

declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiBase,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    // Request interceptor
    api.interceptors.request.use(
        (config) => {
            // Проверяем что мы на клиенте перед использованием localStorage
            if (process.client) {
                const token = safeLocalStorage.getItem('auth_token')
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Response interceptor
    api.interceptors.response.use(
        (response) => response.data,
        (error) => {
            if (error.response?.status === 401 && process.client) {
                console.log('401 error - clearing auth token')
                // Очищаем невалидный токен
                safeLocalStorage.removeItem('auth_token')

                // Редирект на страницу логина
                if (window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login'
                }
            }
            return Promise.reject(error)
        }
    )

    return {
        provide: {
            api
        }
    }
})