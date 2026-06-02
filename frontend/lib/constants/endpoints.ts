/**
 * 🔗 API Endpoints Configuration
 *
 * Centraliza todos os endpoints do SafeWallet Core API
 * Seguindo SOLID - Open/Closed Principle
 * Facilita manutenção e reutilização de rotas
 */

// ========================================
// 🔐 Autenticação
// ========================================
export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  VERIFY: "/auth/verify",
} as const;

// ========================================
// 💰 Transações
// ========================================
export const TRANSACTION_ENDPOINTS = {
  DEPOSIT: "/transactions/deposit",
  WITHDRAW: "/transactions/withdraw",
  TRANSFER: "/transactions/transfer",
  BALANCE: "/transactions/balance",
  MY_WALLET: "/transactions/my-wallet",
  HISTORY: "/transactions/history",
  GET_BY_ID: (id: string) => `/transactions/${id}`,
} as const;

// ========================================
// 👤 Usuário
// ========================================
export const USER_ENDPOINTS = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
  DELETE_ACCOUNT: "/users/delete",
  GET_BY_ID: (id: string) => `/users/${id}`,
} as const;

// ========================================
// 💳 Carteira
// ========================================
export const WALLET_ENDPOINTS = {
  GET_BALANCE: "/wallet/balance",
  GET_WALLET: "/wallet/info",
  GET_ALL: "/wallet/list",
} as const;

// ========================================
// 📊 Relatórios e Analytics
// ========================================
export const ANALYTICS_ENDPOINTS = {
  DASHBOARD_STATS: "/analytics/dashboard",
  TRANSACTION_SUMMARY: "/analytics/transactions/summary",
  MONTHLY_REPORT: "/analytics/monthly",
} as const;

// ========================================
// 🏥 Health e Status
// ========================================
export const HEALTH_ENDPOINTS = {
  STATUS: "/health/status",
  PING: "/health/ping",
} as const;

// ========================================
// 🔗 Tipo para rotas dinâmicas
// ========================================
export const ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  transaction: TRANSACTION_ENDPOINTS,
  user: USER_ENDPOINTS,
  wallet: WALLET_ENDPOINTS,
  analytics: ANALYTICS_ENDPOINTS,
  health: HEALTH_ENDPOINTS,
} as const;

// ========================================
// 📌 Type utilities
// ========================================
export type AuthEndpoint = (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];
export type TransactionEndpoint =
  (typeof TRANSACTION_ENDPOINTS)[keyof typeof TRANSACTION_ENDPOINTS];
export type UserEndpoint = (typeof USER_ENDPOINTS)[keyof typeof USER_ENDPOINTS];
export type WalletEndpoint =
  (typeof WALLET_ENDPOINTS)[keyof typeof WALLET_ENDPOINTS];
