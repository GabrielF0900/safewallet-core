'use client'

import { getInitials } from '@/lib/formatters'

interface AvatarUserProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export function AvatarUser({ name, size = 'md', className = '' }: AvatarUserProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  )
}
