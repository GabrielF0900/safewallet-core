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

Acompanhe a jornada visual da utilização da plataforma **SafeWallet Core**, ilustrando desde a apresentação da landing page até operações financeiras seguras no sistema em execução.

### 1️⃣ Bem-vindo à SafeWallet
A nossa Landing Page principal apresenta as vantagens de ter uma carteira digital segura e moderna.

![Home - Topo](./public/imagens-do-sistema-rodando/01-home.jpeg)

Continuando pela página, o usuário descobre mais detalhes sobre os recursos que garantem o ecossistema ACID das transações.

![Home - Detalhes](./public/imagens-do-sistema-rodando/02-home-abaixo.jpeg)

E finaliza com o rodapé institucional, garantindo a confiança do usuário.

![Home - Rodapé](./public/imagens-do-sistema-rodando/03-footer.jpeg)

### 2️⃣ Entrando na Plataforma
O usuário acessa o portal de autenticação moderno da plataforma para acessar seus recursos financeiros de forma protegida.

![Login Seguro](./public/imagens-do-sistema-rodando/04-login.jpeg)

### 3️⃣ A Criação de Novos Usuários
Caso ainda não tenha uma conta, o sistema disponibiliza um formulário de cadastro validado e reativo, já conectando com a API segura em Java. O usuário 1 e o usuário 2 (como exemplos) realizam seus cadastros.

![Cadastro - Passo 1](./public/imagens-do-sistema-rodando/05-criando-usuario-1.jpeg)

![Cadastro - Passo 2](./public/imagens-do-sistema-rodando/06-criando-usuario-2.jpeg)

### 4️⃣ A Visão Geral: O Dashboard
Após entrar no sistema, o usuário é direcionado para a sua Visão Geral. Gráficos em tempo real e um layout focado em usabilidade mostram as estatísticas da sua carteira digital.

![Dashboard Principal](./public/imagens-do-sistema-rodando/07-dashboard.jpeg)

### 5️⃣ Gestão de Carteira e Saldo
Nesta área exclusiva, o usuário pode consultar a saúde da sua conta, visualizando seu Wallet ID e seu saldo com precisão.

![Saldo e Carteira](./public/imagens-do-sistema-rodando/08-saldo-e-carteira.jpeg)

### 6️⃣ A Interface de Transações: Depositando
Para alimentar a conta recém-criada, o usuário usa o menu de depósitos de maneira intuitiva.

![Tela de Depósito](./public/imagens-do-sistema-rodando/09-depositar.jpeg)

Ao confirmar a transação, o sistema realiza a operação, persistindo-a nas tabelas e confirmando visualmente.

![Sucesso no Depósito do Usuário 1](./public/imagens-do-sistema-rodando/14-depositando-na-conta-usuario-1.jpeg)

Logo em seguida, a carteira do usuário já reflete instantaneamente o saldo abastecido.

![Carteira do Usuário 1 com Saldo](./public/imagens-do-sistema-rodando/16-carteira-do-usuario-1-com-dinheiro.jpeg)

### 7️⃣ Outras Operações: O Saque
Assim como o depósito, o usuário tem à disposição o menu de Saque para liquidar recursos.

![Tela de Saque](./public/imagens-do-sistema-rodando/10-sacar.jpeg)

Se o usuário executar um saque e o saldo for suficiente, o sistema processa de imediato.

![Confirmação de Saque](./public/imagens-do-sistema-rodando/18-saque-realizado.jpeg)

### 8️⃣ Interação P2P: O Usuário 2 entra em cena
Enquanto isso, a conta do Usuário 2 foi criada e acessada. Ele nota que sua carteira está completamente isolada e vazia, pronta para receber fundos.

![Carteira Vazia do Usuário 2](./public/imagens-do-sistema-rodando/15-carteira-do-usuario-2-vazia.jpeg)

### 9️⃣ Orquestrando uma Transferência
Com a necessidade de transferir valores para o Usuário 2, o Usuário 1 acessa o painel de transferência. Informa o Wallet ID do destinatário e o valor desejado.

![Tela de Transferência](./public/imagens-do-sistema-rodando/11-transferir.jpeg)

Ele preenche e envia o formulário...

![Processando a Transferência](./public/imagens-do-sistema-rodando/17-transferindo-para-usuario-2.jpeg)

E a confirmação instantânea da transferência é apresentada na tela. O valor saiu de sua carteira e foi injetado na conta do destino!

![Sucesso na Transferência](./public/imagens-do-sistema-rodando/19-transferido.jpeg)

### 🔟 A Chegada do Dinheiro
Imediatamente, ao visualizar o seu próprio painel, o Usuário 2 constata o aumento em seu saldo após receber os recursos do Usuário 1.

![Carteira do Usuário 2 com Dinheiro](./public/imagens-do-sistema-rodando/20-usuario-2-com-valor.jpeg)

### 1️⃣1️⃣ Transparência e Rastreabilidade
Cada movimentação no ecossistema fica gravada no histórico de transações dos usuários envolvidos, proporcionando trilha de auditoria completa (Compliance RNF).

Na tela principal do histórico, listamos as transações em formato de tabela.

![Acesso ao Menu de Histórico](./public/imagens-do-sistema-rodando/12-historico.jpeg)

Visão do histórico do Usuário 1, com saídas (transferências e saques) e entradas (depósitos).

![Histórico do Usuário 1](./public/imagens-do-sistema-rodando/22-historico-usuario-1.jpeg)

Visão do histórico do Usuário 2, atestando o recebimento da transferência.

![Histórico do Usuário 2](./public/imagens-do-sistema-rodando/21-historico-usuario-2.jpeg)

### 1️⃣2️⃣ Finalizando o Expediente
O sistema também dispõe de uma tela de Configurações, onde o usuário pode administrar seu perfil e sua sessão, mantendo suas preferências em segurança.

![Tela de Configurações](./public/imagens-do-sistema-rodando/13-configuracoes.jpeg)

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