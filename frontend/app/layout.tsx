import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'SafeWallet Core - Carteira Digital Segura',
  description: 'SafeWallet Core é uma plataforma moderna para gerenciar suas finanças digitais. Faça depósitos, saques e transferências com total segurança.',
  keywords: ['carteira digital', 'finanças', 'transferências', 'pagamentos', 'segurança'],
  authors: [{ name: 'SafeWallet Core' }],
  openGraph: {
    title: 'SafeWallet Core - Carteira Digital Segura',
    description: 'Gerencie suas finanças digitais com segurança de nível bancário.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
