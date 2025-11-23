import { Store } from 'vuex'

export interface AuthActionContext {
    commit: Commit
    dispatch: Dispatch
    state: AuthState
    getters: any
    rootState: any
    rootGetters: any
}

export interface Commit {
    (type: string, payload?: any): void
}

export interface Dispatch {
    (type: string, payload?: any): any
}