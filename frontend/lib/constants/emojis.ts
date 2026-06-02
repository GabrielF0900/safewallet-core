/**
 * 🎨 SafeWallet Emoji Constants
 *
 * Centraliza todos os emojis reutilizáveis do projeto
 * Seguindo princípios SOLID - Single Responsibility Principle (SRP)
 *
 * Cada constante representa um contexto específico
 * Facilitando manutenção e consistência visual
 */

// ========================================
// 🔐 Autenticação e Segurança
// ========================================
export const AUTH_EMOJIS = {
  LOGIN: "🔓",
  LOGOUT: "🚪",
  REGISTER: "✍️",
  PASSWORD: "🔑",
  EMAIL: "📧",
  VERIFICATION: "✅",
  LOCK: "🔒",
  UNLOCK: "🔓",
  SECURITY: "🛡️",
  TWO_FACTOR: "🔐",
} as const;

// ========================================
// 💰 Transações e Carteira
// ========================================
export const TRANSACTION_EMOJIS = {
  DEPOSIT: "📤",
  WITHDRAW: "📥",
  TRANSFER: "➡️",
  BALANCE: "💳",
  WALLET: "👛",
  MONEY: "💰",
  CASH: "💵",
  CREDIT_CARD: "💳",
  EXCHANGE: "🔄",
  HISTORY: "📋",
  INCOMING: "📨",
  OUTGOING: "📮",
  PENDING: "⏳",
  SUCCESS: "✔️",
  FAILED: "❌",
} as const;

// ========================================
// 🎯 Navegação e Ações
// ========================================
export const NAVIGATION_EMOJIS = {
  HOME: "🏠",
  DASHBOARD: "📊",
  SETTINGS: "⚙️",
  PROFILE: "👤",
  HELP: "❓",
  ABOUT: "ℹ️",
  BACK: "⬅️",
  NEXT: "➡️",
  MENU: "☰",
  CLOSE: "✕",
  SEARCH: "🔍",
  FILTER: "🔎",
  REFRESH: "🔄",
  DOWNLOAD: "⬇️",
  UPLOAD: "⬆️",
  EXPORT: "📤",
  IMPORT: "📥",
} as const;

// ========================================
// 📊 Status e Indicadores
// ========================================
export const STATUS_EMOJIS = {
  ACTIVE: "🟢",
  INACTIVE: "⚫",
  PENDING: "🟡",
  COMPLETED: "✅",
  ERROR: "❌",
  WARNING: "⚠️",
  INFO: "ℹ️",
  LOADING: "⏳",
  CHECKING: "🔍",
  VERIFIED: "✔️",
  UNVERIFIED: "✗",
  AVAILABLE: "✓",
  UNAVAILABLE: "✗",
  ONLINE: "🟢",
  OFFLINE: "🔴",
} as const;

// ========================================
// 👥 Usuário e Conta
// ========================================
export const USER_EMOJIS = {
  USER: "👤",
  USERS: "👥",
  PROFILE: "👤",
  ACCOUNT: "👤",
  NAME: "📝",
  EMAIL: "📧",
  PHONE: "📞",
  ADDRESS: "📍",
  SETTINGS: "⚙️",
  PREFERENCES: "🎛️",
  NOTIFICATIONS: "🔔",
  MUTED: "🔇",
  DELETE: "🗑️",
  EDIT: "✏️",
  VIEW: "👁️",
} as const;

// ========================================
// 🌍 Gerais e Utilitários
// ========================================
export const UTILITY_EMOJIS = {
  SUCCESS: "✅",
  ERROR: "❌",
  WARNING: "⚠️",
  INFO: "ℹ️",
  LOADING: "⏳",
  COPY: "📋",
  COPIED: "✓",
  LINK: "🔗",
  STAR: "⭐",
  FAVORITE: "❤️",
  CLOCK: "🕐",
  CALENDAR: "📅",
  BELL: "🔔",
  SOUND: "🔊",
  MUTE: "🔇",
  VOLUME: "🔉",
} as const;

