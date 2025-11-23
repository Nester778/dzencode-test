// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css',
        'bootstrap/dist/css/bootstrap.min.css'],
    modules: [
        '@nuxtjs/i18n'
    ],
    i18n: {
        locales: ['en', 'ru'],
        defaultLocale: 'en',
        vueI18n: './i18n.config.ts'
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.API_BASE || 'http://localhost:5000/api',
            wsUrl: process.env.WS_URL || 'http://localhost:5000'
        }
    },
    plugins: [
        '~/plugins/vuex.ts',
        '~/plugins/api.ts',
        '~/plugins/socket.io.ts'
    ],
    devtools: { enabled: true },
})
