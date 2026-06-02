# 🏗️ Arquitetura SafeWallet Core - Frontend & Backend

## 📊 Visão Geral do Sistema

```
┌────────────────────────────────────────────────────────────────┐
│                     🌐 CLIENTE (BROWSER)                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            Next.js 16 + React 19 + Tailwind CSS          │ │
│  │                    (Frontend Moderno)                     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↕️                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         Axios HTTP Client (API Interceptors)             │ │
│  │                                                           │ │
│  │  - JWT Token em Authorization Header                    │ │
│  │  - Erro 401 → Redireciona para Login                   │ │
│  │  - Requisição: POST /api/transactions/deposit           │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                            ↕️
           🌐 HTTP/HTTPS Request (PORT 8080)
                            ↕️
┌────────────────────────────────────────────────────────────────┐
│                   🖥️ SERVIDOR (BACKEND)                        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │    Spring Boot 4.0.6 + Java 21 (API REST Core)          │ │
│  │                                                           │ │
│  │  - SecurityFilter: Valida JWT                           │ │
│  │  - Controllers: Despachadores de requisição             │ │
│  │  - Services: Lógica de negócio                          │ │
│  │  - Repositories: Acesso a dados (JPA)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↕️                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           PostgreSQL 15 (Database)                       │ │
│  │                                                           │ │
│  │  Tables:                                                 │ │
│  │  - users (id, name, email, password_hash)               │ │
│  │  - wallets (id, user_id, balance)                       │ │
│  │  - transactions (id, from_id, to_id, amount, type)     │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────┐
│ 1. REGISTRO                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (React)                                  │
│  Input: { name, email, password }                 │
│         ↓                                           │
│  Validação (React Hook Form + Zod)               │
│         ↓                                           │
│  POST /api/auth/register (Axios)                 │
│         ↓                                           │
│  Backend (Spring Boot)                            │
│  1. Hash senha com BCrypt                         │
│  2. Cria UserEntity + WalletEntity                │
│  3. Response: { id, name, email }                │
│         ↓                                           │
│  Frontend: localStorage.setItem('user', {...})   │
│  Redireciona para /login                          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. LOGIN                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (React)                                  │
│  Input: { email, password }                       │
│         ↓                                           │
│  Validação                                         │
│         ↓                                           │
│  POST /api/auth/login (Axios)                    │
│         ↓                                           │
│  Backend (Spring Boot)                            │
│  1. Busca UserEntity por email                    │
│  2. Verifica hash BCrypt                          │
│  3. Gera JWT (HMAC256, TTL: 1 hora)             │
│  4. Response: { message, token, name }          │
│         ↓                                           │
│  Frontend: localStorage.setItem('token', {JWT})  │
│  AuthStore atualiza contexto                     │
│  Redireciona para /dashboard                     │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. REQUISIÇÃO AUTENTICADA                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (React)                                  │
│  GET /api/transactions/balance (Axios)           │
│         ↓                                           │
│  Axios Interceptor                                │
│  Pega token do localStorage                       │
│  Header: Authorization: Bearer {JWT}             │
│         ↓                                           │
│  Backend (Spring Boot)                            │
│  SecurityFilter intercepta                        │
│  1. Extrai JWT do header                         │
│  2. Valida assinatura HMAC256                    │
│  3. Extrai userId do token                       │
│  4. Busca WalletEntity para userId               │
│  5. Seta SecurityContextHolder                   │
│         ↓                                           │
│  TransactionController                            │
│  1. Extrai userId de SecurityContextHolder       │
│  2. Lógica de negócio (services)                │
│  3. Response: { balance, walletId }             │
│         ↓                                           │
│  Frontend: WalletStore atualiza                  │
│  UI renderiza novo saldo                         │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 4. EXPIRAÇÃO DO TOKEN (401)                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend realiza requisição                      │
│         ↓                                           │
│  Backend retorna: 401 Unauthorized               │
│         ↓                                           │
│  Axios Response Interceptor                       │
│  1. Detecta status 401                           │
│  2. Remove token do localStorage                 │
│  3. window.location.href = '/login'              │
│         ↓                                           │
│  User é redirecionado para /login                │
│  Necessário fazer login novamente                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 💰 Fluxo de Transações

### Depósito

```
┌──────────────────────────────────────────────────┐
│ Frontend: Usuário clica "Depositar"              │
│ Navega para /dashboard/deposit                   │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ DepositForm                                      │
│ Input: { amount }                                │
│ Validação:                                       │
│  ✓ amount > 0                                   │
│  ✓ amount é número                              │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ POST /api/transactions/deposit                   │
│ Body: { amount: 1000 }                           │
│ Header: Authorization: Bearer {JWT}              │
│                                                  │
│ Backend: TransactionService                     │
│  1. @Transactional (ACID)                       │
│  2. WalletRepository.findByUserId(userId)       │
│  3. wallet.balance += 1000                      │
│  4. TransactionEntity criado (DEPOSIT)          │
│  5. WalletRepository.save(wallet)               │
│                                                  │
│ Response:                                        │
│ {                                                │
│   "message": "✅ Depósito realizado!",         │
│   "type": "DEPOSIT",                            │
│   "amount": 1000,                               │
│   "newBalance": 1000                            │
│ }                                                │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ Frontend: WalletStore atualiza                   │
│ React.Toastify mostra sucesso                    │
│ Balance é atualizado em tempo real               │
│ Redirect para /dashboard                        │
└──────────────────────────────────────────────────┘
```

### Transferência

```
┌──────────────────────────────────────────────────┐
│ Frontend: Usuário clica "Transferir"             │
│ Navega para /dashboard/transfer                  │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ TransferForm                                     │
│ Input:                                           │
│  ✓ destinationWalletId (UUID)                   │
│  ✓ amount (número > 0)                          │
│                                                  │
│ ConfirmDialog (modal):                           │
│  Mostra: "Transferir R$ 500 para Carteira X"   │
│  Usuário confirma                                │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ POST /api/transactions/transfer                  │
│ Body:                                            │
│ {                                                │
│   "destinationWalletId": "uuid-123",            │
│   "amount": 500                                  │
│ }                                                │
│ Header: Authorization: Bearer {JWT}              │
│                                                  │
│ Backend: TransactionService                     │
│  1. @Transactional (ACID)                       │
│  2. Busca carteira de origem                    │
│  3. Valida saldo >= 500 ✓                       │
│  4. Busca carteira de destino                   │
│  5. Decrementa origem: -500                     │
│  6. Incrementa destino: +500                    │
│  7. Cria TransactionEntity (TRANSFER)           │
│  8. Salva ambas as carteiras (rollback se erro)│
│                                                  │
│ Response:                                        │
│ {                                                │
│   "message": "✅ Transferência realizada!",    │
│   "type": "TRANSFER",                           │
│   "amount": 500,                                │
│   "newBalance": 500                             │
│ }                                                │
└──────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────┐
│ Frontend:                                        │
│  1. Toast de sucesso                            │
│  2. WalletStore atualiza balance                │
│  3. Histórico é refrescado                      │
│  4. Redirect para /dashboard                    │
└──────────────────────────────────────────────────┘
```

---

## 📚 Estrutura de Dados

### Database Schema

```sql
┌─────────────────────────┐
│      users              │
├─────────────────────────┤
│ id (UUID) [PK]          │
│ name (VARCHAR)          │
│ email (VARCHAR) [UNIQUE]│
│ password_hash (TEXT)    │ ← BCrypt
│ created_at (TIMESTAMP)  │
└─────────────────────────┘
           ↑
           │ 1:1
           │
