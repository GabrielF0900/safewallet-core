# 🎨 SafeWallet Core - Frontend

**Interface moderna, minimalista e profissional para gerenciar carteiras digitais**

## 📋 Visão Geral

SafeWallet Core Frontend é uma aplicação **Next.js 16** com **React 19** e **Tailwind CSS** que fornece uma interface intuitiva para:

- ✅ Registrar e fazer login com segurança (JWT)
- ✅ Visualizar saldo e informações da carteira
- ✅ Realizar depósitos, saques e transferências
- ✅ Acompanhar histórico de transações
- ✅ Gerenciar perfil pessoal

---

## 🏗️ Arquitetura e Organização (SOLID)

A estrutura segue **princípios SOLID** para máxima manutenibilidade:

### 📂 Estrutura de Pastas

```
frontend/
│
├── app/                           # 🔀 Next.js App Router
│   ├── dashboard/                # Rotas autenticadas
│   │   ├── layout.tsx            # Layout do dashboard com sidebar
│   │   ├── page.tsx              # Página principal (visão geral)
│   │   ├── wallet/               # Visualização de carteira
│   │   ├── deposit/              # Depositar dinheiro
│   │   ├── withdraw/             # Sacar dinheiro
│   │   ├── transfer/             # Transferir entre contas
│   │   ├── transactions/         # Histórico de transações
│   │   ├── profile/              # Gerenciar perfil
│   │   └── settings/             # Configurações
│   │
│   ├── login/                    # 🔓 Página de login
│   ├── register/                 # ✍️ Página de registro
│   ├── page.tsx                  # 🏠 Home (público)
│   ├── layout.tsx                # Layout raiz
│   └── globals.css               # Estilos globais
│
├── components/                    # 🧩 Componentes Reutilizáveis
│   ├── ui/                       # Primitivos (Button, Card, Input, etc.)
│   ├── avatar-user.tsx           # Avatar do usuário logado
│   ├── confirm-dialog.tsx        # Modal de confirmação
│   ├── currency-input.tsx        # Input com máscara de moeda
│   ├── logo.tsx                  # Logo SafeWallet
│   ├── password-input.tsx        # Input de senha com eye-toggle
│   ├── password-strength.tsx     # Indicador de força de senha
│   ├── quick-action.tsx          # Botão de ação rápida
│   ├── stat-card.tsx             # Card de estatísticas
│   ├── theme-provider.tsx        # Provedor de tema
│   └── transaction-item.tsx      # Item de transação na lista
│
├── lib/                           # 🔧 Lógica Compartilhada (SOLID)
│   ├── api.ts                    # ⚙️ Configuração Axios + Interceptadores
│   ├── auth-store.ts             # 🔐 Context de Autenticação
│   ├── wallet-store.ts           # 💰 Context de Carteira
│   ├── formatters.ts             # 🎨 Formatação de dados (moeda, data, etc.)
│   ├── utils.ts                  # 🛠️ Utilitários gerais
│   │
│   ├── constants/                # 📌 Constantes Centralizadas (SRP)
│   │   ├── emojis.ts            # 🎉 Emojis reutilizáveis por categoria
│   │   ├── endpoints.ts          # 🔗 Endpoints da API
│   │   └── index.ts              # 📦 Export centralizado
│   │
│   └── services/                 # 📡 Serviços de API (SRP)
│       ├── api-service.ts        # Chamadas HTTP por domínio
│       └── index.ts              # 📦 Export centralizado
│
├── hooks/                         # 🎣 Custom React Hooks
│   ├── use-mobile.ts             # Detecta viewport mobile
│   └── use-toast.ts              # Hook de notificações
│
├── public/                        # 📁 Arquivos Estáticos
│   └── logo.svg                  # Logo SafeWallet
│
├── .env.local                     # 🔐 Variáveis de Ambiente (LOCAL)
├── .env.production                # 🔐 Variáveis de Ambiente (PROD)
├── tailwind.config.ts             # 🎨 Configuração Tailwind
├── tsconfig.json                  # 📘 TypeScript Config
├── next.config.mjs                # ⚙️ Next.js Config
├── package.json                   # 📦 Dependências
│
├── SETUP.md                       # 📖 Guia de Configuração
└── README.md                      # 📖 Este arquivo
```

---

## 🎯 Princípios SOLID Aplicados

