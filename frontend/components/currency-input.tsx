'use client'

import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatCurrencyInput } from '@/lib/formatters'

interface CurrencyInputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  value?: string
  onChange?: (value: string, numericValue: number) => void
  error?: boolean
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = '', onChange, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '')
      const formatted = formatCurrencyInput(rawValue)
      const numericValue = parseInt(rawValue, 10) / 100 || 0
      onChange?.(formatted, numericValue)
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          R$
        </span>
        <Input
          type="text"
          inputMode="numeric"
          className={cn('pl-10', error && 'border-destructive', className)}
          value={value}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'
