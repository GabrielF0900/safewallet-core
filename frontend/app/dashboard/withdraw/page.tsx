'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CurrencyInput } from '@/components/currency-input'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { transactionsApi } from '@/lib/api'
import { useWalletStore } from '@/lib/wallet-store'
import { formatCurrency } from '@/lib/formatters'
import { ArrowUpCircle, CheckCircle2, Wallet, AlertCircle } from 'lucide-react'

export default function WithdrawPage() {
  const router = useRouter()
  const { balance, setBalance } = useWalletStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [amountValue, setAmountValue] = useState('')
  const [numericAmount, setNumericAmount] = useState(0)

  const withdrawSchema = z.object({
    amount: z
      .number()
      .positive('O valor deve ser maior que zero')
      .max(balance, 'Saldo insuficiente'),
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
  })

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await transactionsApi.getBalance()
        setBalance(response.data.balance)
      } catch (error) {
        toast.error('Erro ao carregar saldo')
      } finally {
        setIsLoadingBalance(false)
      }
    }
    fetchBalance()
  }, [setBalance])

  const handleAmountChange = (formatted: string, numeric: number) => {
    setAmountValue(formatted)
    setNumericAmount(numeric)
    setValue('amount', numeric, { shouldValidate: true })
  }

  const handleWithdrawAll = () => {
    const formatted = balance.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    setAmountValue(formatted)
    setNumericAmount(balance)
    setValue('amount', balance, { shouldValidate: true })
  }

  const onSubmit = async () => {
    setShowConfirm(true)
  }

  const confirmWithdraw = async () => {
    setIsLoading(true)
    try {
      const response = await transactionsApi.withdraw(numericAmount)
      setBalance(response.data.newBalance)
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <div>
            <p className="font-medium">Saque realizado!</p>
            <p className="text-sm text-muted-foreground">
              Novo saldo: {formatCurrency(response.data.newBalance)}
            </p>
          </div>
        </div>
      )
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar saque'
      toast.error(message)
    } finally {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  if (isLoadingBalance) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sacar</h1>
        <p className="text-muted-foreground mt-1">
          Retire fundos da sua carteira
        </p>
      </div>

      {/* Balance Display */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleWithdrawAll}>
          Sacar Tudo
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <Label htmlFor="amount">Valor do Saque</Label>
            <CurrencyInput
              id="amount"
              value={amountValue}
              onChange={handleAmountChange}
              placeholder="0,00"
              error={!!errors.amount}
            />
            {errors.amount && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.amount.message}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || numericAmount <= 0 || numericAmount > balance}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Processando...
            </>
          ) : (
            <>
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Confirmar Saque
            </>
          )}
        </Button>
      </form>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirmar Saque"
        description={`Você está prestes a sacar ${formatCurrency(numericAmount)} da sua carteira. Seu novo saldo será ${formatCurrency(balance - numericAmount)}. Deseja continuar?`}
        confirmLabel="Sacar"
        onConfirm={confirmWithdraw}
        isLoading={isLoading}
      />
    </div>
  )
}