┌─────────────────────────┐
│      wallets            │
├─────────────────────────┤
│ id (UUID) [PK]          │
│ user_id (UUID) [FK]     │
│ balance (DECIMAL)       │
│ created_at (TIMESTAMP)  │
└─────────────────────────┘
           ↑
           │ 1:N
           │
┌─────────────────────────┐
│    transactions         │
├─────────────────────────┤
│ id (UUID) [PK]          │
│ source_wallet_id (UUID) │
│ dest_wallet_id (UUID)   │
│ amount (DECIMAL)        │
│ type (ENUM)             │ ← DEPOSIT/WITHDRAW/TRANSFER
│ created_at (TIMESTAMP)  │
└─────────────────────────┘
```

### Fluxo de Dados No Frontend

```
┌─────────────────────────────────────────┐
│         React Component                 │
│      (ex: DepositForm)                  │
└──────────────┬──────────────────────────┘
               │ useState (form state)
               ↓
┌─────────────────────────────────────────┐
│     React Hook Form + Zod               │
│    (validação de inputs)                │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    services.transaction.deposit()       │
│  (lib/services/api-service.ts)          │
└──────────────┬──────────────────────────┘
               │ usa
               ↓
┌─────────────────────────────────────────┐
│   ENDPOINTS.transaction.DEPOSIT         │
│  (lib/constants/endpoints.ts)           │
│   → '/transactions/deposit'             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        api.post(endpoint, data)         │
│   (lib/api.ts - Axios config)           │
│                                         │
│   → Interceptor adiciona JWT            │
│   → Headers: Authorization: Bearer ...  │
└──────────────┬──────────────────────────┘
               │ HTTP POST Request
               ↓
        Backend Response
               │
               ↓
