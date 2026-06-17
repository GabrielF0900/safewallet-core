export const ENDPOINTS = {
  auth: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  transaction: {
    DEPOSIT: '/transactions/deposit',
    WITHDRAW: '/transactions/withdraw',
    TRANSFER: '/transactions/transfer',
    BALANCE: '/transactions/balance',
    MY_WALLET: '/transactions/my-wallet',
    HISTORY: '/transactions/history',
    GET_BY_ID: (id: string) => `/transactions/${id}`,
  },
  user: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update-profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete-account',
    GET_BY_ID: (id: string) => `/user/${id}`,
  },
  wallet: {
    GET_BALANCE: '/wallet/balance',
    GET_WALLET: '/wallet',
    GET_ALL: '/wallet/all',
  },
  analytics: {
    DASHBOARD_STATS: '/analytics/dashboard',
    TRANSACTION_SUMMARY: '/analytics/summary',
    MONTHLY_REPORT: '/analytics/report',
  },
  health: {
    STATUS: '/health',
    PING: '/health/ping',
  },
} as const;