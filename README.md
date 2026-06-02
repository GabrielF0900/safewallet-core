# SafeWallet Core

## 📋 Resumo Executivo (TL;DR)

SafeWallet Core é um **ecossistema de carteira digital completo**, englobando um microsserviço de backend de alta criticidade e uma interface web moderna. Desenvolvido para consolidar competências em **arquitetura Java avançada, React e ecossistemas Cloud-Native**. O sistema implementa um fluxo completo de gerenciamento de usuários, carteiras e transações com uma **esteira de segurança perimetral absoluta**, utilizando **Spring Security, Hashing BCrypt e tokens exclusivos Stateless JWT (JSON Web Tokens)**. O projeto adota validações rigorosas em camadas, tratamento elástico de exceções e frontend dinâmico construído com Next.js/React.

---

## 📚 Sumário de Conteúdo

1. [🎯 Problema](#-problema)
2. [✅ Solução e Diferenciais](#-solução-e-diferenciais)
3. [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
4. [📸 Demonstração do Sistema (Documentário)](#-demonstração-do-sistema-documentário)
5. [🚀 Como Executar Localmente](#-como-executar-o-ecossistema-localmente)
6. [📝 Contratos Principais da API](#-contratos-principais-da-api-endpoints)
7. [🌐 Alinhamento AWS](#-alinhamento-com-melhores-práticas-aws-cloud-native)
8. [📄 Licença](#-licença)

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
6. **Interface Web Reativa**: Um frontend moderno construído com React, garantindo experiência fluida de usuário e proteção robusta de rotas.

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Backend Core** | Java 21, Spring Boot 4.0.6 | Motor core de execução do ecossistema |
| **Segurança** | Spring Security, Auth0 Java-JWT | Controle de eclusas e assinaturas criptográficas |
| **Criptografia** | BCrypt Ciphers | Hashing e salting de senhas em repouso |
| **Persistência** | Spring Data JPA, Hibernate | Mapeamento objeto-relacional e queries automatizadas |
| **Banco de Dados** | PostgreSQL 15 | Armazenamento relacional estável e ACID |
| **Frontend** | React 19, Next.js, Tailwind CSS | Interface rica, componentizada e responsiva |
| **Integração Front/Back**| Axios, Zustand | Gerenciamento de estado global e requisições HTTP |
| **Orquestração** | Docker, Docker Compose | Isolamento total de infraestrutura |

---

## 📸 Demonstração do Sistema (Documentário)

Acompanhe a jornada completa de utilização da plataforma **SafeWallet Core**, ilustrando uma operação financeira segura de ponta a ponta entre dois usuários reais no sistema em execução.

### 1️⃣ O Início da Jornada: Registro de João
Tudo começa quando o usuário **João Silva** decide entrar para o ecossistema SafeWallet. Ele acessa a página de registro e preenche suas informações com segurança. O sistema imediatamente cria sua conta, aplica o hash BCrypt em sua senha e provisiona sua carteira digital exclusiva.

![Registro de João](./public/imagens-para-documentacao/register-joao.jpeg)

### 2️⃣ Acesso ao Painel Seguro
Com o cadastro concluído, João acessa a tela de login para validar suas credenciais. O backend confirma a assinatura e emite um passe digital (Token JWT) para proteger todas as suas próximas requisições.

![Login de João](./public/imagens-para-documentacao/login-joao.jpeg)

### 3️⃣ A Carteira Intacta
Ao entrar no seu *dashboard* pessoal, João visualiza seu saldo inicial intacto. A SafeWallet garante um isolamento absoluto; nenhuma outra entidade no sistema consegue acessar as informações financeiras mostradas em sua tela.

![Carteira Vazia de João](./public/imagens-para-documentacao/carteira-vazia-joao.jpeg)

### 4️⃣ O Primeiro Depósito
João decide adicionar fundos para começar a movimentar sua carteira. Ele acessa a funcionalidade de depósito e injeta capital no sistema. Todo o processo passa por garantias de transação (ACID) do banco de dados relacional.

![Depósito de João](./public/imagens-para-documentacao/deposito-joao.jpeg)

### 5️⃣ Confirmação de Saldo
Instantes após o depósito, a conta bancária reflete o novo montante. O sistema atualizou dinamicamente o saldo, registrando simultaneamente o histórico do depósito de forma imutável.

![Carteira de João com Dinheiro](./public/imagens-para-documentacao/carteira-joao-com-dinheiro.jpeg)

### 6️⃣ A Chegada de Maria
Enquanto João usufrui da plataforma, a usuária **Maria Santos** também realiza seu cadastro na SafeWallet. O sistema cria de maneira isolada o perímetro de Maria.

![Registro de Maria](./public/imagens-para-documentacao/register-maria.jpeg)

### 7️⃣ Autenticação de Maria
Maria faz o seu primeiro login e entra em seu ambiente pessoal protegido.

![Login de Maria](./public/imagens-para-documentacao/login-maria.jpeg)

### 8️⃣ O Ambiente Financeiro de Maria
A dashboard de Maria exibe sua carteira perfeitamente zerada. Seus dados estão completamente blindados e não têm relação com a carteira de João.

![Carteira Vazia de Maria](./public/imagens-para-documentacao/carteira-vazia-maria.jpeg)

### 9️⃣ Compartilhamento de Endereço (Wallet ID)
Para que João possa transferir dinheiro para Maria, ele solicita sua chave de recebimento. Maria acessa seu painel, copia o seu **Wallet ID único** (um UUID seguro) e compartilha com João.

![Pegando Carteira de Maria](./public/imagens-para-documentacao/pegando-carteira-de-maria.jpeg)

### 🔟 Executando a Transferência
De posse do Wallet ID de Maria, João acessa a funcionalidade de transferência em seu dashboard. Ele preenche o valor desejado, e o backend orquestra simultaneamente o saque da sua carteira e o depósito na conta de Maria. Se qualquer parte falhasse, o *rollback automático* desfazeria toda a operação.

![Transferindo para Maria](./public/imagens-para-documentacao/transferindo-para-maria.jpeg)

### 1️⃣1️⃣ Recebimento Confirmado
A mágica acontece. No momento em que Maria atualiza seu saldo, o montante enviado por João já se encontra disponível de forma segura em sua carteira. A transferência P2P foi um sucesso!

![Carteira de Maria com Dinheiro](./public/imagens-para-documentacao/carteira-de-maria-com-dinheiro-apos-transferenciaa.jpeg)

---

## 🚀 Como Executar o Ecossistema Localmente

### Pré-requisitos
- Java 21 SDK instalado
- Apache Maven configurado
- Docker & Docker Compose ativos
- Node.js e pnpm instalados

### Estrutura do Repositório
```text
safewallet/
├── backend/                  # Microsserviço Spring Boot (API REST Core)
│   ├── src/
│   ├── pom.xml
│   └── mvnw
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
   git clone https://github.com/GabrielF0900/safewallet-core.git
   cd safewallet
   ```

2. **Inicialize o Banco de Dados PostgreSQL via Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Compile e execute o Back-end (Spring Boot):**
   *É obrigatório entrar na subpasta onde reside o arquivo pom.xml para o correto gerenciamento do cache da JVM:*
   ```bash
   cd backend
   mvn clean compile spring-boot:run
   ```
   A API inicializará e estará pronta para escutar tráfego na porta padrão `http://localhost:8080`.

4. **Inicialize a Interface Front-end (React):**
   Em um novo terminal na raiz do projeto:
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```
   O painel web estará acessível em `http://localhost:5173` ou na porta disponibilizada pelo Vite/Next.

---

## 📝 Contratos Principais da API (EndPoints)

### Autenticação Perimetral (`/api/auth`)

#### 🔹 `POST /api/auth/register` — Cadastrar Novo Cliente
**Acesso:** Público (`.permitAll()`)
- **Payload de Entrada (JSON):**
  ```json
  {
    "name": "Gabriel Falcão",
    "email": "gabriel.falcao@safewallet.com",
    "password": "SenhaForte@2026"
  }
  ```
- **Payload de Resposta (`201 Created`):**
  ```json
  {
    "id": "a4a1305d-4675-4201-8486-3ef646a61e99",
    "name": "Gabriel Falcão",
    "email": "gabriel.falcao@safewallet.com"
  }
  ```

#### 🔹 `POST /api/auth/login` — Efetuar Login Autenticado
**Acesso:** Público (`.permitAll()`)
- **Payload de Entrada (JSON):**
  ```json
  {
    "email": "gabriel.falcao@safewallet.com",
    "password": "SenhaForte@2026"
  }
  ```
- **Payload de Resposta Envelopado (`200 OK`):**
  ```json
  {
    "message": "Login efetuado com sucesso!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNGExMzA1ZC...[JWT Tuncated]",
    "name": "Gabriel Falcão"
  }
  ```

---

## 🌐 Alinhamento com Melhores Práticas AWS Cloud-Native

Toda a arquitetura do software foi intencionalmente modularizada para facilitar deploys elásticos e de alta disponibilidade na nuvem da **AWS**:

- **Segurança e Proteção de Segredos**: As chaves simétricas de assinatura criptográfica mapeadas no arquivo `application.properties` são preparadas para serem sobrescritas em tempo de execução via variáveis de ambiente integradas ao **AWS Secrets Manager** dentro de tarefas do **AWS ECS Fargate**.
- **Escalabilidade Multi-AZ**: Por ser completamente Stateless, as instâncias deste microsserviço podem ser escaladas horizontalmente por um **Application Load Balancer (ALB)** em múltiplas Zonas de Disponibilidade (AZs) com risco zero de quebra de sessão.
- **Observabilidade Perimetral**: As respostas capturadas pelo `GlobalExceptionHandler` alimentam as métricas nativas do **Amazon CloudWatch Logs**, permitindo a criação de alarmes automatizados contra tentativas em massa de ataques de força bruta (*Credential Stuffing*).

---

## 📄 Licença
Projeto desenvolvido estritamente para fins educacionais, de portfólio técnico e autodesenvolvimento em arquitetura de sistemas críticos.

---
**Desenvolvido com ❤️ por Gabriel Falcão | 2026**