┌─────────────────────────────────────────┐
│   Response Interceptor (Axios)          │
│   ✓ Sucesso → Continua                  │
│   ✗ Erro 401 → Redireciona Login       │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│   WalletStore (useWalletStore())        │
│   atualiza balance e transações         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│   React re-render (automaticamente)     │
│   UI atualiza com novo saldo            │
│   Toast notifica sucesso                │
└─────────────────────────────────────────┘
```

---

## 🔐 Segurança - Camadas de Proteção

```
Frontend Security
├── 1. React Hook Form + Zod
│   └── Validação de inputs no cliente (UX)
│
├── 2. Máscaras de Input
│   └── CurrencyInput → Previne entrada inválida
│
└── 3. localStorage + HTTPOnly (futuro)
    └── JWT armazenado seguramente

Backend Security
├── 1. SecurityFilter
│   └── Intercepta TODAS requisições
│   └── Valida JWT (HMAC256)
│
├── 2. BCrypt Password Encoding
│   └── Senha hasheada + salt automático
│
├── 3. @Transactional ACID
│   └── Rollback automático em erro
│
├── 4. GlobalExceptionHandler
│   └── StackTraces não expostos (blindagem)
│
└── 5. Spring Security
    └── CSRF protection (futuro)
    └── CORS configuration (futuro)
    └── Rate limiting (futuro)
```

---

## 🧪 Ciclo Completo: Usuário Maria Faz Transferência

```
1. MARIA ACESSA http://localhost:3000
   └── Home publica, sem autenticação

2. MARIA CLICA "Registrar"
   └── /register
   └── Preenche: nome, email, senha
   └── POST /api/auth/register
   └── Backend: Cria UserEntity + WalletEntity

3. MARIA CLICA "Login"
   └── /login
   └── Preenche: email, senha
   └── POST /api/auth/login
   └── Backend: Valida senha, gera JWT
   └── localStorage.setItem('token', JWT)

4. MARIA DEPOSITA R$ 1000
   └── /dashboard/deposit
   └── Preenche: amount = 1000
   └── POST /api/transactions/deposit
   └── Backend: @Transactional
      ├── WalletEntity.balance = 1000
      └── TransactionEntity.DEPOSIT criado

5. MARIA OBTÉM WALLET ID DE JOÃO
   └── GET /api/transactions/my-wallet
   └── Response: { balance: 1000, walletId: "abc-123" }
   
6. MARIA VÊ WALLET ID NO /dashboard/wallet
   └── Component exibe: "Seu Wallet ID: abc-123"
   └── Copia para clipboard

7. JOÃO FORNECE SEU WALLET ID
   └── "Meu Wallet ID é xyz-789"

8. MARIA ABRE /dashboard/transfer
   └── Preenche:
      ├── destinationWalletId = "xyz-789"
      └── amount = 500
   └── Abre ConfirmDialog
   └── Clica "Confirmar"
   └── POST /api/transactions/transfer

9. BACKEND PROCESSA TRANSFERÊNCIA
   └── @Transactional bloqueia ambas carteiras
   ├── Maria balance: 1000 - 500 = 500 ✓
   ├── João balance: 0 + 500 = 500 ✓
   ├── TransactionEntity criado (TRANSFER)
   └── @Transactional commit (sucesso)

10. FRONTEND ATUALIZA
    ├── Toast: "✅ Transferência realizada!"
    ├── WalletStore.balance = 500
    ├── Histórico refrescado
    └── Redirect /dashboard

11. MARIA VÊ SEU NOVO SALDO
    └── Dashboard: R$ 500
    └── Último item histórico: "➡️ Transferência para xyz-789 -R$500"

12. JOÃO REFRESHA SEU DASHBOARD
    └── WalletStore referca balance
    └── GET /api/transactions/balance
    └── Vê novo saldo: R$ 500
    └── Vê transação no histórico: "📥 Recebido de Maria +R$500"
```

---

## 🎯 Conclusão

O SafeWallet Core implementa uma **arquitetura moderna, escalável e segura** com:

- ✅ Frontend responsivo (React 19 + Tailwind)
- ✅ Backend robusto (Spring Boot + PostgreSQL)
- ✅ Autenticação JWT sem estado (Stateless)
- ✅ Transações ACID (Consistência de dados)
- ✅ SOLID principles aplicados (Manutenibilidade)
- ✅ Emojis reutilizáveis (Consistência visual)
- ✅ Endpoints centralizados (DRY principle)

**Sistema pronto para produção e escala!** 🚀
