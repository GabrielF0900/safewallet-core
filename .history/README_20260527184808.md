# SafeWallet Core

## 📋 Resumo Executivo (TL;DR)

SafeWallet Core é um **microsserviço de carteira digital** desenvolvido como projeto pessoal para autodesenvolvimento em **arquitetura Java e Spring Boot**. O sistema implementa um fluxo completo de gerenciamento de usuários e cartões de crédito corporativos, com foco em **arquitetura limpa, validação em camadas e resiliência cloud-native**. Toda a infraestrutura é orquestrada via containers Docker para isolamento de recursos e facilidade de desenvolvimento local.

---

## 🎯 Problema

Aplicações que gerenciam carteiras digitais e dados de cartões sensíveis frequentemente enfrentam desafios:

- ❌ **Validação dispersa**: Dados inválidos fluem através das camadas, comprometendo integridade
- ❌ **Arquitetura monolítica**: Difícil manutenção e escalabilidade
- ❌ **Tratamento de erros inconsistente**: Diferentes formatos de resposta de erro confundem clientes API
- ❌ **Falta de isolamento**: Conflitos de recursos locais impedem desenvolvimento paralelo

---

## ✅ Solução

O SafeWallet Core implementa:

1. **Arquitetura em Camadas Isoladas**: Controllers → Services → Repositories → Entities
2. **Validação em Borda**: Bean Validation (@Valid, @NotNull, @Email, @Pattern) intercepta requisições inválidas antes do processamento
3. **Tratamento Global de Exceções**: @ControllerAdvice centraliza respostas de erro com formato padronizado (HTTP 400, 409, 500)
4. **Microsserviço Stateless**: Orquestração containerizada com Docker/Docker Compose para isolamento total
5. **Derivação de Queries**: Checagem de unicidade (findByEmail, findByCardNumber) em memória antes de persistência

---

## 🏗️ Arquitetura

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | Java 21, Spring Boot 3.x |
| **Persistência** | Spring Data JPA, Hibernate |
| **Banco de Dados** | PostgreSQL |
| **Validação** | Jakarta Bean Validation (Hibernate Validator) |
| **Orquestração** | Docker, Docker Compose |
| **Build** | Maven |
| **Frontend** | React 19, Vite, Node.js |

### Estrutura de Pacotes Java

```
br.com.safewallet
│
├── users/
│   ├── controllers/          # Endpoints HTTP (UserController)
│   ├── dto/                  # DTOs imutáveis (Record)
│   ├── entity/               # Entidades JPA (UserEntity)
│   ├── repositories/         # Interfaces JpaRepository
│   └── services/             # Casos de uso (CreateUserService)
│
├── cards/
│   ├── controllers/          # Endpoints de cartões
│   ├── dto/                  # DTOs de cartões
│   ├── entity/               # CardEntity
│   ├── repositories/         # CardRepository
│   └── services/             # CreateCardService
│
└── exceptions/
    └── controllers/          # Centralizador Global (@ControllerAdvice)
```

---

## 📋 Requisitos Implementados

### Funcionais (RF)

- **RF-001**: Cadastro de usuário com validação de email (RFC) e senha (mín. 6 caracteres)
- **RF-002**: Vinculação de cartões de crédito a usuários existentes
- **RF-003**: Validação automática de constraints na borda (Bean Validation)
- **RF-004**: Prevenção de duplicatas via checagem em memória
- **RF-005**: Tratamento global de exceções com contratos padronizados

### Não-Funcionais (RNF)

- Arquitetura cloud-native e stateless
- Escalabilidade horizontal via containerização
- Isolamento de responsabilidades (Separation of Concerns)
- Resiliência de falhas infraestruturais

---

## 🚀 Começando

### Pré-requisitos

- Java 21+
- Maven
- Docker & Docker Compose
- Node.js 18+ e pnpm (para frontend)

### Estrutura do Projeto

```
safewallet/
├── Backend/                  # Microsserviço Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── ...
├── Frontend/                 # Aplicação React + Vite
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yaml       # Orquestração de containers
└── README.md
```

### Execução Local

1. **Clone e navegue ao diretório:**

   ```bash
   cd c:\Projetos\safewallet
   ```

2. **Suba a infraestrutura com Docker Compose:**

   ```bash
   docker-compose up -d
   ```

3. **Build e execute o Backend:**

   ```bash
   cd Backend
   mvn clean install
   mvn spring-boot:run
   ```

   O servidor iniciará em `http://localhost:8080`

4. **Instale e execute o Frontend:**

   ```bash
   cd Frontend
   pnpm install
   pnpm run dev
   ```

   A aplicação React estará disponível em `http://localhost:5173`

---

## 🎓 Objetivo Educacional

Este projeto foi desenvolvido com a finalidade de **autodesenvolvimento em arquitetura Java**, aplicando conceitos práticos de:

- ✨ Arquitetura Limpa (Clean Architecture)
- ✨ Design Orientado a Objetos (OOP)
- ✨ Princípios SOLID
- ✨ Padrões de Projeto (DTO, Repository, Service)
- ✨ Validação em camadas
- ✨ Tratamento de exceções
- ✨ Microsserviços e Cloud-Native
- ✨ Containerização

---

## 📝 Endpoints Principais

### Users

- `POST /users` — Registrar novo usuário
  - Body: `{ "fullName": "string", "email": "string", "password": "string" }`
  - Response: `201 Created`

### Cards

- `POST /cards` — Cadastrar cartão de crédito
  - Body: `{ "userId": "UUID", "cardNumber": "string", "holderName": "string", "expiryDate": "MM/AA", "cvv": "string" }`
  - Response: `201 Created`

---

## 🛠️ Tecnologias por Camada

| Camada | Tecnologias | Propósito |
|--------|------------|----------|
| **API Gateway** | Spring Boot, Spring Web | Roteamento e exposição de endpoints REST |
| **Negócio** | Spring, SOLID Principles | Lógica de casos de uso |
| **Persistência** | Spring Data JPA, Hibernate | Mapeamento objeto-relacional |
| **Validação** | Jakarta Bean Validation | Constraints automáticas |
| **Tratamento de Erros** | @ControllerAdvice | Centralização de exceções |
| **Banco de Dados** | PostgreSQL | Armazenamento relacional |
| **Frontend** | React 19, Vite | Interface de usuário moderna |
| **Infraestrutura** | Docker, Docker Compose | Orquestração local |

---

## 📚 Documentação Técnica

Para mais detalhes sobre a arquitetura, requisitos técnicos e regras de negócio, consulte:

- [Levantamento de Requisitos](./Levantamento-De-Requisitos/LevantamentoRequisitos_SafeWallet_Core.docx)
- [HELP.md](./HELP.md)

---

## 📄 Licença

Projeto pessoal para fins educacionais.

---

**Desenvolvido com foco em excelência arquitetural e aprendizado contínuo em Java & Spring Boot.**
