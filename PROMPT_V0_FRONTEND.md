# 🎨 PROMPT PARA V0 - Frontend SafeWallet Core

---

## 📋 Contexto do Projeto

### O que é SafeWallet Core?

**SafeWallet Core** é um microsserviço de **carteira digital de alta criticidade** com autenticação JWT, gerenciamento de transações financeiras (depósitos, saques e transferências), arquitetura 100% Stateless e integração com PostgreSQL. É um **MVP profissional** que demonstra padrões avançados de engenharia em **Spring Boot 4.0.6 + Java 21**.

### Público-Alvo
- Usuários que desejam gerenciar carteiras digitais de forma segura
- Demonstração de portfolio técnico com **práticas cloud-native AWS**
- Foco em **segurança, escalabilidade e UX intuitiva**

### Stack Backend (Para Contexto)
- Java 21 + Spring Boot 4.0.6
- Spring Security + JWT (1 hora de TTL)
- PostgreSQL 15 + Hibernate
- BCrypt para hashing de senhas
- Transações ACID para operações financeiras

---

## 🎯 Objetivo do Frontend

Criar uma **interface minimalista, elegante e intuitiva** que permita aos usuários:
1. ✅ Registrar-se com e-mail e senha segura
2. ✅ Fazer login com autenticação JWT
3. ✅ Visualizar saldo de carteira em tempo real
4. ✅ Realizar depósitos
5. ✅ Fazer saques
6. ✅ Transferir fundos para outros usuários
7. ✅ Visualizar histórico de transações
8. ✅ Gerenciar perfil pessoal

---

## 🛠️ Stack Técnico Obrigatório

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (ou Heroicons)
- **HTTP Client**: Axios ou Fetch API nativa
- **State Management**: Context API + useState/useReducer (ou Zustand para escalabilidade)
- **Roteamento**: React Router v6
- **Validação de Formulário**: React Hook Form + Zod
- **Notificações**: React Toastify ou Sonner
- **Type Safety**: TypeScript (recomendado)

---

## 📱 Estrutura de Telas e Navegação

### 1️⃣ **Tela Home (Landing Page)**
- **Localização**: `/`
- **Acesso**: Público (sem autenticação)
- **Componentes**:
  - Header com logo SafeWallet Core + navegação (Sign In / Sign Up)
  - Hero section com proposta de valor
  - Features section com 3-4 vantagens principais
    - 🔒 Segurança com JWT e BCrypt
    - ⚡ Transações Instantâneas e ACID
    - 🌍 Escalável e Cloud-Native
    - 💰 Gerenciamento Completo de Carteira
  - Call-to-action botões (Login / Registro)
  - Footer com links úteis e informações
- **Design**: Limpo, minimalista, sem muita animação (apenas transições suaves)
- **Cores**: Primária moderna (azul/indigo) + branco + cinza neutro

---

### 2️⃣ **Tela de Registro (Sign Up)**
- **Localização**: `/register`
- **Acesso**: Público
- **Componentes**:
  - Logo SafeWallet Core no topo
  - Formulário com campos:
    - 👤 Nome completo (required, validação de comprimento)
    - 📧 E-mail (required, validação de formato)
    - 🔑 Senha (required, validação de força: mín. 8 caracteres, maiúscula, número)
    - 🔑 Confirmar Senha (required, deve coincidir)
  - Validação em tempo real com mensagens de erro claras
  - Botão "Registrar" com loading spinner
  - Link "Já tem conta? Faça login" para login
  - Tratamento de erros: e-mail duplicado, validação rejeitada
- **UX Details**:
  - Campo de senha com ícone para mostrar/ocultar
  - Progress bar de força de senha
  - Feedback visual de validação (checkmark/x icons)

---

### 3️⃣ **Tela de Login**
- **Localização**: `/login`
- **Acesso**: Público
- **Componentes**:
  - Logo SafeWallet Core no topo
  - Formulário com campos:
    - 📧 E-mail (required)
    - 🔑 Senha (required)
  - Botão "Entrar" com loading spinner
  - Link "Esqueceu a senha?" (placeholder para futura implementação)
  - Link "Não tem conta? Registre-se" para registro
  - Tratamento de erros: credenciais inválidas, servidor indisponível
- **UX Details**:
  - Campo de senha com ícone para mostrar/ocultar
  - Feedback visual claro de erros
  - Redirect automático para dashboard após login bem-sucedido
  - Armazenar JWT no localStorage ou sessionStorage

---

