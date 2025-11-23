import { io, type Socket } from 'socket.io-client'

declare module '#app' {
    interface NuxtApp {
        $socket: Socket
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const socket = io(config.public.wsUrl, {
        autoConnect: false,
        transports: ['websocket', 'polling']
    })

    const updateStore = (action: string, payload?: any) => {
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

    socket.on('connect', () => {
        updateStore('websocket/setConnectionStatus', true)
    })

    socket.on('disconnect', () => {
        updateStore('websocket/setConnectionStatus', false)
    })

    socket.on('activeSessions', (count: number) => {
        updateStore('websocket/updateActiveSessions', count)
    })

    if (process.client) {
        const nuxtApp = useNuxtApp()

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