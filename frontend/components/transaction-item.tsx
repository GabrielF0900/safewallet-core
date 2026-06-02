'use client'

import type { Transaction } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  transaction: Transaction
}

const typeConfig = {
  DEPOSIT: {
    icon: ArrowDownLeft,
    label: 'Depósito',
    color: 'text-success',
    bgColor: 'bg-success/10',
    sign: '+',
  },
  WITHDRAWAL: {
    icon: ArrowUpRight,
    label: 'Saque',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    sign: '-',
  },
  TRANSFER: {
    icon: ArrowLeftRight,
    label: 'Transferência',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    sign: '-',
  },
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const config = typeConfig[transaction.type]
  const Icon = config.icon

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-full', config.bgColor)}>
          <Icon className={cn('h-4 w-4', config.color)} />
        </div>
        <div>
          <p className="font-medium text-sm">{config.label}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn('font-semibold text-sm', config.color)}>
          {config.sign} {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-muted-foreground">
          Saldo: {formatCurrency(transaction.balanceAfter)}
        </p>
      </div>
    </div>
  )
}