### 4️⃣ **Dashboard Principal (Authenticated)**
- **Localização**: `/dashboard`
- **Acesso**: Protegido (requer JWT válido)
- **Layout**: Sidebar lateral esquerda + Conteúdo principal à direita

#### **4.1 - Sidebar Esquerdo (Navegação e Perfil)**
- **Seção Superior**:
  - Logo SafeWallet Core + nome do app
  - Ícone para collapse/expand (em telas pequenas)
  
- **Seção de Perfil (Fixa no topo do sidebar)**:
  - Avatar circular com iniciais do nome
  - Nome do usuário logado (ex: "João Silva")
  - E-mail (menor, subtle)
  - Botão/ícone para ir para "Meu Perfil"
  
- **Menu de Navegação Principal**:
  - 🏠 Visão Geral / Dashboard
  - 💰 Saldo e Carteira
  - 📤 Depositar
  - 📥 Sacar
  - ➡️ Transferir
  - 📋 Histórico de Transações
  - ⚙️ Configurações
  
- **Seção Inferior**:
  - Botão "Sair" (logout) com ícone de power
  - Links rápidos: Ajuda, Documentação, Feedback

- **Design Sidebar**:
  - Cor de fundo: Branco ou cinza muito claro (#f9fafb)
  - Texto: Cinza escuro/preto
  - Hover em itens: Background suave cinza + transição
  - Item ativo: Highlight com borda esquerda de cor primária
  - Responsivo: Em mobile, converter para navbar inferior ou drawer

---

#### **4.2 - Conteúdo Principal (Dashboard)**

##### **A. Seção de Boas-vindas (Hero)**
```
┌─────────────────────────────────────┐
│ Olá, João Silva! 👋                 │
│ Bem-vindo de volta ao SafeWallet    │
│ Aqui está seu resumo de hoje        │
└─────────────────────────────────────┘
```

##### **B. Cards de Resumo (4 colunas em desktop, 2 em tablet, 1 em mobile)**

**Card 1: Saldo Atual**
- Ícone: 💳
- Valor: R$ 1.500,00 (em grande, negrito)
- Descrição: "Saldo Disponível"
- Cor: Azul/Indigo primário

**Card 2: Transações Hoje**
- Ícone: 📊
- Valor: 3 transações
- Descrição: "Operações Realizadas"
- Cor: Verde

**Card 3: Transferências Realizadas**
- Ícone: ➡️
- Valor: R$ 800,00
- Descrição: "Total Transferido"
- Cor: Laranja/Amber

**Card 4: Depósitos Recebidos**
- Ícone: 📥
- Valor: R$ 1.200,00
- Descrição: "Total Recebido"
- Cor: Roxo/Violeta

---

##### **C. Ações Rápidas (Botões em Grid 2x2)**
```
┌──────────────────┬──────────────────┐
│ 📤 Depositar     │ 📥 Sacar         │
├──────────────────┼──────────────────┤
│ ➡️ Transferir    │ 📋 Ver Histórico │
└──────────────────┴──────────────────┘
```
- Botões com ícones + texto
- Hover: Elevation (shadow) + transição suave
- Click: Navegar para tela correspondente

---

##### **D. Últimas Transações (Tabela/Lista)**
- Título: "Últimas Operações"
- Coluna 1: Data/Hora
- Coluna 2: Tipo (Depósito / Saque / Transferência)
- Coluna 3: Descrição (destino ou origem)
- Coluna 4: Valor
- Coluna 5: Saldo após transação

**Visual de Tipo**:
- Depósito: 📤 Verde
- Saque: 📥 Vermelho
- Transferência: ➡️ Azul

- Limite: Mostrar últimas 5 transações
- Botão "Ver Mais": Link para página de histórico completo

---

### 5️⃣ **Tela de Saldo e Carteira**
- **Localização**: `/wallet`
- **Componentes**:
  - Grande display do saldo atual em destaque
  - Informações da carteira:
    - Wallet ID (copiável)
    - Data de criação
    - Status (Ativo)
  - Gráfico de evolução do saldo (últimos 30 dias - opcional)
  - Botões de ação: Depositar, Sacar, Transferir

---

### 6️⃣ **Tela de Depositar**
- **Localização**: `/deposit`
- **Componentes**:
  - Formulário com campo:
    - 💰 Valor a depositar (required, validação numérica > 0)
  - Aviso: "Os fundos serão adicionados imediatamente à sua carteira"
  - Botão "Confirmar Depósito" com loading
  - Tratamento de erros de validação
  - Mensagem de sucesso com confirmação
- **UX**:
  - Input com máscara de moeda (R$)
  - Validação em tempo real
  - Confirmação antes de executar

---

### 7️⃣ **Tela de Sacar**
- **Localização**: `/withdraw`
- **Componentes**:
  - Exibir saldo disponível
  - Formulário com campo:
    - 💰 Valor a sacar (required, validação: > 0 e <= saldo)
  - Validação: "Saldo insuficiente" se necessário
  - Botão "Confirmar Saque" com loading
  - Mensagem de sucesso
- **UX**:
  - Input com máscara de moeda
  - Botão de "Sacar Tudo" (atalho)
  - Confirmação com resumo antes de executar

---

### 8️⃣ **Tela de Transferir**
- **Localização**: `/transfer`
- **Componentes**:
  - Exibir saldo disponível
  - Formulário com campos:
    - 🏪 ID da Carteira de Destino (required, validação de UUID)
    - 💰 Valor a transferir (required, validação: > 0 e <= saldo)
  - Botão "Buscar Carteira" para validação prévia (optional)
  - Validação: Carteira existe? Saldo suficiente?
  - Botão "Confirmar Transferência" com loading
  - Modal de confirmação mostrando: Destinatário, Valor, Saldo após
- **UX**:
  - Feedback visual de validação do ID da carteira
  - Confirmação com resumo antes de executar
  - Mensagem de sucesso com detalhes

---

### 9️⃣ **Tela de Histórico de Transações**
- **Localização**: `/transactions`
- **Componentes**:
  - Tabela com colunas:
    - Data/Hora (format: DD/MM/YYYY HH:mm)
    - Tipo (Depósito / Saque / Transferência com ícone)
    - Descrição (destino/origem)
    - Valor (com cor: verde + / vermelho -)
    - Saldo após transação
  - Filtros (opcional):
    - Por tipo de transação
    - Por período (últimos 7 dias, 30 dias, custom)
  - Paginação ou scroll infinito
  - Exportar como CSV (futuro)

---

### 🔟 **Tela de Perfil**
- **Localização**: `/profile`
- **Componentes**:
  - Informações pessoais (read-only ou editável):
    - Nome
    - E-mail
    - Data de criação da conta
  - Avatar com opção de upload (futuro)
  - Botão "Editar Perfil" (futuro)
  - Seção de Segurança:
    - Botão "Mudar Senha"
    - Botão "Ativar Autenticação de Dois Fatores" (futuro)
  - Botão "Deletar Conta" com confirmação

---

### 1️⃣1️⃣ **Tela de Configurações**
- **Localização**: `/settings`
- **Componentes**:
  - Preferências de Notificações
  - Tema (Light/Dark mode)
  - Idioma
  - Privacidade
  - Sobre o App

---

## 🎨 Design System e Heurísticas de UX

### Paleta de Cores
- **Primária**: `#3B82F6` (Azul vibrante, confiança)
- **Secundária**: `#10B981` (Verde, sucesso/depósito)
- **Destrutiva**: `#EF4444` (Vermelho, saque/perigo)
- **Aviso**: `#F59E0B` (Laranja, atenção)
- **Informação**: `#8B5CF6` (Roxo, informativo)
- **Background**: `#FFFFFF` ou `#F9FAFB` (Branco/Cinza muito claro)
- **Texto**: `#1F2937` (Cinza escuro, legibilidade)
- **Borders**: `#E5E7EB` (Cinza claro)

### Tipografia
- **Headings**: Font-weight 600-700 (semibold/bold)
- **Body Text**: Font-weight 400 (regular)
- **Captions**: Font-weight 500 (medium)
- **Font**: Inter, Segoe UI ou system fonts (sem serifs)

### Heurísticas Nielsen Aplicadas

1. ✅ **Visibilidade do Status do Sistema**
   - Loading spinners em operações
   - Toast notifications de sucesso/erro
   - Indicador visual do usuário logado no sidebar

2. ✅ **Match com o Mundo Real**
   - Linguagem clara e sem jargão técnico
   - Ícones intuítivos
   - Termos familiares (Saldo, Transferência, Histórico)

3. ✅ **Controle do Usuário e Liberdade**
   - Botão "Voltar" sempre visível
   - Confirmação antes de ações críticas (transferência, saque)
   - Botão de logout fácil no sidebar

4. ✅ **Padrões e Convenções**
   - Formulários seguem padrões web
   - Posicionamento padrão (logo canto esquerdo, user canto direito)
   - Cores padrão (verde=sucesso, vermelho=erro)

5. ✅ **Prevenção de Erros**
   - Validação em tempo real
   - Máscaras de input
   - Confirmação para operações críticas
   - Mensagens de erro específicas

6. ✅ **Estética Minimalista**
   - Sem poluição visual
   - Espaço em branco generoso
   - Apenas informações essenciais por tela
   - Transições suaves (200-300ms)
   - Sem animações desnecessárias

### Responsividade
- **Desktop**: Sidebar permanente + layout 4-coluna
- **Tablet**: Sidebar colapsável + layout 2-coluna
- **Mobile**: Navbar inferior + layout single-coluna

---

## 🎯 Logo SafeWallet Core

**Requisitos para a Logo**:
- Representa confiança, segurança e modernidade
- Minimalista, geometria limpa
- Funciona em escala pequena e grande
- Evitar muita complexidade
- Sugerir "carteira" ou "segurança"

**Sugestões de Conceito**:
- 🔒 Escudo minimalista com cifrão ($) ou nota
- 🏦 Cofre/Vault estilizado
- 💳 Cartão de crédito abstrato
- 🔐 Cadeado digital moderno

**Paleta de Cores da Logo**: Azul primário (#3B82F6) + branco

**Onde Usar**:
- Top-left do Header (todas as páginas públicas e autenticadas)
- Top-left do Sidebar (dashboard)
- Favicon do site
- Meta tags OG image

---

## 📡 Integração com Backend

### Base URL: `http://localhost:8080/api`

### Endpoints Críticos

```javascript
// Autenticação
POST /auth/register
  Body: { name, email, password }
  Response: { id, name, email }

POST /auth/login
  Body: { email, password }
  Response: { message, token, name }

// Transações
POST /transactions/deposit
  Headers: { Authorization: Bearer {token} }
  Body: { amount }
  Response: { message, type, amount, newBalance }

POST /transactions/withdraw
  Headers: { Authorization: Bearer {token} }
  Body: { amount }
  Response: { message, type, amount, newBalance }

POST /transactions/transfer
  Headers: { Authorization: Bearer {token} }
  Body: { destinationWalletId, amount }
  Response: { message, type, amount, newBalance }

GET /transactions/balance
  Headers: { Authorization: Bearer {token} }
  Response: { balance, walletId }

GET /transactions/my-wallet
  Headers: { Authorization: Bearer {token} }
  Response: { balance, walletId }
```

### Tratamento de Erros
- 400: Validação falhou (amount <= 0, e-mail inválido, etc.)
- 401: Não autenticado (token expirado/inválido)
- 403: Não autorizado
- 500: Erro interno do servidor
- Mostrar toast com mensagem de erro amigável

### Token Management
- Salvar JWT no localStorage com chave `token`
- Incluir em todos os requests autenticados no header `Authorization: Bearer {token}`
- Renovar token ao fazer login
- Deletar token ao fazer logout
- Redirecionar para login se receber 401

---

## 🎨 Componentes Reutilizáveis

Criar componentes base em `src/components/`:

```
components/
├── Button.tsx           # Botão com variantes: primary, secondary, danger
├── Input.tsx            # Campo de input com validação
├── Card.tsx             # Card container
├── Modal.tsx            # Modal para confirmações
├── Loading.tsx          # Spinner de loading
├── Avatar.tsx           # Avatar circular
├── Header.tsx           # Header top-level
├── Sidebar.tsx          # Sidebar navigation
├── Transaction.tsx      # Item de transação
├── BalanceCard.tsx      # Card de exibição de saldo
└── Toast.tsx            # Notificações
```

---

## 📂 Estrutura de Pastas Sugerida

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas (Home, Login, Dashboard, etc.)
├── hooks/              # Custom hooks (useAuth, useTransaction, etc.)
├── contexts/           # Context API (AuthContext, WalletContext)
├── services/           # Serviços (api, auth)
├── utils/              # Funções utilitárias (format, validate)
├── types/              # Tipos TypeScript
├── styles/             # Tailwind config e estilos globais
├── App.tsx
├── main.tsx
└── index.css
```

---

## ✨ Extras e Melhorias Futuras

- Dark mode toggle
- Gráficos de evolução do saldo
- Histórico de transações com filtros avançados
- Autenticação de dois fatores (2FA)
- Notificações push
- PWA offline-first
- Integração com QR code para transferências
- Suporte a múltiplas moedas

---

## 🎬 Resumo Final

Crie uma **interface limpa, intuitiva e moderna** que refita a qualidade profissional do backend. O foco deve ser em **facilidade de uso** sem sacrificar a **elegância visual**. Transições suaves, feedback claro e fluxos lógicos são essenciais.

**Priorize**: Funcionalidade → Responsividade → Estética

Boa sorte! 🚀
