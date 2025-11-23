export interface User {
    id: string
    name: string
    email: string
}

export interface Price {
    value: number
    symbol: 'USD' | 'UAH' | 'EUR'
    isDefault: boolean
}

export interface Guarantee {
    start: string
    end: string
}

export interface Product {
    _id: string
    serialNumber: number
    isNew: boolean
    photo?: string
    title: string
    type: 'Monitors' | 'Phones' | 'Tablets' | 'Laptops'
    specification: string
    guarantee: Guarantee
    price: Price[]
    order: string | Order
    date: string
    createdAt?: string
    updatedAt?: string
}

export interface Order {
    _id: string
    title: string
    date: string
    description: string
    user: string | User
    products?: Product[]
    createdAt?: string
    updatedAt?: string
}

export interface LoginData {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface ApiResponse<T = any> {
    data: T
    status: number
    message?: string
}

export interface ApiError {
    message: string
    status?: number
}