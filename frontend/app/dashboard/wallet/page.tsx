'use client'

import { useEffect, useState } from 'react'
import { useWalletStore } from '@/lib/wallet-store'
import { transactionsApi } from '@/lib/api'
import { formatCurrency, formatShortDate } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Wallet,
  Copy,
  Check,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Shield,
} from 'lucide-react'

export default function WalletPage() {
  const { balance, walletId, setBalance, setWalletId } = useWalletStore()
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [walletCreatedAt, setWalletCreatedAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await transactionsApi.getWallet()
        setBalance(response.data.balance)
        setWalletId(response.data.walletId)
        if (response.data.createdAt) {
          setWalletCreatedAt(response.data.createdAt)
        }
      } catch (error) {
        toast.error('Erro ao carregar dados da carteira')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWallet()
  }, [setBalance, setWalletId])

  const copyWalletId = async () => {
    if (walletId) {
      await navigator.clipboard.writeText(walletId)
      setCopied(true)
      toast.success('ID da carteira copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saldo e Carteira</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie sua carteira digital
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/20 p-3">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Saldo Disponível</span>
        </div>
        <p className="text-4xl font-bold text-foreground">
          {formatCurrency(balance)}
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button asChild>
            <Link href="/dashboard/deposit">
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Depositar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/withdraw">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Sacar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/transfer">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Transferir
            </Link>
          </Button>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Informações da Carteira
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">ID da Carteira</p>
              <p className="font-mono text-sm text-foreground mt-1">
                {walletId || 'Não disponível'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyWalletId}
              disabled={!walletId}
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {walletCreatedAt && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Data de Criação</p>
              <p className="text-sm text-foreground mt-1">
                {formatShortDate(walletCreatedAt)}
              </p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-success/10">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-success">Status: Ativo</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sua carteira está protegida com criptografia de nível bancário
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
