# TaskFlow API

Aplicação de gerenciamento de tarefas fullstack com backend em Node.js (Express + Prisma + SQLite), frontend responsivo e testes automatizados.

## Arquitetura

- **Backend**: Node.js, Express, Prisma ORM, SQLite.
- **Frontend**: HTML5, CSS3, JavaScript Vanilla responsivo.
- **Testes**: Jest e Supertest para testes de integração da API.

## Instalação e Execução

1. Clone o repositório.
2. Instale as dependências raiz e do backend:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Configure o banco de dados SQLite com Prisma:
   ```bash
   npx prisma db push --schema=backend/prisma/schema.prisma
   ```
4. Inicie a aplicação:
   ```bash
   npm run dev
   ```
5. Acesse no navegador: `http://localhost:3000`

## Executando os Testes

```bash
npm test
```
