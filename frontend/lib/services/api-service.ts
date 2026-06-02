/**
 * 🔧 API Services
 *
 * Layer responsável por fazer chamadas HTTP
 * Segue SOLID - Single Responsibility Principle
 * Cada serviço cuida de um domínio específico
 */

import { api } from "@/lib/api";
import { ENDPOINTS } from "./endpoints";

// ========================================
// 🔐 Auth Service
// ========================================
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post(ENDPOINTS.auth.REGISTER, {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post(ENDPOINTS.auth.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ========================================
// 💰 Transaction Service
// ========================================
export const transactionService = {
  deposit: async (amount: number) => {
    const response = await api.post(ENDPOINTS.transaction.DEPOSIT, { amount });
    return response.data;
  },

  withdraw: async (amount: number) => {
    const response = await api.post(ENDPOINTS.transaction.WITHDRAW, { amount });
    return response.data;
  },

  transfer: async (destinationWalletId: string, amount: number) => {
    const response = await api.post(ENDPOINTS.transaction.TRANSFER, {
      destinationWalletId,
      amount,
    });
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get(ENDPOINTS.transaction.BALANCE);
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get(ENDPOINTS.transaction.MY_WALLET);
    return response.data;
  },

  getHistory: async (limit = 10, offset = 0) => {
    const response = await api.get(
      `${ENDPOINTS.transaction.HISTORY}?limit=${limit}&offset=${offset}`,
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(ENDPOINTS.transaction.GET_BY_ID(id));
    return response.data;
  },
};

// ========================================
// 👤 User Service
// ========================================
export const userService = {
  getProfile: async () => {
    const response = await api.get(ENDPOINTS.user.PROFILE);
    return response.data;
  },

  updateProfile: async (name: string, email: string) => {
    const response = await api.put(ENDPOINTS.user.UPDATE_PROFILE, {
      name,
      email,
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put(ENDPOINTS.user.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deleteAccount: async (password: string) => {
    const response = await api.delete(ENDPOINTS.user.DELETE_ACCOUNT, {
      data: { password },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(ENDPOINTS.user.GET_BY_ID(id));
    return response.data;
  },
};

// ========================================
// 💳 Wallet Service
// ========================================
export const walletService = {
  getBalance: async () => {
    const response = await api.get(ENDPOINTS.wallet.GET_BALANCE);
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get(ENDPOINTS.wallet.GET_WALLET);
    return response.data;
  },

  getAllWallets: async () => {
    const response = await api.get(ENDPOINTS.wallet.GET_ALL);
    return response.data;
  },
};

// ========================================
// 📊 Analytics Service
// ========================================
export const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get(ENDPOINTS.analytics.DASHBOARD_STATS);
    return response.data;
  },

  getTransactionSummary: async () => {
    const response = await api.get(ENDPOINTS.analytics.TRANSACTION_SUMMARY);
    return response.data;
  },

  getMonthlyReport: async (year: number, month: number) => {
    const response = await api.get(
      `${ENDPOINTS.analytics.MONTHLY_REPORT}?year=${year}&month=${month}`,
    );
    return response.data;
  },
};

// ========================================
// 🏥 Health Service
// ========================================
export const healthService = {
  getStatus: async () => {
    const response = await api.get(ENDPOINTS.health.STATUS);
    return response.data;
  },

  ping: async () => {
    const response = await api.get(ENDPOINTS.health.PING);
    return response.data;
  },
};

// ========================================
// 🔗 Export Unified Services
// ========================================
export const services = {
  auth: authService,
  transaction: transactionService,
  user: userService,
  wallet: walletService,
  analytics: analyticsService,
  health: healthService,
} as const;
