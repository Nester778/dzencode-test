import { io, type Socket } from 'socket.io-client'

declare module '#app' {
    interface NuxtApp {
        $socket: Socket
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Создаем socket но не подключаем сразу
    const socket = io(config.public.wsUrl, {
        autoConnect: false, // Не подключаться автоматически
        transports: ['websocket', 'polling']
    })

    // Функция для безопасного обновления store
    const updateStore = (action: string, payload?: any) => {
        // Проверяем что store доступен
        if (process.client && typeof window !== 'undefined') {
            try {
                const store = useStore()
                if (store && store.dispatch) {
                    store.dispatch(action, payload)
                }
            } catch (error) {
                console.warn('Store not available for WebSocket update:', error)
            }
        }
    }

    // Обработчики событий
    socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server')
        updateStore('websocket/setConnectionStatus', true)
    })

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server')
        updateStore('websocket/setConnectionStatus', false)
    })

    socket.on('activeSessions', (count: number) => {
        updateStore('websocket/updateActiveSessions', count)
    })

    // Подключаем socket только на клиенте и после инициализации приложения
    if (process.client) {
        // Ждем пока приложение будет готово
        const nuxtApp = useNuxtApp()

        // Подключаем socket после инициализации store
        setTimeout(() => {
            socket.connect()
        }, 100)
    }

    return {
        provide: {
            socket
        }
    }
})