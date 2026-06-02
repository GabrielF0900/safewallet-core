# SafeWallet Core

## 📋 Resumo Executivo (TL;DR)

SafeWallet Core é um **microsserviço de carteira digital de alta criticidade** desenvolvido para consolidar competências em **arquitetura Java avançada e ecossistemas Cloud-Native**. O sistema implementa um fluxo completo de gerenciamento de usuários, carteiras e transações com uma **esteira de segurança perimetral absoluta**, utilizando **Spring Security, Hashing BCrypt e tokens exclusivos Stateless JWT (JSON Web Tokens)**. O projeto adota validações rigorosas em camadas, tratamento elástico de exceções e orquestração automatizada via containers Docker.

---

## 📚 Sumário de Conteúdo

1. [🎯 Problema](#-problema)
2. [✅ Solução e Diferenciais](#-solução-e-diferenciais)
3. [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
4. [📋 Requisitos Técnicos](#-requisitos-técnicos-implementados)
5. [🚀 Como Executar](#-como-executar-o-ecossistema-localmente)
6. [📝 Documentação de Testes](#-documentação-completa-de-testes)
7. [🔄 Fluxo de Transações](#-fluxo-completo-de-transações)
8. [🌐 Alinhamento AWS](#-alinhamento-com-melhores-práticas-aws-cloud-native)
9. [📄 Licença](#-licença)

---

## 🎯 Problema

Aplicações financeiras e carteiras digitais que gerenciam saldos sensíveis sofrem com vulnerabilidades críticas e gargalos de infraestrutura quando mal desenhadas:

- ❌ **Sessões Stateful pesadas**: Guardar sessões na memória RAM do servidor impede a escalabilidade horizontal e sobrecarrega a nuvem.
- ❌ **Vazamento de Senhas**: Armazenar credenciais em texto limpo ou com hashes fracos expõe os clientes a vazamentos catastróficos.
- ❌ **Falhas BOLA / IDOR**: Endpoints privados expostos sem filtros centralizados permitem que invasores interceptem requisições e manipulem dados de terceiros.
- ❌ **Vazamento de Metadados (Information Disclosure)**: Exceções internas e StackTraces não tratados expõem detalhes do banco de dados PostgreSQL para atacantes externos.

---

## ✅ Solução e Diferenciais

O ecossistema do SafeWallet Core resolve esses desafios através de padrões de arquitetura de mercado:

1. **Eclusa Perimetral Stateless (JWT)**: Autenticação baseada em chaves assimétricas compactas (RFC 7519) com tempo de vida estrito (TTL) de 1 hora. A API prova a identidade a cada requisição sem gastar memória RAM ou reter estado.

2. **Trituração de Credenciais (BCrypt)**: Aplicação do algoritmo de hashing adaptativo e salting `BCryptPasswordEncoder` para garantir que senhas originais nunca toquem o banco de dados.

3. **Filtro Customizado Interceptador (`OncePerRequestFilter`)**: Um interceptador centralizado (`SecurityFilter`) de rede que extrai, limpa os cabeçalhos `Authorization Bearer` e gerencia de forma imutável o contexto de segurança (`SecurityContextHolder`).

4. **Tratamento Resiliente de Exceções Globais**: Uma central de atendimento de falhas (`GlobalExceptionHandler`) que captura desde erros de validação do Jakarta (`@Valid`) até quebras de regras de negócio (`RuntimeException`), blindando metadados e respondendo contratos limpos.

5. **Fluxo de Transações ACID**: Operações de depósito, saque e transferência executadas dentro de transações que garantem consistência de dados e rollback automático em caso de falha.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Framework Base** | Java 21, Spring Boot 4.0.6 | Motor core de execução do ecossistema |
| **Segurança** | Spring Security, Auth0 Java-JWT | Controle de eclusas e assinaturas criptográficas |
| **Criptografia** | BCrypt Ciphers | Hashing e salting de senhas em repouso |
| **Persistência** | Spring Data JPA, Hibernate | Mapeamento objeto-relacional e queries automatizadas |
| **Banco de Dados** | PostgreSQL 15 | Armazenamento relacional estável e ACID |
| **Validação** | Jakarta Bean Validation | Restrições automáticas de borda e integridade |
| **Orquestração** | Docker, Docker Compose | Isolamento total de infraestrutura e serviços |
| **Build Tool** | Apache Maven | Gerenciamento de ciclo de vida e artefatos de código |
| **Frontend** | React 19, Vite, Node.js | Interface rica para o usuário final |

### Estrutura Real de Pacotes Java

O projeto adota uma divisão modular baseada em **SOLID (Princípio de Responsabilidade Única)** e isolamento de escopo:

```
br.com.safewallet
│
├── controllers/          # Despachantes de tráfego HTTP e envelopes ResponseEntity
│   ├── UserController.java
│   └── TransactionController.java
│
├── services/             # Casos de uso core e motores de regras de negócio
│   ├── CreateUserService.java
│   ├── AuthService.java
│   ├── TokenService.java
│   └── TransactionService.java
│
├── security/             # Componentes perimetrais e interceptadores de rede
│   ├── SecurityConfig.java
│   └── SecurityFilter.java
│
├── dto/                  # Objetos de Transferência imutáveis (Java Records)
│   ├── UserRequestDTO.java
│   ├── UserResponseDTO.java
│   ├── LoginRequestDTO.java
│   ├── LoginResponseDTO.java
│   ├── DepositRequestDTO.java
│   ├── WithdrawRequestDTO.java
│   ├── TransferRequestDTO.java
│   ├── TransactionResponseDTO.java
│   └── BalanceResponseDTO.java
│
├── entity/               # Modelagem de tabelas relacionais JPA
│   ├── UserEntity.java
│   ├── WalletEntity.java
│   ├── TransactionEntity.java
│   └── TransactionType.java (Enum)
│
├── repositories/         # Abstração física de acesso a dados (I/O)
│   ├── UserRepository.java
│   ├── WalletRepository.java
│   └── TransactionRepository.java
│
└── exceptions/           # Interceptadores globais de falhas da API
    ├── GlobalExceptionHandler.java
    └── ApiErrorMessage.java
```

---

## 📋 Requisitos Técnicos Implementados

### Funcionais (RF)

- **RF-001**: Cadastro de usuário com validação estrutural de e-mail e hashing de senha.
- **RF-002**: Autenticação de credenciais no login via verificação segura de hashes do BCrypt.
- **RF-003**: Emissão de passaportes digitais JWT auto-suficientes com claims customizadas (`email`, `name`).
- **RF-004**: Intercepção e validação criptográfica automática de tokens em endpoints privados.
- **RF-005**: Tratamento padronizado de exceções de validação e erros internos em formato JSON.
- **RF-006**: Gerenciamento automático de carteiras digitais associadas ao usuário.
- **RF-007**: Operações de depósito, saque e transferência com validação de saldo.
- **RF-008**: Rastreamento completo de transações com timestamp e tipos de operação.

### Não-Funcionais (RNF)

- **Arquitetura 100% Stateless**: Habilita o escalonamento horizontal infinito em clusters de nuvem.
- **Injeção por Construtor**: Garantia de imutabilidade de dependências e testabilidade facilitada.
- **Imutabilidade de Contratos**: Uso exclusivo de Java Records na camada de transporte de dados externa.
- **Transações ACID**: Garantia de consistência em operações financeiras.
- **Tolerância a Falhas**: Rollback automático de transações em caso de erro.

---

## 🚀 Como Executar o Ecossistema Localmente

### Pré-requisitos

- Java 21 SDK instalado
- Apache Maven configurado
- Docker & Docker Compose ativos
- Node.js e pnpm instalados
- Insomnia ou Postman para testes de API

### Estrutura do Repositório

```
safewallet/
├── backend/                  # Microsserviço Spring Boot (API REST Core)
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/                 # Interface do usuário em React
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yaml       # Orquestração do PostgreSQL local
└── README.md
```

### Passo a Passo de Inicialização

1. **Clone o repositório e navegue até a raiz:**

```bash
git clone https://github.com/GabrielF0900/safewallet-core.git
cd safewallet
```

2. **Inicialize o Banco de Dados PostgreSQL via Docker Compose:**

```bash
docker-compose up -d
```

3. **Compile e execute o Back-end (Spring Boot):**

```bash
cd backend
mvn clean compile spring-boot:run
```

A API inicializará e estará pronta para escutar tráfego na porta padrão `http://localhost:8080`.

4. **Inicialize a Interface Front-end (React):**

```bash
cd ../frontend
pnpm install
pnpm run dev
```

O painel web estará acessível em `http://localhost:5173`.

---

## 📝 Documentação Completa de Testes

Esta seção demonstra o **fluxo completo de testes** do sistema com evidências capturadas via Insomnia. O teste valida o ciclo de vida de autenticação, gerenciamento de carteiras e transações financeiras.

### 🎯 Cenário de Teste

**Objetivo**: Criar dois usuários, verificar saldos iniciais, realizar um depósito, executar uma transferência entre contas e validar saldos finais.

**Atores**:
- João Silva (Usuário 1 - Remetente)
- Maria Santos (Usuário 2 - Destinatário)

---

## 🔄 Fluxo Completo de Transações

### PASSO 1️⃣: Registrar Usuário 1 (João Silva)

**Endpoint**: `POST /api/auth/register`

**Objetivo**: Criar conta de João Silva com credenciais seguras.

**Request**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response** (201 Created):
```json
{
  "id": "701d4d979-7989-4999-bcfe-5a2c7d335933",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Screenshot do Teste**:

![Registro João Silva](./public/imagens-para-documentacao/register-joao.jpeg)

**Análise**:
- ✅ Status 201 CREATED retornado com sucesso
- ✅ UUID único gerado para João (`701d4d979-7989-4999-bcfe-5a2c7d335933`)
- ✅ Carteira digital criada automaticamente no backend
- ✅ Senha hasheada com BCrypt (não armazenada em texto limpo)

---

### PASSO 2️⃣: Registrar Usuário 2 (Maria Santos)

**Endpoint**: `POST /api/auth/register`

**Objetivo**: Criar conta de Maria Santos com credenciais seguras.

**Request**:
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha456"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Maria Santos",
  "email": "maria@example.com"
}
```

**Screenshot do Teste**:

![Registro Maria Santos](./public/imagens-para-documentacao/register-maria.jpeg)

**Análise**:
- ✅ Segundo usuário registrado com sucesso
- ✅ UUID único gerado para Maria (`550e8400-e29b-41d4-a716-446655440001`)
- ✅ Carteira isolada criada para Maria
- ✅ Validação de unicidade de e-mail funcionando

---

### PASSO 3️⃣: Login de João Silva

**Endpoint**: `POST /api/auth/login`

**Objetivo**: Autenticar João e obter JWT para operações futuras.

**Request**:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MDE0ZDk3OS03OTg5LTQ5OTktYmNmZS01YTJjN2QzMzU5MzMiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJuYW1lIjoiSm/Do28gU2lsdmEiLCJleHAiOjE3ODA0MzE4Mzh9.xyz123...",
  "name": "João Silva"
}
```

**Screenshot do Teste**:

![Login João](./public/imagens-para-documentacao/login-joao.jpeg)

**Análise**:
- ✅ JWT gerado com sucesso (válido por 1 hora)
- ✅ Token contém claims: `sub` (userId), `email`, `name`, `exp` (expiração)
- ✅ Verificação de hash BCrypt realizada automaticamente
- ✅ Token pronto para uso em requisições protegidas

---

### PASSO 4️⃣: Verificar Saldo Inicial de João

**Endpoint**: `GET /transactions/balance`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Objetivo**: Consultar saldo inicial de João (deverá ser R$ 0,00).

**Response** (200 OK):
```json
{
  "balance": 0.00,
  "walletId": "a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d"
}
```

**Screenshot do Teste**:

![Saldo Vazio João](./public/imagens-para-documentacao/carteira-vazia-joao.jpeg)

**Análise**:
- ✅ Token JWT validado com sucesso
- ✅ SecurityFilter extraiu userId do token
- ✅ Carteira encontrada e saldo consultado
- ✅ Saldo inicial = R$ 0,00 (esperado para nova conta)
- ✅ WALLET ID retornado: `a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d`

---

### PASSO 5️⃣: Login de Maria Santos

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "maria@example.com",
  "password": "senha456"
}
```

**Response** (200 OK):
```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDEiLCJlbWFpbCI6Im1hcmlhQGV4YW1wbGUuY29tIiwibmFtZSI6Ik1hcmlhIFNhbnRvcyIsImV4cCI6MTc4MDQzMTgzOH0.abc123...",
  "name": "Maria Santos"
}
```

**Screenshot do Teste**:

![Login Maria](./public/imagens-para-documentacao/login-maria.jpeg)

**Análise**:
- ✅ Autenticação de Maria bem-sucedida
- ✅ JWT único gerado para Maria
- ✅ Claims contêm dados corretos de Maria
- ✅ Token salvo para operações futuras

---

### PASSO 6️⃣: Verificar Saldo Inicial de Maria

**Endpoint**: `GET /transactions/balance`

**Headers**:
```
Authorization: Bearer (token de Maria)
```

**Response** (200 OK):
```json
{
  "balance": 0.00,
  "walletId": "b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c"
}
```

**Screenshot do Teste**:

![Saldo Vazio Maria](./public/imagens-para-documentacao/carteira-vazia-maria.jpeg)

**Análise**:
- ✅ Token de Maria validado corretamente
- ✅ Carteira de Maria isolada de João
- ✅ Saldo inicial = R$ 0,00 (esperado)
- ✅ WALLET ID de Maria: `b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c`

---

### PASSO 7️⃣: Depósito na Conta de João (R$ 1.000,00)

**Endpoint**: `POST /transactions/deposit`

**Headers**:
```
Authorization: Bearer (token de João)
```

**Request**:
```json
{
  "amount": 1000.00
}
```

**Response** (200 OK):
```json
{
  "message": "✅ Depósito realizado com sucesso!",
  "type": "DEPOSIT",
  "amount": 1000.00,
  "newBalance": 1000.00
}
```

**Screenshot do Teste**:

![Depósito João](./public/imagens-para-documentacao/deposito-joao.jpeg)

**Análise**:
- ✅ Transação de depósito processada dentro de `@Transactional`
- ✅ Saldo de João atualizado: R$ 1.000,00
- ✅ Registro de transação criado no histórico
- ✅ Resposta amigável com confirmação
- ✅ Validação: `amount > 0` passou com sucesso

---

### PASSO 8️⃣: Verificar Saldo de João Após Depósito

**Endpoint**: `GET /transactions/balance`

**Headers**:
```
Authorization: Bearer (token de João)
```

**Response** (200 OK):
```json
{
  "balance": 1000.00,
  "walletId": "a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d"
}
```

**Screenshot do Teste**:

![Saldo João com Dinheiro](./public/imagens-para-documentacao/carteira-joao-com-dinheiro.jpeg)

**Análise**:
- ✅ Saldo atualizado corretamente: R$ 1.000,00
- ✅ Persistência no PostgreSQL confirmada
- ✅ Transação aplicada com sucesso
- ✅ Estado da carteira reflete operação anterior

---

### PASSO 9️⃣: Obter WALLET ID de Maria (Pré-requisito para Transferência)

**Endpoint**: `GET /transactions/my-wallet`

**Headers**:
```
Authorization: Bearer (token de Maria)
```

**Response** (200 OK):
```json
{
  "balance": 0.00,
  "walletId": "b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c"
}
```

**Screenshot do Teste**:

![Pegando Carteira de Maria](./public/imagens-para-documentacao/pegando-carteira-de-maria.jpeg)

**⚠️ Observação Importante**:
- O **USER ID** (retornado no registro) é diferente do **WALLET ID**
- Para transferências, usar sempre o **WALLET ID**, não o USER ID
- WALLET ID é gerado automaticamente quando o usuário é criado

**Análise**:
- ✅ Endpoint retorna corretamente o WALLET ID
- ✅ WALLET ID = `b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c`
- ✅ Saldo verificado: R$ 0,00 (ainda sem dinheiro)

---

### PASSO 🔟: Transferência de João para Maria (R$ 500,00)

**Endpoint**: `POST /transactions/transfer`

**Headers**:
```
Authorization: Bearer (token de João)
```

**Request**:
```json
{
  "destinationWalletId": "b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c",
  "amount": 500.00
}
```

**Response** (200 OK):
```json
{
  "message": "✅ Transferência realizada com sucesso!",
  "type": "TRANSFER",
  "amount": 500.00,
  "newBalance": 500.00
}
```

**Screenshot do Teste**:

![Transferência para Maria](./public/imagens-para-documentacao/transferindo-para-maria.jpeg)

**Análise**:
- ✅ Validação de saldo realizada: João tinha R$ 1.000,00 e tentou transferir R$ 500,00 ✔️
- ✅ Carteira de destino (Maria) existe e foi encontrada
- ✅ Saldo de João decrementado: R$ 1.000,00 - R$ 500,00 = R$ 500,00
- ✅ Saldo de Maria incrementado: R$ 0,00 + R$ 500,00 = R$ 500,00
- ✅ Ambas as operações executadas dentro de uma transação ACID
- ✅ Registro de transação criado com tipo `TRANSFER`

---

### PASSO 1️⃣1️⃣: Verificar Saldo Final de Maria (Após Transferência)

**Endpoint**: `GET /transactions/balance`

**Headers**:
```
Authorization: Bearer (token de Maria)
```

**Response** (200 OK):
```json
{
  "balance": 500.00,
  "walletId": "b8d0f6a3-7c4e-5f9b-a2d1-9e6c8f4a5b2c"
}
```

**Screenshot do Teste**:

![Saldo Maria com Dinheiro](./public/imagens-para-documentacao/carteira-de-maria-com-dinheiro-apos-transferenciaa.jpeg)

**Análise**:
- ✅ Saldo de Maria atualizado: R$ 500,00 (recebido de João)
- ✅ Transferência confirmada com sucesso
- ✅ Persistência no PostgreSQL validada
- ✅ Estado final: Maria agora possui R$ 500,00

---

## 📊 Resumo Final das Operações

| Usuário | Operação | Valor | Saldo Anterior | Saldo Posterior |
|---------|----------|-------|-----------------|-----------------|
| **João** | Registro | - | - | -Criado- |
| **Maria** | Registro | - | - | -Criado- |
| **João** | Depósito | +R$ 1.000,00 | R$ 0,00 | R$ 1.000,00 |
| **Maria** | (Recebimento) | +R$ 500,00 | R$ 0,00 | R$ 500,00 |
| **João** | Transferência | -R$ 500,00 | R$ 1.000,00 | R$ 500,00 |
| **Maria** | Saldo Final | - | R$ 500,00 | R$ 500,00 ✅ |

---

## 🔒 Mecanismos de Segurança Validados

### ✅ Autenticação JWT

- Token gerado com algoritmo HMAC256
- Claims customizadas: `sub` (userId), `email`, `name`
- TTL de 1 hora (3600000 ms)
- Validação automática em endpoints protegidos

### ✅ Autorização e Isolamento de Dados

- SecurityFilter intercepta todas as requisições
- Apenas usuários autenticados acessam `/transactions/*`
- Cada usuário só vê dados da sua própria carteira
- Validação de propriedade antes de operações

### ✅ Criptografia de Senhas

- BCrypt com salting automático
- Verificação de hash na autenticação
- Senhas nunca armazenadas em texto limpo
- Resistência contra ataques de força bruta

### ✅ Tratamento de Exceções

- GlobalExceptionHandler captura erros
- Responses padronizadas em JSON
- Mensagens de erro amigáveis
- StackTraces não expostos para externos

---

## 🌐 Alinhamento com Melhores Práticas AWS Cloud-Native

Toda a arquitetura do software foi intencionalmente modularizada para facilitar deploys elásticos e de alta disponibilidade na nuvem da **AWS**:

### 🏆 Segurança e Proteção de Segredos

- Chaves simétricas de assinatura mapeadas em `application.properties`
- Preparado para substituição via **AWS Secrets Manager**
- Integração com tarefas do **AWS ECS Fargate**
- Variáveis de ambiente seguras em tempo de execução

### 🏆 Escalabilidade Multi-AZ

- Arquitetura **100% Stateless** garante escalabilidade horizontal infinita
- Instâncias podem ser escaladas por **Application Load Balancer (ALB)**
- Múltiplas Zonas de Disponibilidade (AZs) com risco zero de quebra de sessão
- Transações ACID garantem consistência distribuída

### 🏆 Observabilidade Perimetral

- Respostas capturadas por `GlobalExceptionHandler`
- Métricas nativas do **Amazon CloudWatch Logs**
- Alarmes automatizados contra ataques de força bruta
- Telemetria completa de operações financeiras

### 🏆 Resiliência

- Rollback automático de transações
- Tratamento de falhas em cascata
- Circuit breaker pronto para implementação
- Logging centralizado para auditoria

---

## 📄 Licença

Projeto desenvolvido estritamente para fins educacionais, de portfólio técnico e autodesenvolvimento em arquitetura de sistemas críticos.

---

**Desenvolvido com ❤️ por Gabriel Falcão | 2026**

## 🚀 Como Executar o Ecossistema Localmente

### Pré-requisitos
- Java 21 SDK instalado
- Apache Maven configurado
- Docker & Docker Compose ativos
- Node.js e pnpm instalados

### Estrutura do Repositório
```

safewallet/
├── backend/                  # Microsserviço Spring Boot (API REST Core)
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/                 # Interface do usuário em React
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yaml       # Orquestração do PostgreSQL local
└── README.md

```
### Passo a Passo de Inicialização

1. **Clone o repositório e navegue até a raiz:**
   ```bash
   git clone - cd safewallet
```

1. **Inicialize o Banco de Dados PostgreSQL via Docker Compose:**Bash
```
docker-compose up -d
```
2. **Compile e execute o Back-end (Spring Boot):**
*É obrigatório entrar na subpasta onde reside o arquivo pom.xml para o correto gerenciamento do cache da JVM:*Bash
```
cd backend
mvn clean compile spring-boot:run
```
A API inicializará e estará pronta para escutar tráfego na porta padrão `http://localhost:8080`.
3. **Inicialize a Interface Front-end (React):**Bash
```
cd ../frontend
pnpm install
pnpm run dev
```
O painel web estará acessível em `http://localhost:5173`.

## 📝 Contratos Principais da API (EndPoints)

### Autenticação Perimetral (`/api/auth`)

#### 🔹 `POST /api/auth/register` — Cadastrar Novo Cliente
**Acesso:** Público (`.permitAll()`)
- **Payload de Entrada (JSON):**JSON
```
{
  "name": "Gabriel Falcão",
  "email": "gabriel.falcao@safewallet.com",
  "password": "SenhaForte@2026"
}
```
- **Payload de Resposta (`201 Created`):**JSON
```
{
  "id": "a4a1305d-4675-4201-8486-3ef646a61e99",
  "name": "Gabriel Falcão",
  "email": "gabriel.falcao@safewallet.com"
}
```

#### 🔹 `POST /api/auth/login` — Efetuar Login Autenticado

- **Acesso:** Público (`.permitAll()`)
- **Payload de Entrada (JSON):**JSON
```
{
  "email": "gabriel.falcao@safewallet.com",
  "password": "SenhaForte@2026"
}
```
- **Payload de Resposta Envelopado (`200 OK`):**JSON
```
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNGExMzA1ZC...[JWT Tuncated]",
  "name": "Gabriel Falcão"
}
```

## 🌐 Alinhamento com Melhores Práticas AWS Cloud-Native
Toda a arquitetura do software foi intencionalmente modularizada para facilitar deploys elásticos e de alta disponibilidade na nuvem da **AWS**:

- **Segurança e Proteção de Segredos**: As chaves simétricas de assinatura criptográfica mapeadas no arquivo `application.properties` são preparadas para serem sobrescritas em tempo de execução via variáveis de ambiente integradas ao **AWS Secrets Manager** dentro de tarefas do **AWS ECS Fargate**.
- **Escalabilidade Multi-AZ**: Por ser completamente Stateless, as instâncias deste microsserviço podem ser escaladas horizontalmente por um **Application Load Balancer (ALB)** em múltiplas Zonas de Disponibilidade (AZs) com risco zero de quebra de sessão.
- **Observabilidade Perimetral**: As respostas capturadas pelo `GlobalExceptionHandler` alimentam as métricas nativas do **Amazon CloudWatch Logs**, permitindo a criação de alarmes automatizados contra tentativas em massa de ataques de força bruta (*Credential Stuffing*).

## 📄 Licença
Projeto desenvolvido estritamente para fins educacionais, de portfólio técnico e autodesenvolvimento em arquitetura de sistemas críticos.
