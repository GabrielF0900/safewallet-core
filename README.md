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

O ecossistema do SafeWallet Core resolve esses desafios através de padrões de arquitetura de mercado focados em máxima segurança:

1. **Segurança Profunda e Proteção de Rotas (Spring Security)**: O backend foi meticulosamente blindado utilizando o ecossistema Spring Security. Todas as rotas de transações e consultas financeiras são fechadas por padrão. Apenas os endpoints de registro e login são públicos. Isso garante que nenhum usuário anônimo ou mal-intencionado consiga sondar endpoints sensíveis ou realizar ataques BOLA (Broken Object Level Authorization).
2. **Eclusa Perimetral Stateless (JWT)**: A autenticação é totalmente baseada em JSON Web Tokens (RFC 7519). Ao realizar login, o servidor assina um passe digital usando o algoritmo HMAC256. A API prova a identidade a cada requisição sem precisar verificar o banco de dados para validar sessões, economizando memória RAM e permitindo escalabilidade instantânea.
3. **Interceptador Customizado (`OncePerRequestFilter`)**: Desenvolvemos um filtro customizado de rede (`SecurityFilter`) que atua como um leão de chácara. Ele intercepta 100% das requisições para rotas protegidas, limpa o cabeçalho `Authorization Bearer`, decifra o token, valida a assinatura e sua expiração, garantindo a integridade do contexto de segurança (`SecurityContextHolder`) de forma imutável antes que o fluxo alcance as regras de negócio.
4. **Trituração de Credenciais (BCrypt)**: Aplicação do algoritmo de hashing adaptativo e salting `BCryptPasswordEncoder` para garantir que senhas originais nunca toquem o banco de dados em texto plano.
5. **Tratamento Resiliente de Exceções Globais**: Uma central de atendimento de falhas (`GlobalExceptionHandler`) que captura desde erros de validação do Jakarta (`@Valid`) até quebras de regras de negócio (`RuntimeException`), blindando metadados e respondendo contratos limpos, evitando o vazamento de detalhes técnicos sensíveis do servidor.
6. **Fluxo de Transações ACID**: Operações de depósito, saque e transferência executadas dentro de transações que garantem consistência de dados e rollback automático em caso de falha.
7. **Interface Web Reativa e Segura**: Um frontend moderno construído com React e Next.js, garantindo experiência fluida e alinhado com o backend na interceptação de tokens expirados (401 Unauthorized), protegendo ativamente as rotas no lado do cliente.

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

Acompanhe a jornada visual da utilização da plataforma **SafeWallet Core**, detalhando os bastidores de segurança, criptografia e controle transacional executados pelo backend a cada interação da interface.

### 1️⃣ Bem-vindo à SafeWallet
A Landing Page atua como a camada de apresentação pública do ecossistema. Na infraestrutura de segurança do **Spring Security**, essa rota ignora a cadeia de filtros restritivos através do método `.permitAll()`, permitindo o carregamento estático de recursos sem exigir cabeçalhos de autenticação.

![Home - Topo](./public/imagens-do-sistema-rodando/01-home.jpeg)

O tráfego de navegação inicial é puramente focado na experiência do usuário, mantendo a porta de comunicação com a API aberta apenas para leitura institucional e sem expor qualquer ponto de I/O de dados privados.

![Home - Detalhes](./public/imagens-do-sistema-rodando/02-home-abaixo.jpeg)

O encerramento da interface pública estabelece o limite do perímetro aberto da aplicação. Qualquer transição a partir deste ponto exige o redirecionamento para o microsserviço de controle de acesso.

![Home - Rodapé](./public/imagens-do-sistema-rodando/03-footer.jpeg)

### 2️⃣ Entrando na Plataforma: Geração do Token Stateless JWT
Ao submeter o formulário de login, o payload é processado pelo endpoint público `/api/auth/login`. O backend intercepta a senha em texto limpo, valida a correspondência criptográfica usando o método `passwordEncoder.matches()` contra a hash armazenada no PostgreSQL e monta o token **JWT** via algoritmo **HMAC256**. O token envelopa o identificador do usuário (`subject`) e uma claim de expiração rigorosa (`exp`), permitindo sessões 100% independentes de memória de servidor.

![Login Seguro](./public/imagens-do-sistema-rodando/04-login.jpeg)

### 3️⃣ A Criação de Novos Usuários e o Vínculo Atômico da Carteira
O formulário de registro aciona o caso de uso `CreateUserService`. Ao receber a requisição, o sistema aplica a criptografia adaptativa com salting do **BCrypt**, garantindo que a senha original seja destruída na memória da JVM antes da persistência. 

Para evitar furos de sincronia, a operação roda sob a proteção da anotação `@Transactional`: no instante em que o `UserEntity` é criado, o sistema gera simultaneamente uma `WalletEntity` vinculada ao UUID do novo usuário com saldo inicial em `BigDecimal.ZERO`. Se um deles falhar, o banco sofre *rollback* total.

![Cadastro do João Silva](./public/imagens-do-sistema-rodando/05-criando-usuario-1.jpeg)

