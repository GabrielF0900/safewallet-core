'use client'

import { validatePassword } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { strength, errors } = validatePassword(password)

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-destructive'
    if (strength <= 50) return 'bg-warning'
    if (strength <= 75) return 'bg-chart-2'
    return 'bg-success'
  }

  const getStrengthText = () => {
    if (strength <= 25) return 'Fraca'
    if (strength <= 50) return 'Regular'
    if (strength <= 75) return 'Boa'
    return 'Forte'
  }

  const requirements = [
    { label: 'Mínimo de 8 caracteres', met: password.length >= 8 },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Letra minúscula', met: /[a-z]/.test(password) },
    { label: 'Número', met: /\d/.test(password) },
  ]

  if (!password) return null

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Força da senha</span>
          <span className={cn(
            'font-medium',
            strength <= 25 && 'text-destructive',
            strength > 25 && strength <= 50 && 'text-warning',
            strength > 50 && strength <= 75 && 'text-chart-2',
            strength > 75 && 'text-success'
          )}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', getStrengthColor())}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-1.5 text-xs">
            {req.met ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