### 1️⃣ **Single Responsibility Principle (SRP)**
Cada arquivo/pasta cuida de **uma única responsabilidade**:
- ✅ `emojis.ts` → Apenas emojis, nada mais
- ✅ `endpoints.ts` → Apenas URLs de API
- ✅ `api-service.ts` → Apenas chamadas HTTP
- ✅ `auth-store.ts` → Apenas estado de autenticação

### 2️⃣ **Open/Closed Principle (OCP)**
Fácil estender sem modificar código existente:
- ✅ Adicionar novo endpoint? Estenda `endpoints.ts`
- ✅ Adicionar novo serviço? Crie em `services/`
- ✅ Adicionar novo emoji? Estenda `emojis.ts`

### 3️⃣ **Liskov Substitution Principle (LSP)**
Componentes são intercambiáveis:
- ✅ Qualquer componente `ui/*` pode substituir outro
- ✅ Services podem ser mockados em testes

### 4️⃣ **Interface Segregation Principle (ISP)**
Interfaces específicas para cada domínio:
- ✅ `AuthResponse` para autenticação
- ✅ `TransactionResponse` para transações
- ✅ `BalanceResponse` para carteira

### 5️⃣ **Dependency Inversion Principle (DIP)**
Depender de abstrações, não de implementações:
- ✅ Services usam `api` (abstração Axios)
- ✅ Components usam Props (injeção de dependência)
- ✅ Hooks usam Context (abstração de estado)

---

## 🔗 Integração Frontend-Backend

### Fluxo de Comunicação

```
┌─────────────────────┐
│  React Component    │
│  (ex: LoginForm)    │
└──────────┬──────────┘
           │ import { services } from '@/lib/services'
           ↓
┌─────────────────────┐
│  API Services       │
│  (api-service.ts)   │ → services.auth.login(email, password)
└──────────┬──────────┘
           │ uses endpoints
           ↓
┌─────────────────────┐
│  Endpoints Config   │
│  (endpoints.ts)     │ → '/auth/login'
└──────────┬──────────┘
           │ uses
           ↓
┌─────────────────────┐
│  Axios Client       │
│  (api.ts)           │ → POST http://localhost:8080/api/auth/login
└──────────┬──────────┘
           │ HTTP Request
           ↓
┌─────────────────────┐
│  Backend API        │
│  (Spring Boot)      │
└─────────────────────┘
```

### Configuração

Variáveis de ambiente em `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

O Axios automaticamente:
- ✅ Adiciona token JWT no header `Authorization: Bearer {token}`
- ✅ Redireciona para login se receber 401
- ✅ Captura erros globalmente

---

## 🎨 Emojis Reutilizáveis (SRP)

Todos centralizados em `lib/constants/emojis.ts`:

### Categorias

| Categoria | Emojis |
|-----------|--------|
| **Auth** | 🔓 🚪 ✍️ 🔑 📧 ✅ |
| **Transações** | 📤 📥 ➡️ 💳 👛 💰 ✔️ ❌ |
| **Navegação** | 🏠 📊 ⚙️ 👤 ❓ ℹ️ ⬅️ ➡️ |
| **Status** | 🟢 ⚫ 🟡 ✅ ❌ ⚠️ ℹ️ ⏳ |
| **Usuário** | 👤 👥 📝 📧 ⚙️ 🗑️ ✏️ |
| **Financeiro** | 🏦 🏧 🔐 💵 💯 📈 📉 |

### Uso

```typescript
// Importar categorias específicas
import { TRANSACTION_EMOJIS, AUTH_EMOJIS } from '@/lib/constants/emojis'

// Ou importar tudo
import { ALL_EMOJIS } from '@/lib/constants/emojis'

// Usar
<span>{TRANSACTION_EMOJIS.DEPOSIT}</span>      // 📤
<span>{AUTH_EMOJIS.LOGIN}</span>               // 🔓
<span>{ALL_EMOJIS.transaction.TRANSFER}</span> // ➡️
```

### Benefícios

- ✅ **Consistência visual** - Mesmos emojis em toda app
- ✅ **Fácil manutenção** - Muda um lugar, muda tudo
- ✅ **SOLID SRP** - Uma responsabilidade única
- ✅ **Type-safe** - Autocomplete no TypeScript
- ✅ **Escalável** - Adiciona novo emoji sem quebrar nada

---

## 🔐 Autenticação JWT

### Fluxo

1. **Registro** → User cria conta
2. **Login** → Backend valida e retorna JWT
3. **Armazenamento** → Token em `localStorage` com chave `token`
4. **Requisições** → Token no header `Authorization: Bearer {token}`
5. **Interceptor** → Axios adiciona automaticamente
6. **Expiração** → Se 401, redireciona para login

### Segurança

- 🔒 JWT com HMAC256
- ⏱️ TTL: 1 hora
- 🔐 Senha com BCrypt (backend)
- 🚫 Nunca armazena informações sensíveis

### Uso em Componentes

```typescript
import { useAuthStore } from '@/lib/auth-store'