// ========================================
// 🎉 Feedback e Interações
// ========================================
export const FEEDBACK_EMOJIS = {
  CONGRATULATIONS: "🎉",
  WELCOME: "👋",
  GOODBYE: "👋",
  THANKS: "🙏",
  SORRY: "😔",
  THINKING: "🤔",
  HAPPY: "😊",
  SAD: "😢",
  ANGRY: "😠",
  CONFUSED: "😕",
  ROCKET: "🚀",
  FIRE: "🔥",
  SPARKLE: "✨",
  HEART: "❤️",
} as const;

// ========================================
// 🏦 Banco e Financeiro (Extra)
// ========================================
export const FINANCIAL_EMOJIS = {
  BANK: "🏦",
  SAFE: "🏧",
  VAULT: "🔐",
  COIN: "🪙",
  DOLLAR: "💵",
  EURO: "💶",
  POUND: "💷",
  YEN: "💴",
  PERCENT: "💯",
  CHART_UP: "📈",
  CHART_DOWN: "📉",
  TREND: "📊",
  GROWTH: "📈",
  DECLINE: "📉",
} as const;

// ========================================
// 🎨 Cores Visuais (Como strings)
// ========================================
export const COLOR_INDICATORS = {
  GREEN_CIRCLE: "🟢",
  YELLOW_CIRCLE: "🟡",
  RED_CIRCLE: "🔴",
  BLUE_CIRCLE: "🔵",
  PURPLE_CIRCLE: "🟣",
  ORANGE_SQUARE: "🟧",
  RED_SQUARE: "🟥",
  GREEN_SQUARE: "🟩",
  BLUE_SQUARE: "🟦",
} as const;

// ========================================
// 🔗 Type Exports para melhor DX
// ========================================
export type AuthEmoji = (typeof AUTH_EMOJIS)[keyof typeof AUTH_EMOJIS];
export type TransactionEmoji =
  (typeof TRANSACTION_EMOJIS)[keyof typeof TRANSACTION_EMOJIS];
export type NavigationEmoji =
  (typeof NAVIGATION_EMOJIS)[keyof typeof NAVIGATION_EMOJIS];
export type StatusEmoji = (typeof STATUS_EMOJIS)[keyof typeof STATUS_EMOJIS];
export type UserEmoji = (typeof USER_EMOJIS)[keyof typeof USER_EMOJIS];
export type UtilityEmoji = (typeof UTILITY_EMOJIS)[keyof typeof UTILITY_EMOJIS];
export type FeedbackEmoji =
  (typeof FEEDBACK_EMOJIS)[keyof typeof FEEDBACK_EMOJIS];
export type FinancialEmoji =
  (typeof FINANCIAL_EMOJIS)[keyof typeof FINANCIAL_EMOJIS];

// ========================================
// 🧬 Unified Export (para imports convenientes)
// ========================================
export const ALL_EMOJIS = {
  auth: AUTH_EMOJIS,
  transaction: TRANSACTION_EMOJIS,
  navigation: NAVIGATION_EMOJIS,
  status: STATUS_EMOJIS,
  user: USER_EMOJIS,
  utility: UTILITY_EMOJIS,
  feedback: FEEDBACK_EMOJIS,
  financial: FINANCIAL_EMOJIS,
  colors: COLOR_INDICATORS,
} as const;

// ========================================
// 📌 Convenientes para uso rápido
// ========================================
export const QUICK_EMOJIS = {
  // Transações frequentes
  deposit: TRANSACTION_EMOJIS.DEPOSIT,
  withdraw: TRANSACTION_EMOJIS.WITHDRAW,
  transfer: TRANSACTION_EMOJIS.TRANSFER,
  success: STATUS_EMOJIS.COMPLETED,
  error: STATUS_EMOJIS.ERROR,
  loading: STATUS_EMOJIS.LOADING,
  user: USER_EMOJIS.USER,
  settings: NAVIGATION_EMOJIS.SETTINGS,
  home: NAVIGATION_EMOJIS.HOME,
  profile: USER_EMOJIS.PROFILE,
} as const;