A mesma infraestrutura transacional isolada garante que o cadastro de múltiplos usuários aconteça em escopos paralelos no PostgreSQL, gerando credenciais únicas e carteiras vazias totalmente estretificadas no banco de dados.

![Cadastro da Maria Santos](./public/imagens-do-sistema-rodando/06-criando-usuario-2.jpeg)

### 4️⃣ A Visão Geral: Filtros de Rede Customizados em Ação
O carregamento do Dashboard exige o envio do JWT gerado no cabeçalho HTTP `Authorization: Bearer <token>`. O nosso componente `SecurityFilter` (que estende `OncePerRequestFilter`) intercepta a requisição, decodifica a assinatura simétrica e valida o ciclo de vida do token. Se o token estiver corrompido ou expirado, a requisição é barrada na borda da rede, devolvendo um código **HTTP 401 Unauthorized** imediato.

![Dashboard Principal](./public/imagens-do-sistema-rodando/07-dashboard.jpeg)

### 5️⃣ Gestão de Carteira e Blindagem Total Contra Ataques BOLA/IDOR
Nesta tela sensível de exibição de saldos, o sistema anula completamente a vulnerabilidade de **Ataque BOLA/IDOR (Broken Object Level Authorization)**. O frontend em React não envia um `walletId` de forma arbitrária no corpo da requisição. 

O endpoint privado do backend extrai o ID do usuário diretamente do contexto de segurança autenticado no filtro de rede (`request.getAttribute("UserUnderlineID")`). É impossível que um usuário mal-intencionado altere parâmetros no browser para visualizar ou manipular o saldo de outra pessoa.

![Saldo e Carteira Zerada do João](./public/imagens-do-sistema-rodando/08-saldo-e-carteira.jpeg)

### 6️⃣ A Interface de Transações: Depósito Controlado e Escopo ACID
O menu de depósitos aciona o motor financeiro principal do backend. A requisição trafega o montante desejado até o método `deposit` do `TransactionService`. Toda a operação matemática é processada utilizando a classe **`BigDecimal`** com escala controlada para anular erros de arredondamento de ponto flutuante que ocorrem em tipos primitivos como `double` ou `float`.

![Tela de Depósito](./public/imagens-do-sistema-rodando/09-depositar.jpeg)

A persistência do depósito é síncrona e atômica. O saldo da entidade `WalletEntity` é incrementado usando o método `.add()`, o novo estado é salvo no banco, e uma linha correspondente de auditoria é inserida na tabela `tb_transactions`, retornando um JSON limpo e estruturado com a confirmação para a camada cliente.

![Sucesso no Depósito do Usuário 1](./public/imagens-do-sistema-rodando/14-depositando-na-conta-usuario-1.jpeg)

Após a confirmação do commit no PostgreSQL, o frontend atualiza o estado global da aplicação via Zustand, refletindo instantaneamente o novo valor consolidado na carteira a partir de uma fonte de dados imutável.

![Carteira do Usuário 1 com Saldo](./public/imagens-do-sistema-rodando/16-carteira-do-usuario-1-com-dinheiro.jpeg)

### 7️⃣ Outras Operações: Regras de Negócio e Isolamento de Falhas no Saque
O endpoint privado `/withdraw` executa validações rigorosas antes de autorizar qualquer saída de capital. O serviço executa uma checagem de limite através de `wallet.getBalance().compareTo(amount) < 0`.

![Tela de Saque](./public/imagens-do-sistema-rodando/10-sacar.jpeg)

Se o usuário tentar sacar um valor superior ao saldo disponível, a lógica de negócio interrompe a thread imediatamente lançando uma `IllegalStateException`. O nosso `@ControllerAdvice` captura essa falha de runtime e a converte em uma mensagem limpa com HTTP Status 400 (Bad Request), impedindo que códigos de erro internos exponham o esqueleto do banco de dados para o usuário.

![Confirmação de Saque Realizado](./public/imagens-do-sistema-rodando/18-saque-realizado.jpeg)

### 8️⃣ Interação P2P: Validação de Ambientes Multi-Tenant Isolados
Para provar a robustez do ecossistema, o perfil da usuária Maria Santos é carregado em uma sessão paralela. O token JWT emitido para a Maria garante acesso exclusivo às suas próprias claims. O painel atesta que a carteira dela nascida no cadastro inicial permanece intocada e isolada de quaisquer movimentações anteriores efetuadas pelo João Silva.

![Carteira Vazia do Usuário 2](./public/imagens-do-sistema-rodando/15-carteira-do-usuario-2-vazia.jpeg)

### 9️⃣ Orquestrando uma Transferência P2P com Integridade Transacional
A operação de transferência Peer-to-Peer (P2P) é a operação de maior criticidade do sistema. O usuário de origem insere o UUID da carteira de destino e o valor.

![Tela de Transferência](./public/imagens-do-sistema-rodando/11-transferir.jpeg)

