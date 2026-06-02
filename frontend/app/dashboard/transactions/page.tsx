'use client'

import { useEffect, useState } from 'react'
import { useWalletStore } from '@/lib/wallet-store'
import { transactionsApi, type Transaction } from '@/lib/api'
import { TransactionItem } from '@/components/transaction-item'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { History, Filter, RefreshCw } from 'lucide-react'

type FilterType = 'ALL' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'

export default function TransactionsPage() {
  const { transactions, setTransactions } = useWalletStore()
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('ALL')

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await transactionsApi.getTransactions()
      setTransactions(response.data || [])
    } catch (error) {
      toast.error('Erro ao carregar transações')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const filteredTransactions =
    filter === 'ALL'
      ? transactions
      : transactions.filter((tx) => tx.type === filter)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Histórico de Transações
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize todas as suas operações
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterType)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas</SelectItem>
            <SelectItem value="DEPOSIT">Depósitos</SelectItem>
            <SelectItem value="WITHDRAWAL">Saques</SelectItem>
            <SelectItem value="TRANSFER">Transferências</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredTransactions.length} transações
        </span>
      </div>

      {/* Transactions List */}
      <div className="rounded-xl border border-border bg-card">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-border p-4">
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === 'ALL'
                ? 'Nenhuma transação encontrada.'
                : `Nenhum(a) ${
                    filter === 'DEPOSIT'
                      ? 'depósito'
                      : filter === 'WITHDRAWAL'
                      ? 'saque'
                      : 'transferência'
                  } encontrado(a).`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