export function MyComponent() {
  const { user, token, isLoading } = useAuthStore()

  return <div>Bem-vindo, {user?.name}!</div>
}
```

---

## 💰 Gerenciamento de Carteira

Context em `lib/wallet-store.ts` gerencia:
- ✅ Saldo atual
- ✅ Wallet ID
- ✅ Histórico de transações
- ✅ Refresh automático

```typescript
import { useWalletStore } from '@/lib/wallet-store'

export function WalletCard() {
  const { balance, walletId, refreshBalance } = useWalletStore()

  return (
    <div>
      <p>Saldo: R$ {balance}</p>
      <p>Carteira: {walletId}</p>
      <button onClick={refreshBalance}>Atualizar</button>
    </div>
  )
}
```

---

## 🚀 Como Iniciar

### Pré-requisitos

- Node.js 18+ e npm/pnpm
- Backend rodando em `http://localhost:8080`
- PostgreSQL iniciado via `docker-compose`

### Instalação

```bash
# Navegar para pasta frontend
cd frontend

# Instalar dependências
pnpm install

# .env.local já foi criado com valores padrão
# Verificar se está correto:
cat .env.local

# Rodar em desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

### Build para Produção

```bash
pnpm build
pnpm start

# Ou com variáveis de produção
NEXT_PUBLIC_API_URL=https://api.safewallet.com pnpm build
```

---

## 📱 Responsividade

Tailwind CSS garante experiência perfeita em todos os dispositivos:

| Breakpoint | Descrição |
|-----------|-----------|
| `mobile` | < 640px |
| `tablet` | 640px - 1024px |
| `desktop` | > 1024px |

Sidebar:
- **Desktop**: Sempre visível à esquerda
- **Tablet**: Colapsável
- **Mobile**: Menu inferior ou drawer

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /api/auth/login"
```
✅ Solução: Backend não está rodando
$ cd backend && mvn spring-boot:run
```

### Erro: "CORS error"
```
✅ Solução: Backend precisa configurar CORS
Verifique SecurityConfig.java no backend
```

### Erro: "401 Unauthorized"
```
✅ Solução: Token expirou ou é inválido
Faça login novamente em /login
```

### Erro: ".env.local not found"
```
✅ Solução: Copiar arquivo .env.local de exemplo
$ cp .env.local .env.local
$ nano .env.local  # Editar conforme necessário
```

---

## 📚 Documentação Adicional

- [SETUP.md](./SETUP.md) - Guia completo de configuração
- [Componentes UI](./components/ui/) - Biblioteca de componentes
- [API Services](./lib/services/api-service.ts) - Serviços de API
- [Constants](./lib/constants/) - Constantes centralizadas

---

## 🛠️ Stack Técnico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Next.js | 16.2.6 | Framework React full-stack |
| React | 19 | Biblioteca UI |
| TypeScript | Latest | Type safety |
| Tailwind CSS | 4 | Styling utility-first |
| Axios | 1.16.1 | HTTP client |
| React Hook Form | 7+ | Gerenciamento de forms |
| Zod | 3+ | Validação de schemas |
| React Toastify | Latest | Notificações toast |
| Lucide React | 0.564 | Ícones vectoriais |
| Radix UI | Latest | Componentes primitivos |

---

## 🎨 Design System

- **Cor Primária**: `#3B82F6` (Azul)
- **Cor de Sucesso**: `#10B981` (Verde)
- **Cor de Erro**: `#EF4444` (Vermelho)
- **Cor de Aviso**: `#F59E0B` (Laranja)
- **Font**: Inter, Segoe UI
- **Spacing**: Tailwind default
- **Radius**: Tailwind default

---

## 📄 Licença

Desenvolvido para fins educacionais e portfolio técnico.

---

**Desenvolvido com ❤️ para SafeWallet Core | 2026**
