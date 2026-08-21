# Projeto MVC em Node.js

Protótipo educacional inspirado no projeto PHP Composer POO MVC. A aplicação mantém MVC, orientação a objetos em JavaScript ES6, Express para HTTP, EJS para views e PostgreSQL com SQL puro parametrizado. Não utiliza ORM.

## Executar com Docker

```bash
cp .env.example .env
docker compose up --build
```

- Aplicação: http://localhost:3000
- pgAdmin: http://localhost:18080
- PostgreSQL no host: `localhost:55432` (dentro da rede Docker: `postgres:5432`)

No pgAdmin, cadastre uma conexão usando host `postgres`, porta `5432`, banco `app_db`, usuário `app_user` e senha `app_password`.

## Executar localmente

É necessário ter PostgreSQL disponível e configurar o `.env` com `DB_HOST=localhost`.

```bash
npm install
npm start
```

O schema em `database/schema.sql` pode ser aplicado diretamente no banco local.

## Arquitetura

- `src/config/Database.js`: Singleton que encapsula o pool `pg`.
- `src/models`: consultas SQL e regras de persistência.
- `src/controllers`: casos de uso e respostas HTTP.
- `src/core/Router.js`: adaptador orientado a objetos sobre `express.Router`.
- `src/views`: templates EJS sem lógica de persistência.
- `public`: assets públicos.

## Rotas

- `GET /`: página inicial.
- `GET /produtos`: lista todos os produtos.
- `GET /produtos/novo`, `POST /produtos`: tela e ação de criação.
- `GET /produtos/:id`: tela de detalhe.
- `GET /produtos/:id/editar`, `POST /produtos/:id`: tela e ação de edição.
- `POST /produtos/:id/delete`: exclusão.
- `GET /api/produtos` e `GET /api/products`: coleção JSON.
- `GET /api/produtos/:id`: produto JSON por id.
