'use client'

import { useEffect, useState } from 'react'
import { useWalletStore } from '@/lib/wallet-store'
import { transactionsApi } from '@/lib/api'
import { TransactionItem } from '@/components/transaction-item'
import { Skeleton } from '@/components/ui/skeleton'
import { History } from 'lucide-react'
import { toast } from 'sonner'

export default function TransactionsPage() {
  const { transactions, setTransactions } = useWalletStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAllTransactions = async () => {
      try {
        const response = await transactionsApi.getTransactions()
        
        // 🛡️ EXTRATOR DEFENSIVO: Intercepta o formato de paginação do Spring Boot
        let txList = response.data
        if (txList && typeof txList === 'object' && 'content' in txList) {
          txList = (txList as any).content
        }
        
        if (!Array.isArray(txList)) {
          txList = []
        }
        
        setTransactions(txList)
      } catch (error) {
        toast.error('Erro ao carregar histórico completo')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAllTransactions()
  }, [setTransactions])

  // 🛡️ Proteção de Runtime contra arrays corrompidos
  const safeTransactions = Array.isArray(transactions) ? transactions : []

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mb-6" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Histórico de Operações
        </h1>
        <p className="text-muted-foreground mt-1">
          Confira abaixo todas as movimentações financeiras da sua carteira digital.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {safeTransactions.length > 0 ? (
          <div className="divide-y divide-border">
            {safeTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma movimentação registrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}