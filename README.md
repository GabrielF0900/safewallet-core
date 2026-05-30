# SafeWallet Core

## 📋 Resumo Executivo (TL;DR)

SafeWallet Core é um **microsserviço de carteira digital de alta criticidade** desenvolvido para consolidar competências em **arquitetura Java avançada e ecossistemas Cloud-Native**. O sistema implementa um fluxo completo de gerenciamento de usuários, cartões corporativos e uma **esteira de segurança perimetral absoluta**, utilizando **Spring Security, Hashing BCrypt e tokens eclusivos Stateless JWT (JSON Web Tokens)**. O projeto adota validações rigorosas em camadas, tratamento elástico de exceções e orquestração automatizada via containers Docker.

---

## 🎯 Problema

Aplicações financeiras e carteiras digitais que gerenciam saldos e cartões sensíveis sofrem com vulnerabilidades críticas e gargalos de infraestrutura quando mal desenhadas:

- ❌ **Sessões Stateful pesadas**: Guardar sessões na memória RAM do servidor impede a escalabilidade horizontal e sobrecarrega a nuvem.
- ❌ **Vazamento de Senhas**: Armazenar credenciais em texto limpo ou com hashes fracos expõe os clientes a vazamentos catastróficos.
- ❌ **Falhas BOLA / IDOR**: Endpoints privados expostos sem filtros centralizados permitem que invasores interceptem requisições e manipulem dados de terceiros.
- ❌ **Vazamento de Metadados (Information Disclosure)**: Exceções internas e StackTraces não tratados expõem detalhes do banco de dados PostgreSQL para atacantes externos.

---

## ✅ Solução e Diferenciais de Engenharia

O ecossistema do SafeWallet Core resolve esses desafios através de padrões de arquitetura de mercado:

1. **Eclusa Perimetral Stateless (JWT)**: Autenticação baseada em chaves assimétricas compactas (RFC 7519) com tempo de vida estrito (TTL) de 1 hora. A API prova a identidade a cada requisição sem gastar memória RAM ou reter estado.
2. **Trituração de Credenciais (BCrypt)**: Aplicação do algoritmo de hashing adaptativo e salting `BCryptPasswordEncoder` para garantir que senhas originais nunca toquem o banco de dados.
3. **Filtro Customizado Interceptador (`OncePerRequestFilter`)**: Um interceptador centralizado (`SecurityFilter`) de rede que extrai, limpa os cabeçalhos `Authorization Bearer` e gerencia de forma imutável o contexto de segurança (`SecurityContextHolder`).
4. **Tratamento Resiliente de Exceções Globais**: Uma central de atendimento de falhas (`GlobalExceptionHandler`) que captura de erros de validação do Jakarta (`@Valid`) a quebras de regras de negócio (`RuntimeException`), blindando metadados e respondendo contratos limpos.

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
│   └── UserController.java
│
├── services/             # Casos de uso core e motores de regras de negócio
│   ├── CreateUserService.java
│   ├── AuthService.java
│   └── TokenService.java
│
├── security/             # Componentes perimetrais e interceptadores de rede
│   ├── SecurityConfig.java
│   └── SecurityFilter.java
│
├── dto/                  # Objetos de Transferência imutáveis (Java Records)
│   ├── UserRequestDTO.java
│   ├── UserResponseDTO.java
│   ├── LoginRequestDTO.java
│   └── LoginResponseDTO.java
│
├── entity/               # Modelagem de tabelas relacionais JPA
│   └── UserEntity.java
│
├── repositories/         # Abstração física de acesso a dados (I/O)
│   └── UserRepository.java
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

### Não-Funcionais (RNF)
- **Arquitetura 100% Stateless**: Habilita o escalonamento horizontal infinito em clusters de nuvem.
- **Injeção por Construtor**: Garantia de imutabilidade de dependências e testabilidade facilitada.
- **Imutabilidade de Contratos**: Uso exclusivo de Java Records na camada de transporte de dados externa.

---

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
