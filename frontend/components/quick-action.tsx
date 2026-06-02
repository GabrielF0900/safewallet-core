'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionProps {
  icon: LucideIcon
  label: string
  href: string
}

export function QuickAction({ icon: Icon, label, href }: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6',
        'rounded-xl border border-border bg-card',
        'transition-all duration-200',
        'hover:shadow-md hover:border-primary/20 hover:bg-accent/50'
      )}
    >
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  )
}
