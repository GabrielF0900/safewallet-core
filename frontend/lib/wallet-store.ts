'use client'

import { create } from 'zustand'
import type { Transaction } from './api'

interface WalletState {
  balance: number
  walletId: string | null
  transactions: Transaction[]
  isLoading: boolean
  setBalance: (balance: number) => void
  setWalletId: (walletId: string) => void
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  walletId: null,
  transactions: [],
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setWalletId: (walletId) => set({ walletId }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ balance: 0, walletId: null, transactions: [], isLoading: false }),
}))
