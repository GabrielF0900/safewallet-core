'use client'

import { useState } from 'react'
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
import { transactionsApi } from '@/lib/api'
import { useWalletStore } from '@/lib/wallet-store'
import { formatCurrency } from '@/lib/formatters'
import { ArrowDownCircle, CheckCircle2, Info } from 'lucide-react'

const depositSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
})

type DepositForm = z.infer<typeof depositSchema>

export default function DepositPage() {
  const router = useRouter()
  const { setBalance } = useWalletStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [amountValue, setAmountValue] = useState('')
  const [numericAmount, setNumericAmount] = useState(0)

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
  })

  const handleAmountChange = (formatted: string, numeric: number) => {
    setAmountValue(formatted)
    setNumericAmount(numeric)
    setValue('amount', numeric, { shouldValidate: true })
  }

  const onSubmit = async () => {
    setShowConfirm(true)
  }

  const confirmDeposit = async () => {
    setIsLoading(true)
    try {
      const response = await transactionsApi.deposit(numericAmount)
      setBalance(response.data.newBalance)
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <div>
            <p className="font-medium">Depósito realizado!</p>
            <p className="text-sm text-muted-foreground">
              Novo saldo: {formatCurrency(response.data.newBalance)}
            </p>
          </div>
        </div>
      )
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar depósito'
      toast.error(message)
    } finally {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Depositar</h1>
        <p className="text-muted-foreground mt-1">
          Adicione fundos à sua carteira
        </p>
      </div>

      {/* Info Card */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Depósito instantâneo
          </p>
          <p className="text-sm text-muted-foreground">
            Os fundos serão adicionados imediatamente à sua carteira.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <Label htmlFor="amount">Valor do Depósito</Label>
            <CurrencyInput
              id="amount"
              value={amountValue}
              onChange={handleAmountChange}
              placeholder="0,00"
              error={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || numericAmount <= 0}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Processando...
            </>
          ) : (
            <>
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Confirmar Depósito
            </>
          )}
        </Button>
      </form>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirmar Depósito"
        description={`Você está prestes a depositar ${formatCurrency(numericAmount)} em sua carteira. Deseja continuar?`}
        confirmLabel="Depositar"
        onConfirm={confirmDeposit}
        isLoading={isLoading}
      />
    </div>
  )
}
