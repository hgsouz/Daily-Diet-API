# 🍎 Daily Diet API

API REST para controle de dieta diária, onde o usuário pode registrar suas refeições e acompanhar se elas estão dentro ou fora da dieta.

> Este é um **projeto de estudos**, desenvolvido para praticar construção de APIs REST com autenticação, persistência de dados e testes automatizados usando o ecossistema Node.js + TypeScript.

---

## 📋 Sobre o projeto

A Daily Diet API permite que cada usuário:

- Crie uma conta e faça login de forma segura (senha com hash, autenticação via JWT);
- Registre refeições, informando nome, descrição, data, horário e se ela está dentro ou fora da dieta;
- Edite ou apague refeições que já registrou;
- Liste todas as suas refeições ou consulte uma específica por ID.

Cada usuário só tem acesso às **próprias** refeições — o vínculo entre usuário e refeição é validado a partir do token JWT em cada requisição, nunca a partir de dados enviados livremente pelo cliente.

---

## 🚀 Tecnologias utilizadas

- **[Node.js](https://nodejs.org/)** — ambiente de execução
- **[TypeScript](https://www.typescriptlang.org/)** — tipagem estática
- **[Fastify](https://fastify.dev/)** — framework web
- **[Knex.js](https://knexjs.org/)** — query builder e sistema de migrations
- **[SQLite](https://www.sqlite.org/)** — banco de dados (desenvolvimento e testes)
- **[@fastify/jwt](https://github.com/fastify/fastify-jwt)** — autenticação via JSON Web Token
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** — hash de senhas
- **[Zod](https://zod.dev/)** — validação de schemas e tipagem de dados de entrada
- **[Vitest](https://vitest.dev/)** + **[Supertest](https://www.npmjs.com/package/supertest)** — testes automatizados de integração
- **[tsx](https://github.com/privatenumber/tsx)** — execução de TypeScript em desenvolvimento

---

## 📌 Regras de negócio

- O usuário precisa se cadastrar e autenticar para acessar as rotas de refeições;
- Cada refeição pertence a um único usuário (via `userId`, extraído do token JWT — nunca do corpo da requisição);
- Um usuário só pode visualizar, editar ou apagar as **próprias** refeições;
- Toda refeição é classificada como `inDiet` (dentro da dieta) ou `outDiet` (fora da dieta).

---

## 🔗 Rotas da API

### Autenticação (`/auth`)

| Método | Rota           | Descrição                            | Autenticação |
| ------ | -------------- | ------------------------------------ | ------------ |
| POST   | `/auth/create` | Cria uma nova conta de usuário       | Não          |
| POST   | `/auth`        | Realiza login e retorna um token JWT | Não          |

### Refeições (`/food`)

| Método | Rota           | Descrição                                  | Autenticação |
| ------ | -------------- | ------------------------------------------ | ------------ |
| POST   | `/food/create` | Registra uma nova refeição                 | Sim          |
| GET    | `/food`        | Lista todas as refeições do usuário logado | Sim          |
| GET    | `/food/:id`    | Detalha uma refeição específica            | Sim          |
| PUT    | `/food/:id`    | Atualiza uma refeição existente            | Sim          |
| DELETE | `/food/:id`    | Remove uma refeição                        | Sim          |

Rotas autenticadas exigem o header: Authorization: Bearer <token>

> 📖 **Documentação interativa:** a documentação completa dos endpoints (parâmetros, exemplos de request/response e códigos de status) está disponivel via **Swagger** na rota /docs.

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js >= 24

### Passo a passo

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd Daily-Diet-API

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
cp .env.test.example .env.test
```

Preencha o `.env` e o `.env.test` com os valores necessários (veja a seção [Variáveis de ambiente](#-variáveis-de-ambiente)).

```bash
# Rode as migrations
npm run knex -- migrate:latest

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

O servidor sobe por padrão na porta `3333`.

### Rodando os testes

```bash
npm test
```

Os testes usam um banco SQLite isolado (`db/test.db`), recriado do zero a cada execução.

---

## 🔐 Variáveis de ambiente

| Variável          | Descrição                                      | Exemplo             |
| ----------------- | ---------------------------------------------- | ------------------- |
| `NODE_ENV`        | Ambiente de execução                           | `development`       |
| `DATABASE_CLIENT` | Driver do banco de dados (`sqlite` ou `pg`)    | `sqlite`            |
| `DATABASE_URL`    | Caminho ou connection string do banco          | `./db/app.db`       |
| `JWT_SECRET`      | Chave secreta usada para assinar os tokens JWT | `sua-chave-secreta` |
| `PORT`            | Porta em que o servidor irá rodar              | `3333`              |

---

## 🗄️ Estrutura do banco de dados

**`user`**

| Coluna          | Tipo | Descrição           |
| --------------- | ---- | ------------------- |
| `id`            | uuid | Identificador único |
| `name`          | text | Nome do usuário     |
| `email`         | text | E-mail (único)      |
| `password_hash` | text | Senha criptografada |
| `created_at`    | text | Data de criação     |

**`food_description`**

| Coluna        | Tipo | Descrição                                  |
| ------------- | ---- | ------------------------------------------ |
| `id`          | uuid | Identificador único                        |
| `userId`      | uuid | Referência ao dono da refeição (`user.id`) |
| `name`        | text | Nome da refeição                           |
| `description` | text | Descrição da refeição                      |
| `date`        | date | Data em que a refeição foi feita           |
| `time`        | time | Horário da refeição                        |
| `inOutDiet`   | text | `inDiet` ou `outDiet`                      |

---

## ☁️ Deploy

O deploy desta API será feito na **[Render](https://render.com/)**.

---

## 👤 Autor

Desenvolvido por **Hugo**, estudante de Análise e Desenvolvimento de Sistemas na **FIAP**, como projeto de estudos em desenvolvimento back-end com Node.js.
