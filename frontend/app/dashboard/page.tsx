'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { useWalletStore } from '@/lib/wallet-store'
import { transactionsApi, type Transaction } from '@/lib/api'
import { formatCurrency } from '@/lib/formatters'
import { StatCard } from '@/components/stat-card'
import { QuickAction } from '@/components/quick-action'
import { TransactionItem } from '@/components/transaction-item'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CreditCard,
  TrendingUp,
  ArrowLeftRight,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowDownLeft,
  History,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { balance, setBalance, setWalletId, transactions, setTransactions } = useWalletStore()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    todayTransactions: 0,
    totalTransferred: 0,
    totalDeposited: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          transactionsApi.getBalance(),
          transactionsApi.getTransactions().catch(() => ({ data: [] })),
        ])

        setBalance(balanceRes.data.balance)
        setWalletId(balanceRes.data.walletId)
        
        // Jogamos para 'any' temporariamente para podermos higienizar o tipo sem o TS reclamar de 'never'
        let txList: any = transactionsRes.data;

        // 🛡️ DETECTOR DE HTML: Se a API retornar uma página web (HTML bruto) em vez de dados, descarta
        if (typeof txList === 'string') {
          const cleanStr = txList.trim();
          if (cleanStr.startsWith('<!DOCTYPE') || cleanStr.startsWith('<html')) {
            console.error("Alerta: A API retornou HTML em vez de um objeto de dados JSON estruturado.");
            txList = [];
          }
        }

        // 🛡️ EXTRATOR: Se o Spring Boot retornou um objeto de paginação (PageImpl), extrai o array do 'content'
        if (txList && typeof txList === 'object' && 'content' in txList) {
          txList = txList.content;
        }

        // Se por algum motivo o JSON válido veio envelopado como string, faz o parse seguro
        if (typeof txList === 'string') {
          try {
            const parsed = JSON.parse(txList);
            txList = parsed.content || parsed || [];
          } catch {
            txList = [];
          }
        }

        // Fallback absoluto: garante que se vier null/undefined ou objetos, vire um array vazio
        if (!Array.isArray(txList)) {
          txList = [];
        }

        setTransactions(txList)

        // Calculate stats de forma segura, checando se a propriedade createdAt existe
        const today = new Date().toDateString()
        const todayTx = txList.filter(
          (tx: Transaction) => tx?.createdAt && new Date(tx.createdAt).toDateString() === today
        )
        const transferred = txList
          .filter((tx: Transaction) => tx && tx.type === 'TRANSFER')
          .reduce((sum: number, tx: Transaction) => sum + (tx.amount || 0), 0)
        const deposited = txList
          .filter((tx: Transaction) => tx && tx.type === 'DEPOSIT')
          .reduce((sum: number, tx: Transaction) => sum + (tx.amount || 0), 0)

        setStats({
          todayTransactions: todayTx.length,
          totalTransferred: transferred,
          totalDeposited: deposited,
        })
      } catch (error) {
        console.error("Erro capturado no carregamento do Dashboard:", error)
        toast.error('Erro ao carregar dados')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [setBalance, setWalletId, setTransactions])

  // 🛡️ Proteção de Runtime: Evita quebras se o estado global sofrer mutações inesperadas
  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const recentTransactions = safeTransactions.slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome de volta ao SafeWallet. Aqui está seu resumo de hoje.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CreditCard}
          title="Saldo Disponível"
          value={formatCurrency(balance)}
          variant="primary"
        />
        <StatCard
          icon={TrendingUp}
          title="Operações Realizadas"
          value={`${stats.todayTransactions} transações`}
          description="Hoje"
          variant="success"
        />
        <StatCard
          icon={ArrowLeftRight}
          title="Total Transferido"
          value={formatCurrency(stats.totalTransferred)}
          variant="warning"
        />
        <StatCard
          icon={ArrowDownLeft}
          title="Total Recebido"
          value={formatCurrency(stats.totalDeposited)}
          variant="info"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={ArrowDownCircle}
            label="Depositar"
            href="/dashboard/deposit"
          />
          <QuickAction
            icon={ArrowUpCircle}
            label="Sacar"
            href="/dashboard/withdraw"
          />
          <QuickAction
            icon={ArrowLeftRight}
            label="Transferir"
            href="/dashboard/transfer"
          />
          <QuickAction
            icon={History}
            label="Ver Histórico"
            href="/dashboard/transactions"
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Últimas Operações
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/transactions">
              Ver mais
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-border">
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhuma transação realizada ainda.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/deposit">Fazer primeiro depósito</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}