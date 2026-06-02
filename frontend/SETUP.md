# SafeWallet Core - Configuração de Ambiente

## 🚀 Configuração do Frontend

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com as seguintes variáveis:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Ambiente (development, production)
NEXT_PUBLIC_ENV=development

# Aplicação
NEXT_PUBLIC_APP_NAME=SafeWallet Core
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 📝 Explicação de Cada Variável

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL base da API do backend | `http://localhost:8080/api` |
| `NEXT_PUBLIC_ENV` | Ambiente de execução | `development` ou `production` |
| `NEXT_PUBLIC_APP_NAME` | Nome da aplicação | `SafeWallet Core` |
| `NEXT_PUBLIC_APP_VERSION` | Versão da aplicação | `1.0.0` |

---

## 🔗 Integração com Backend

### Fluxo de Comunicação

```
Frontend (Next.js/React)
    ↓
Axios API Client (@/lib/api.ts)
    ↓
API Services (@/lib/services/api-service.ts)
    ↓
Endpoints Constants (@/lib/constants/endpoints.ts)
    ↓
Backend (Spring Boot 8080)
    ↓
Database (PostgreSQL)
```

### Como Funciona

1. **API Client** (`lib/api.ts`):
   - Configura Axios com base URL
   - Adiciona token JWT automaticamente no header `Authorization: Bearer {token}`
   - Redireciona para login se receber erro 401

2. **Endpoints** (`lib/constants/endpoints.ts`):
   - Define todas as rotas disponíveis
   - Centraliza URLs para fácil manutenção
   - Suporta rotas dinâmicas

3. **Services** (`lib/services/api-service.ts`):
   - Agrupa operações por domínio (Auth, Transaction, User, etc.)
   - Fornece métodos reutilizáveis
   - Tipo-seguro com TypeScript

### Exemplo de Uso

```typescript
import { services } from '@/lib/services/api-service'

// Login
const loginResponse = await services.auth.login('user@email.com', 'password')
// Retorna: { message: "Login efetuado com sucesso!", token: "...", name: "..." }

// Depositar
const depositResponse = await services.transaction.deposit(1000)
// Retorna: { message: "✅ Depósito realizado com sucesso!", type: "DEPOSIT", amount: 1000, newBalance: 1000 }

// Transferir
const transferResponse = await services.transaction.transfer(
  'destination-wallet-id',
  500
)
// Retorna: { message: "✅ Transferência realizada com sucesso!", type: "TRANSFER", amount: 500, newBalance: 500 }

// Obter Saldo
const balanceResponse = await services.transaction.getBalance()
// Retorna: { balance: 1500, walletId: "wallet-uuid" }
```

---

## 🛠️ Estrutura de Pastas

```
frontend/
├── app/                           # App Router (Next.js 13+)
│   ├── dashboard/                # Rotas autenticadas
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── wallet/
│   │   ├── deposit/
│   │   ├── withdraw/
│   │   ├── transfer/
│   │   ├── transactions/
│   │   ├── profile/
│   │   └── settings/
│   ├── login/
│   ├── register/
│   ├── page.tsx                  # Home (pública)
│   └── layout.tsx                # Layout raiz
│
├── components/                    # Componentes reutilizáveis
│   ├── ui/                       # Componentes primitivos (Button, Card, etc.)
│   ├── avatar-user.tsx           # Avatar do usuário
│   ├── logo.tsx                  # Logo SafeWallet
│   ├── sidebar.tsx               # Sidebar navigation
│   ├── stat-card.tsx             # Card de estatísticas
│   ├── transaction-item.tsx      # Item de transação
│   └── ...
│
├── lib/                           # Utilitários e lógica compartilhada
│   ├── api.ts                    # Configuração do Axios
│   ├── auth-store.ts             # Context de autenticação
│   ├── wallet-store.ts           # Context de carteira
│   ├── formatters.ts             # Funções de formatação
│   ├── utils.ts                  # Utilitários gerais
│   │
│   ├── constants/                # Constantes centralizadas
│   │   ├── emojis.ts            # Emojis reutilizáveis (SOLID)
│   │   └── endpoints.ts          # Endpoints da API (SOLID)
│   │
│   └── services/                 # Serviços de API
│       └── api-service.ts        # Chamadas HTTP organizadas por domínio
│
├── hooks/                         # Custom React Hooks
│   ├── use-mobile.ts             # Detecta se é mobile
│   └── use-toast.ts              # Notificações
│
├── public/                        # Arquivos estáticos
│   └── logo.svg                  # Logo SafeWallet
│
├── .env.local                     # Variáveis de ambiente (local)
├── .env.production                # Variáveis de ambiente (produção)
├── tailwind.config.ts             # Configuração Tailwind CSS
├── tsconfig.json                  # Configuração TypeScript
├── next.config.mjs                # Configuração Next.js
├── package.json                   # Dependências do projeto
└── README.md                      # Documentação
```

