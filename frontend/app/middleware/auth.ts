export default defineNuxtRouteMiddleware((to, from) => {
    const token = localStorage.getItem('auth_token')

    if (!token && to.path !== '/auth/login') {
        return navigateTo('/auth/login')
    }

    if (token && to.path === '/auth/login') {
        return navigateTo('/orders')
    }
})