Ao clicar em enviar, o backend abre um contexto de isolamento de banco de dados do mais alto nível. O método `transfer` carrega as duas carteiras envolvidas simultaneamente no banco PostgreSQL para realizar as mutações de débito e crédito de forma acorrentada.

![Processando a Transferência](./public/imagens-do-sistema-rodando/17-transferindo-para-usuario-2.jpeg)

Graças ao gerenciamento do `@Transactional`, se o servidor sofrer uma queda catastrófica ou perda de conexão exatamente após debitar o dinheiro do João, mas antes de creditar na conta da Maria, o banco de dados desfaz a transação por inteiro (*Rollback*). Isso garante que o dinheiro nunca suma do ecossistema, eliminando problemas de inconsistência de saldo.

![Sucesso na Transferência](./public/imagens-do-sistema-rodando/19-transferido.jpeg)

### 🔟 A Chegada Garantida do Dinheiro e Consistência de Dados
Após o encerramento com sucesso da transação no backend, o novo estado do banco de dados é consolidado. Ao consultar o seu painel com seu próprio token de acesso criptográfico, a interface da Maria reflete em tempo real o recebimento do valor exato transferido pelo João, sem atrasos e sem risco de leituras sujas (*dirty reads*).

![Carteira do Usuário 2 com Dinheiro](./public/imagens-do-sistema-rodando/20-usuario-2-com-valor.jpeg)

### 1️⃣1️⃣ Transparência e Rastreabilidade: Logs Isolados de Auditoria
A tabela de histórico de transações consome dados de auditoria imutáveis persistidos no PostgreSQL. Para manter o sigilo bancário dos clientes, as queries executadas no repositório utilizam filtros JPQL dinâmicos baseados no ID extraído do cabeçalho JWT autenticado. Um usuário jamais conseguirá ler o extrato de outro cliente injetando IDs de terceiros.

A tabela mapeia semanticamente o tipo da operação (`DEPOSIT`, `WITHDRAW`, `TRANSFER`), a data de carimbo do servidor e os valores puros.

![Acesso ao Menu de Histórico](./public/imagens-do-sistema-rodando/12-historico.jpeg)

Visão detalhada do extrato do João Silva, documentando cronologicamente todas as suas saídas (transferências/saques) e entradas (depósitos).

![Histórico do Usuário 1](./public/imagens-do-sistema-rodando/22-historico-usuario-1.jpeg)

Visão detalhada do extrato da Maria Santos, documentando a entrada de capital atômico enviada a partir da transação P2P.

![Histórico do Usuário 2](./public/imagens-do-sistema-rodando/21-historico-usuario-2.jpeg)

### 1️⃣2️⃣ Finalizando o Expediente: Destruição do Token no Lado do Cliente
A tela de configurações gerencia o encerramento seguro das sessões. Como o backend adota uma arquitetura rigorosamente **Stateless** (sem guardar dados de sessões na memória do servidor para maximizar a performance e o escalonamento vertical em nuvem), o processo de *logout* consiste na destruição completa do token JWT armazenado no LocalStorage do navegador. Sem o token assinado, a eclusa de filtros de rede da API barra automaticamente qualquer nova tentativa de requisição para as rotas internas.

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

* **Payload de Entrada (JSON):**

```json
  {
    "name": "Gabriel Falcão",
    "email": "gabriel.falcao@safewallet.com",
    "password": "SenhaForte@2026"
  }

```

* **Payload de Resposta (`201 Created`):**

```json
  {
    "id": "a4a1305d-4675-4201-8486-3ef646a61e99",
    "name": "Gabriel Falcão",
    "email": "gabriel.falcao@safewallet.com"
  }

```

#### 🔹 `POST /api/auth/login` — Efetuar Login Autenticado

**Acesso:** Público (`.permitAll()`)

* **Payload de Entrada (JSON):**

```json
  {
    "email": "gabriel.falcao@safewallet.com",
    "password": "SenhaForte@2026"
  }

```

* **Payload de Resposta Envelopado (`200 OK`):**

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

* **Segurança e Proteção de Segredos**: As chaves simétricas de assinatura criptográfica mapeadas no arquivo `application.properties` são preparadas para serem sobrescritas em tempo de execução via variáveis de ambiente integradas ao **AWS Secrets Manager** dentro de tarefas do **AWS ECS Fargate**.
* **Escalabilidade Multi-AZ**: Por ser completamente Stateless, as instâncias deste microsserviço podem ser escaladas horizontalmente por um **Application Load Balancer (ALB)** em múltiplas Zonas de Disponibilidade (AZs) com risco zero de quebra de sessão.
* **Observabilidade Perimetral**: As respostas capturadas pelo `GlobalExceptionHandler` alimentam as métricas nativas do **Amazon CloudWatch Logs**, permitindo a criação de alarmes automatizados contra tentativas em massa de ataques de força bruta (*Credential Stuffing*).

---

## 📄 Licença

Projeto desenvolvido estritamente para fins educacionais, de portfólio técnico e autodesenvolvimento em arquitetura de sistemas críticos.

---

**Desenvolvido com ❤️ por Gabriel Falcão | 2026**