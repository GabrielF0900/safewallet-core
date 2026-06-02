import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Zap, 
  Globe, 
  Wallet, 
  ArrowRight,
  CheckCircle2,
  Github
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Avançada',
    description: 'Autenticação JWT com BCrypt para proteção máxima dos seus dados e transações.',
  },
  {
    icon: Zap,
    title: 'Transações Instantâneas',
    description: 'Operações ACID garantem consistência e velocidade em todas as transações.',
  },
  {
    icon: Globe,
    title: 'Cloud-Native',
    description: 'Arquitetura escalável e stateless, pronta para deploy em qualquer cloud.',
  },
  {
    icon: Wallet,
    title: 'Gestão Completa',
    description: 'Depósitos, saques e transferências com histórico detalhado de operações.',
  },
]

const benefits = [
  'Depósitos instantâneos',
  'Transferências seguras',
  'Histórico completo',
  'API RESTful',
  'Suporte 24/7',
  'Dados criptografados',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo size="md" />
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </Link>
              <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span>Carteira Digital Segura</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              Sua carteira digital com{' '}
              <span className="text-primary">segurança de nível bancário</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              SafeWallet Core é uma plataforma moderna para gerenciar suas finanças digitais. 
              Faça depósitos, saques e transferências com total segurança e tranquilidade.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Recursos Poderosos
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Desenvolvido com as melhores práticas de engenharia para garantir 
              segurança, performance e escalabilidade.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Tudo que você precisa para gerenciar suas finanças digitais
              </h2>
              <p className="mt-4 text-muted-foreground">
                Com SafeWallet Core, você tem controle total sobre sua carteira digital. 
                Realize operações de forma simples, rápida e segura.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/register">
                    Criar Conta Grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Saldo Disponível</span>
                  <span className="text-2xl font-bold text-foreground">R$ 12.500,00</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-success/10">
                    <p className="text-xs text-muted-foreground">Depósitos</p>
                    <p className="text-sm font-semibold text-success">+R$ 5.000</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-destructive/10">
                    <p className="text-xs text-muted-foreground">Saques</p>
                    <p className="text-sm font-semibold text-destructive">-R$ 1.200</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground">Transferências</p>
                    <p className="text-sm font-semibold text-primary">R$ 3.500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Pronto para começar?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Crie sua conta gratuitamente e comece a gerenciar sua carteira digital hoje mesmo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SafeWallet Core. MVP Profissional.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="https://github.com" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
