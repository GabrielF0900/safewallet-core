export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function formatCurrencyInput(value: string): string {
  const numericValue = value.replace(/\D/g, '')
  const number = parseInt(numericValue, 10) / 100
  if (isNaN(number)) return ''
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
  strength: number
} {
  const errors: string[] = []
  let strength = 0

  if (password.length >= 8) {
    strength += 25
  } else {
    errors.push('Mínimo de 8 caracteres')
  }

  if (/[A-Z]/.test(password)) {
    strength += 25
  } else {
    errors.push('Pelo menos uma letra maiúscula')
  }

  if (/[a-z]/.test(password)) {
    strength += 25
  } else {
    errors.push('Pelo menos uma letra minúscula')
  }

  if (/\d/.test(password)) {
    strength += 25
  } else {
    errors.push('Pelo menos um número')
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}
