import { safeLocalStorage } from '~/utils/storage'

export default defineNuxtRouteMiddleware((to, from) => {
    if (process.client) {
        const token = safeLocalStorage.getItem('auth_token')
        const isAuthPage = to.path === '/auth/login' || to.path === '/auth/register'
        const isProtectedPage = !isAuthPage && to.path !== '/'

        if (!token && isProtectedPage) {
            return navigateTo('/auth/login')
        }

        if (token && isAuthPage) {
            return navigateTo('/orders')
        }
    }
})