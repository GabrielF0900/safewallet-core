# 🧪 Guia Completo de Testes - Insomnia

## ⚙️ Configuração Inicial

1. **URL Base:** `http://localhost:8080`
2. **Content-Type:** `application/json` (em todos os requests)

---

## 📝 Passo 1: Registrar um Novo Usuário

### Request
```
POST http://localhost:8080/api/auth/register
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Resposta Esperada (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

---

## 🔐 Passo 2: Fazer Login

### Request
```
POST http://localhost:8080/api/auth/login
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### Resposta Esperada (200 OK)
```json
{
  "message": "Login efetuado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3NDk0MDUyODAsImV4cCI6MTc0OTQwODg4MH0.xL5nH8...",
  "name": "João Silva"
}
```

### 📌 **IMPORTANTE: Copie o token!**
Você vai usar este token em todas as requisições protegidas.

---

## 💰 Passo 3: Fazer um Depósito

### Request
```
POST http://localhost:8080/transactions/deposit
```

### Headers
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

⚠️ **INSTRUÇÕES DO INSOMNIA:**
1. Clique em **"Auth"** (abaixo do campo URL)
2. Selecione **"Bearer Token"** no dropdown
3. Cole o token (sem a palavra "Bearer") no campo de token
4. **OU** adicione manualmente no header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Body (JSON)
```json
{
  "amount": 100.50
}
```

### Resposta Esperada (200 OK)
```
Status: 200 OK (sem body)
```

---

## 💳 Passo 4: Fazer um Saque

### Request
```
POST http://localhost:8080/transactions/withdraw
```

### Headers
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

### Body (JSON)
```json
{
  "amount": 25.00
}
```

### Resposta Esperada (200 OK)
```
Status: 200 OK (sem body)
```

---

## 🔄 Passo 5: Fazer uma Transferência

### Primeiro, crie um segundo usuário:

```
POST http://localhost:8080/api/auth/register

{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha456"
}
```

### Depois, faça login com Maria para pegar sua carteira ID:
Você precisa do `id` retornado no registro.

### Agora, com o token de João, faça a transferência:

### Request
```
POST http://localhost:8080/transactions/transfer
```

### Headers
```
Content-Type: application/json
Authorization: Bearer TOKEN_DO_JOAO
```

### Body (JSON)
```json
{
  "destinationWalletId": "WALLET_ID_DA_MARIA",
  "amount": 50.00
}
```

**Nota:** O `WALLET_ID_DA_MARIA` é o mesmo que o `id` retornado quando você registrou a Maria.

---

## ✅ Checklist de Teste Completo

- [ ] Registrar João Silva
- [ ] Login com João Silva (copiar token)
- [ ] Depositar R$ 100,50 com token de João
- [ ] Sacar R$ 25,00 com token de João
- [ ] Registrar Maria Santos
- [ ] Fazer transferência de R$ 50,00 de João para Maria
- [ ] Verificar se o saldo de João diminuiu
- [ ] Verificar se o saldo de Maria aumentou

---

## 🐛 Troubleshooting

### Erro 403 (Forbidden)
- ✅ Verifique se o token está sendo enviado no header `Authorization: Bearer`
- ✅ Verifique se o token não expirou
- ✅ Veja os logs da aplicação para mais detalhes

### Erro 401 (Unauthorized)
- ✅ Token inválido ou expirado
- ✅ Faça login novamente e copie o novo token

### Erro 400 (Bad Request)
- ✅ Verifique se o JSON está no formato correto
- ✅ Verifique se `amount` é um número válido (ex: 100.50)

### Erro 500 (Internal Server Error)
- ✅ Verifique os logs da aplicação
- ✅ Garanta que o banco de dados está rodando

---

## 🚀 Dicas Extras

1. **Usar Environment Variables no Insomnia:**
   - Crie uma variável `token` 
   - No header, use: `Authorization: Bearer {% raw %}{{ token }}{% endraw %}`
   - Atualize a variável após cada login

2. **Salvar como Collection:**
   - Crie uma Collection "SafeWallet"
   - Salve todos os requests
   - Compartilhe com o time

3. **Testar em Paralelo:**
   - Abra múltiplas abas
   - Teste diferentes usuários
   - Simule transferências entre contas

