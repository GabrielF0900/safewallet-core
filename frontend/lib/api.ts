import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// 1. Inicializa a instância limpa (Sem baseURL fixa para evitar congelamento no build)
export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Roteamento Dinâmico em Runtime + Injeção de Token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 🌍 GATILHO EM RUNTIME: Configura a URL base baseada no ambiente de execução do navegador
    if (typeof window !== 'undefined') {
      if (window.location.hostname !== 'localhost') {
        // 💡 CORREÇÃO: Força o uso do domínio absoluto da AWS para evitar caminhos relativos quebrados por subrotas
        config.baseURL = `${window.location.protocol}//${window.location.hostname}/api`;
      } else {
        // Se estiver rodando no seu computador, aponta para o Spring Boot local
        config.baseURL = 'http://localhost:8080/api';
      }
    }

    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Intercepta e trata a quebra de sessão (Erro 401)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 📋 Mapeamento de Tipos (Interfaces)
// ==========================================
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  name: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TransactionResponse {
  message: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  newBalance: number;
}

export interface BalanceResponse {
  balance: number;
  walletId: string;
}

export interface WalletResponse {
  balance: number;
  walletId: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  balanceAfter: number;
  description?: string;
  destinationWalletId?: string;
  sourceWalletId?: string;
  createdAt: string;
}

// ==========================================
// 🚀 Chamadas Diretas Legadas (Garante caminhos limpos)
// ==========================================
export const authApi = {
  register: (data: RegisterRequest) => api.post<User>('/auth/register', data),
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
};

export const transactionsApi = {
  deposit: (amount: number) => api.post<TransactionResponse>('/transactions/deposit', { amount }),
  withdraw: (amount: number) => api.post<TransactionResponse>('/transactions/withdraw', { amount }),
  transfer: (destinationWalletId: string, amount: number) => 
    api.post<TransactionResponse>('/transactions/transfer', { destinationWalletId, amount }),
  getBalance: () => api.get<BalanceResponse>('/transactions/balance'),
  getWallet: () => api.get<WalletResponse>('/transactions/my-wallet'),
  getTransactions: () => api.get<Transaction[]>('/transactions/history'),
};