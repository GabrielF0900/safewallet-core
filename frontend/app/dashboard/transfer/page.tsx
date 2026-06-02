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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import { transactionsApi } from '@/lib/api'
import { useWalletStore } from '@/lib/wallet-store'
import { formatCurrency, validateUUID } from '@/lib/formatters'
import {
  ArrowLeftRight,
  CheckCircle2,
  Wallet,
  AlertCircle,
  User,
} from 'lucide-react'

export default function TransferPage() {
  const router = useRouter()
  const { balance, setBalance } = useWalletStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [amountValue, setAmountValue] = useState('')
  const [numericAmount, setNumericAmount] = useState(0)

  const transferSchema = z.object({
    destinationWalletId: z
      .string()
      .min(1, 'ID da carteira é obrigatório')
      .refine((val) => validateUUID(val), 'ID da carteira inválido'),
    amount: z
      .number()
      .positive('O valor deve ser maior que zero')
      .max(balance, 'Saldo insuficiente'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
  })

  const destinationWalletId = watch('destinationWalletId')

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

  const onSubmit = async () => {
    setShowConfirm(true)
  }

  const confirmTransfer = async () => {
    setIsLoading(true)
    try {
      const response = await transactionsApi.transfer(
        destinationWalletId,
        numericAmount
      )
      setBalance(response.data.newBalance)
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <div>
            <p className="font-medium">Transferência realizada!</p>
            <p className="text-sm text-muted-foreground">
              Novo saldo: {formatCurrency(response.data.newBalance)}
            </p>
          </div>
        </div>
      )
      router.push('/dashboard')
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Erro ao realizar transferência'
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
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transferir</h1>
        <p className="text-muted-foreground mt-1">
          Envie fundos para outra carteira
        </p>
      </div>

      {/* Balance Display */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Wallet className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Saldo Disponível</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          {/* Destination Wallet */}
          <div className="space-y-2">
            <Label htmlFor="destinationWalletId">ID da Carteira de Destino</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="destinationWalletId"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className={`pl-10 font-mono text-sm ${
                  errors.destinationWalletId ? 'border-destructive' : ''
                }`}
                {...register('destinationWalletId')}
              />
            </div>
            {errors.destinationWalletId && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.destinationWalletId.message}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da Transferência</Label>
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
          disabled={
            isLoading ||
            numericAmount <= 0 ||
            numericAmount > balance ||
            !destinationWalletId
          }
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Processando...
            </>
          ) : (
            <>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Confirmar Transferência
            </>
          )}
        </Button>
      </form>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirmar Transferência"
        description={`Você está prestes a transferir ${formatCurrency(numericAmount)} para a carteira ${destinationWalletId?.slice(0, 8)}...${destinationWalletId?.slice(-4)}. Seu novo saldo será ${formatCurrency(balance - numericAmount)}. Deseja continuar?`}
        confirmLabel="Transferir"
        onConfirm={confirmTransfer}
        isLoading={isLoading}
      />
    </div>
  )
}
