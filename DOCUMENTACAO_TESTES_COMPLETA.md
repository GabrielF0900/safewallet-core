# 📋 Documentação Completa - SafeWallet API

## 🔄 Fluxo de Testes Passo a Passo

---

## **PASSO 1: CRIAR USUÁRIO 1**

### Request
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json
```

### JSON Body
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Response (200 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

### 📸 Print: Capture a resposta com o ID de João

**⚠️ SALVE ESSE ID:** `550e8400-e29b-41d4-a716-446655440000` (João)

---

## **PASSO 2: CRIAR USUÁRIO 2**

### Request
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json
```

### JSON Body
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha456"
}
```

### Response (200 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Maria Santos",
  "email": "maria@example.com"
}
```

### 📸 Print: Capture a resposta com o ID de Maria

**⚠️ SALVE ESSE ID:** `550e8400-e29b-41d4-a716-446655440001` (Esse é o USER ID)

---

## **PASSO 2B: OBTER O WALLET ID DE MARIA** ⭐ **IMPORTANTE!**

### ⚠️ O ID retornado no registro é o USER ID, NÃO é o WALLET ID!
Você precisa obter o WALLET ID correto de Maria!

### Request
```
GET http://localhost:8080/transactions/my-wallet
Content-Type: application/json
Authorization: Bearer TOKEN_DA_MARIA
```

### Headers (No Insomnia)
- Auth: Bearer Token
- Cole o token de Maria

### Response (200 OK)
```json
{
  "balance": 0.00,
  "walletId": "a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d"
}
```

### 📸 Print: Capture o WALLET ID de Maria

**⚠️ COPIE ESTE WALLET ID:** `a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d` (Esse é o WALLET ID - use na transferência!)

---

## **PASSO 3: LOGIN JOÃO**

### Request
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json
```

### JSON Body
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Response (200 OK)
```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3NDk0MDUyODAsImV4cCI6MTc0OTQwODg4MH0.xL5nH8...",
  "name": "João Silva"
}
```

### 📸 Print: Capture a resposta com o TOKEN de João

**⚠️ COPIE O TOKEN:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## **PASSO 4: VERIFICAR SALDO DE JOÃO (Inicial)**

### Request
```
GET http://localhost:8080/transactions/balance
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Headers (No Insomnia)
- Auth: Bearer Token
- Cole o token de João

### Response (200 OK)
```json
{
  "balance": 0.00,
  "walletId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 📸 Print: Capture o saldo inicial de João (0.00)

---

## **PASSO 5: LOGIN MARIA**

### Request
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json
```

### JSON Body
```json
{
  "email": "maria@example.com",
  "password": "senha456"
}
```

### Response (200 OK)
```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDEiLCJpYXQiOjE3NDk0MDUyODAsImV4cCI6MTc0OTQwODg4MH0.abc123...",
  "name": "Maria Santos"
}
```

### 📸 Print: Capture a resposta com o TOKEN de Maria

**⚠️ COPIE O TOKEN:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## **PASSO 6: VERIFICAR SALDO DE MARIA (Inicial)**

### Request
```
GET http://localhost:8080/transactions/balance
Content-Type: application/json
Authorization: Bearer TOKEN_DA_MARIA
```

### Headers (No Insomnia)
- Auth: Bearer Token
- Cole o token de Maria

### Response (200 OK)
```json
{
  "balance": 0.00,
  "walletId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 📸 Print: Capture o saldo inicial de Maria (0.00)

---

## **PASSO 7: DEPOSITAR DINHEIRO NA CONTA DE JOÃO**

### Request
```
POST http://localhost:8080/transactions/deposit
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Headers (No Insomnia)
- Auth: Bearer Token
- Cole o token de João

### JSON Body
```json
{
  "amount": 1000.00
}
```

### Response (200 OK)
```json
{
  "message": "✅ Depósito realizado com sucesso!",
  "type": "DEPOSIT",
  "amount": 1000.00,
  "newBalance": 1000.00
}
```

### 📸 Print: Capture a resposta do depósito de João

---

## **PASSO 8: VERIFICAR SALDO DE JOÃO (Após Depósito)**

### Request
```
GET http://localhost:8080/transactions/balance
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Response (200 OK)
```json
{
  "balance": 1000.00,
  "walletId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 📸 Print: Capture o saldo atualizado de João (1000.00)

---

## **PASSO 9: TRANSFERIR DINHEIRO DE JOÃO PARA MARIA**

### Request
```
POST http://localhost:8080/transactions/transfer
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Headers (No Insomnia)
- Auth: Bearer Token
- Cole o token de João

### JSON Body
```json
{
  "destinationWalletId": "a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d",
  "amount": 500.00
}
```

**⚠️ IMPORTANTE:** Substitua `a7c9e5f2-6b3d-4e2a-9f1d-8c5b3a2e1f7d` pelo **WALLET ID de Maria do PASSO 2B** (NÃO use o USER ID!)

### Response (200 OK)
```json
{
  "message": "✅ Transferência realizada com sucesso!",
  "type": "TRANSFER",
  "amount": 500.00,
  "newBalance": 500.00
}
```

### 📸 Print: Capture a resposta da transferência

---

## **PASSO 10: VERIFICAR SALDO DE MARIA (Após Transferência)**

### Request
```
GET http://localhost:8080/transactions/balance
Content-Type: application/json
Authorization: Bearer TOKEN_DA_MARIA
```

### Response (200 OK)
```json
{
  "balance": 500.00,
  "walletId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 📸 Print: Capture o saldo atualizado de Maria (500.00)

---

## **PASSO 11: VERIFICAR SALDO FINAL DE JOÃO**

### Request
```
GET http://localhost:8080/transactions/balance
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Response (200 OK)
```json
{
  "balance": 500.00,
  "walletId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 📸 Print: Capture o saldo final de João (500.00)

---

## 📊 Resumo Final

| Usuário | Ação | Saldo |
|---------|------|-------|
| João | Inicial | 0.00 |
| João | Após Depósito | 1000.00 |
| João | Após Transferência | 500.00 |
| Maria | Inicial | 0.00 |
| Maria | Após Receber Transferência | 500.00 |

---

## 🔄 Como Resetar o Banco de Dados

**Opção 1: Deletar a aplicação e dados locais**
- Parar a aplicação (Ctrl+C)
- Abrir o application.properties e adicionar:
  ```properties
  spring.jpa.hibernate.ddl-auto=create-drop
  ```
- Reiniciar a aplicação
- Mudar novamente para:
  ```properties
  spring.jpa.hibernate.ddl-auto=update
  ```

**Opção 2: Conectar ao banco PostgreSQL e limpar**
```sql
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS users;
```

---

## 📝 Checklist de Prints

- [ ] PASSO 1: Criação de Usuário 1 (João)
- [ ] PASSO 2: Criação de Usuário 2 (Maria)
- [ ] PASSO 2B: Obter WALLET ID de Maria ⭐ **IMPORTANTE!**
- [ ] PASSO 4: Saldo Inicial de João (0.00)
- [ ] PASSO 6: Saldo Inicial de Maria (0.00)
- [ ] PASSO 7: Depósito de João (1000.00)
- [ ] PASSO 8: Saldo de João Após Depósito (1000.00)
- [ ] PASSO 9: Transferência de João para Maria (500.00)
- [ ] PASSO 10: Saldo de Maria Após Transferência (500.00)
- [ ] PASSO 11: Saldo Final de João (500.00)

---

## ✅ Tudo Pronto para Documentar!

Execute os passos na ordem acima e capture cada print. Você terá uma documentação completa do fluxo de transações do SafeWallet! 🚀
