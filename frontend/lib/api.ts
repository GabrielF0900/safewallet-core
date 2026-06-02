import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export interface AuthResponse {
  message: string
  token: string
  name: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TransactionResponse {
  message: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  amount: number
  newBalance: number
}

export interface BalanceResponse {
  balance: number
  walletId: string
}

export interface WalletResponse {
  balance: number
  walletId: string
  createdAt?: string
}

export interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  amount: number
  balanceAfter: number
  description?: string
  destinationWalletId?: string
  sourceWalletId?: string
  createdAt: string
}

// Auth API
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<User>('/auth/register', data),
  
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),
}

// Transactions API
export const transactionsApi = {
  deposit: (amount: number) =>
    api.post<TransactionResponse>('/transactions/deposit', { amount }),
  
  withdraw: (amount: number) =>
    api.post<TransactionResponse>('/transactions/withdraw', { amount }),
  
  transfer: (destinationWalletId: string, amount: number) =>
    api.post<TransactionResponse>('/transactions/transfer', { destinationWalletId, amount }),
  
  getBalance: () =>
    api.get<BalanceResponse>('/transactions/balance'),
  
  getWallet: () =>
    api.get<WalletResponse>('/transactions/my-wallet'),
  
  getTransactions: () =>
    api.get<Transaction[]>('/transactions/history'),
}
