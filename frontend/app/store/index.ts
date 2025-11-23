import { createStore } from 'vuex'
import { auth } from './modules/auth'
import { orders } from './modules/orders'
import { products } from './modules/products'
import { websocket } from './modules/websocket'

export const store = createStore({
    modules: {
        auth,
        orders,
        products,
        websocket
    }
})

export type RootState = ReturnType<typeof store.state>;