---

## 🔐 Autenticação e JWT

### Fluxo de Autenticação

1. **Registro**: Usuário cria conta com email e senha
2. **Login**: Backend valida credenciais e retorna JWT
3. **Armazenamento**: Token guardado em `localStorage` com chave `token`
4. **Requisições**: Token incluído no header `Authorization: Bearer {token}`
5. **Renovação**: Se token expirar (401), redireciona para login
6. **Logout**: Token removido do localStorage

### Segurança

- JWT usa algoritmo **HMAC256**
- TTL (Time To Live): **1 hora**
- Senha armazenada no backend com **BCrypt**
- Token **não inclui informações sensíveis**

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "16.2.6",              // Framework React full-stack
    "react": "^19",                // Biblioteca UI
    "tailwind": "^4",              // CSS utility-first
    "axios": "^1.16.1",            // HTTP client
    "react-hook-form": "^7",       // Gerenciamento de forms
    "zod": "^3",                   // Validação de schemas
    "react-toastify": "latest",    // Notificações
    "lucide-react": "^0.564",      // Ícones
    "@radix-ui/*": "latest"        // Componentes primitivos
  }
}
```

---

## 🚀 Como Iniciar

### Pré-requisitos

- Node.js 18+ e npm/pnpm
- Backend rodando em `http://localhost:8080`

### Instalação

```bash
cd frontend

# Instalar dependências
pnpm install

# Criar arquivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local

# Rodar em desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

### Build para Produção

```bash
pnpm build
pnpm start
```

---

## 🐛 Troubleshooting

### Erro 401 (Não Autenticado)
- Verifique se o token está sendo enviado
- Confirme se o token não expirou (TTL: 1 hora)
- Faça login novamente

### Erro 404 (Endpoint não encontrado)
- Verifique se a URL da API está correta em `.env.local`
- Confirme se o backend está rodando em `http://localhost:8080`

### CORS Error
- Backend deve ter CORS configurado
- Verifique `SecurityConfig.java` no backend

---

## 📝 Emojis Reutilizáveis (SOLID)

Todos os emojis estão centralizados em `lib/constants/emojis.ts`:

```typescript
import { TRANSACTION_EMOJIS, AUTH_EMOJIS } from '@/lib/constants/emojis'

// Uso
<span>{TRANSACTION_EMOJIS.DEPOSIT}</span> // 📤
<span>{AUTH_EMOJIS.LOGIN}</span>          // 🔓
```

Benefícios:
- ✅ Consistência visual
- ✅ Fácil manutenção
- ✅ Siga SOLID (SRP)
- ✅ Type-safe

---

## 🎨 Design System

- **Paleta Primária**: Azul (#3B82F6)
- **Sucesso**: Verde (#10B981)
- **Erro**: Vermelho (#EF4444)
- **Aviso**: Laranja (#F59E0B)
- **Font**: Inter / Segoe UI

---

**Desenvolvido com ❤️ para SafeWallet Core**
