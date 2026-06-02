import { Shield } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-xl' },
  lg: { icon: 36, text: 'text-2xl' },
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Shield className="text-primary" size={icon} strokeWidth={2.5} />
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: icon * 0.35 }}
        >
          <span className="text-primary font-bold">$</span>
        </div>
      </div>
      {showText && (
        <span className={`font-semibold text-foreground ${text}`}>
          SafeWallet<span className="text-primary">Core</span>
        </span>
      )}
    </div>
  )
}
