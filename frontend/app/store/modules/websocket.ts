interface WebSocketState {
    activeSessions: number
    isConnected: boolean
}

export const websocket = {
    namespaced: true,

    state: (): WebSocketState => ({
        activeSessions: 0,
        isConnected: false
    }),

    getters: {
        activeSessions: (state: WebSocketState) => state.activeSessions,
        isConnected: (state: WebSocketState) => state.isConnected
    },

    mutations: {
        SET_ACTIVE_SESSIONS(state: WebSocketState, count: number) {
            state.activeSessions = count
        },

        SET_CONNECTION_STATUS(state: WebSocketState, status: boolean) {
            state.isConnected = status
        }
    },

    actions: {
        updateActiveSessions({ commit }: any, count: number) {
            commit('SET_ACTIVE_SESSIONS', count)
        },

        setConnectionStatus({ commit }: any, status: boolean) {
            commit('SET_CONNECTION_STATUS', status)
        }
    }
}