# 🏢 Sistema de Reserva de Salas — API

API REST desenvolvida para o gerenciamento de **usuários, salas e reservas de salas**, permitindo autenticação, controle de acesso por perfil, gerenciamento de salas e criação/gerenciamento de reservas.

O projeto foi desenvolvido com foco em **boas práticas de desenvolvimento de software**, utilizando arquitetura modular, Programação Orientada a Objetos (POO), princípios SOLID, Clean Code, Design Patterns e separação de responsabilidades.

---

## 🚀 Tecnologias

### Backend

* Node.js
* Express
* JavaScript
* Sequelize ORM
* PostgreSQL
* JWT — JSON Web Token
* REST API
* Swagger / OpenAPI
* Docker
* Docker Compose

### Banco de dados

O projeto utiliza:

* PostgreSQL
* Supabase

> O PostgreSQL não é executado em um container local. O banco de dados é hospedado no Supabase e a API, executada no Docker, conecta-se ao banco através da internet.

---

# 📋 Funcionalidades

## 🔐 Autenticação

* Cadastro de usuários
* Login
* Geração de JWT
* Recuperação do usuário autenticado
* Controle de acesso por perfil
* Perfis `USER` e `ADMIN`

## 👤 Usuários

* Cadastro
* Listagem
* Consulta por ID
* Atualização
* Exclusão
* Controle de perfil

## 🏢 Salas

* Cadastro de salas
* Listagem de salas
* Consulta por ID
* Atualização
* Exclusão
* Ativação/inativação
* Verificação de disponibilidade
* Consulta de reservas da sala

## 📅 Reservas

* Criação de reservas
* Listagem de reservas
* Consulta por ID
* Consulta das próprias reservas
* Atualização
* Cancelamento
* Controle de conflitos de horários

### Regra principal de negócio

Uma sala não pode possuir duas reservas confirmadas que tenham conflito de horário.

A API verifica a sobreposição entre os períodos de reserva antes de confirmar uma nova reserva.

---

# 🏗️ Arquitetura

A API utiliza uma arquitetura modular baseada em responsabilidades.

```text
sistema-reserva-salas-api/
│
├── index.js
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
│
└── src/
    │
    ├── app.js
    │
    ├── config/
    │   ├── database.js
    │   └── sequelize-cli.js
    │
    ├── modules/
    │   │
    │   ├── authentication/
    │   │   ├── models/
    │   │   ├── controllers/
    │   │   ├── services/
    │   │   ├── repositories/
    │   │   ├── routes/
    │   │   └── validators/
    │   │
    │   ├── users/
    │   │   ├── models/
    │   │   ├── builders/
    │   │   ├── repositories/
    │   │   ├── services/
    │   │   ├── controllers/
    │   │   ├── validators/
    │   │   └── routes/
    │   │
    │   ├── rooms/
    │   │   ├── models/
    │   │   ├── builders/
    │   │   ├── repositories/
    │   │   ├── services/
    │   │   ├── controllers/
    │   │   ├── validators/
    │   │   └── routes/
    │   │
    │   └── reservations/
    │       ├── models/
    │       ├── builders/
    │       ├── repositories/
    │       ├── services/
    │       ├── controllers/
    │       ├── validators/
    │       └── routes/
    │
    └── shared/
        ├── database/
        │   ├── connection.js
        │   ├── models.js
        │   └── migrations/
        │
        ├── errors/
        ├── middlewares/
        ├── security/
        └── docs/
            └── swagger.js
```

---

# 🧠 Princípios utilizados

O projeto foi estruturado considerando:

### POO

A aplicação utiliza classes para representar diferentes responsabilidades da aplicação.

Exemplos:

```text
User
Room
Reservation
UserService
RoomService
ReservationService
UserController
RoomController
ReservationController
RoomRepository
RoomBuilder
```

### Encapsulamento

Cada classe mantém sua responsabilidade e expõe apenas os métodos necessários para interação com outras camadas.

### Abstração

As regras de negócio são abstraídas através de Services, Repositories, Validators e outras classes especializadas.

### SOLID

Principalmente:

* **S — Single Responsibility Principle**
* **O — Open/Closed Principle**
* **L — Liskov Substitution Principle**
* **I — Interface Segregation Principle**
* **D — Dependency Inversion Principle**

### Design Patterns

O projeto utiliza, entre outros:

* Builder
* Bridge
* Repository
* Service Layer

---

# 🐳 Executando com Docker

## Pré-requisitos

Antes de iniciar o projeto, instale:

* Git
* Docker
* Docker Desktop

O PostgreSQL **não precisa estar instalado localmente**, pois o banco utilizado pelo projeto está hospedado no Supabase.

---

# 📥 1. Clonar o projeto

Clone o repositório:

```bash
git clone https://github.com/fbmcarmo/sistema-reserva-salas-api.git
```

Entre na pasta:

```bash
cd sistema-reserva-salas-api
```

---

# ⚙️ 2. Configurar as variáveis de ambiente

Crie o arquivo:

```text
.env
```

A partir do arquivo:

```text
.env.example
```

Exemplo:

```env
NODE_ENV=development
PORT=3001

DB_HOST=SEU_HOST_DO_SUPABASE
DB_PORT=5432
DB_NAME=postgres
DB_USER=SEU_USUARIO
DB_PASSWORD=SUA_SENHA
DB_SSL=true

JWT_SECRET=SEU_JWT_SECRET
JWT_EXPIRES_IN=1h
```

### ⚠️ Importante

Nunca envie o arquivo `.env` para o GitHub.

O arquivo `.env` deve estar no `.gitignore`.

Exemplo:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

---

# 🗄️ 3. Configuração do Supabase

O banco de dados utilizado pela aplicação é PostgreSQL hospedado no Supabase.

No projeto Supabase:

```text
Project
   ↓
Connect
   ↓
Connection String
```

Para execução em Docker, recomenda-se utilizar uma conexão apropriada para aplicações, como o **Session Pooler**, quando necessário.

Configure no `.env` os valores fornecidos pelo Supabase:

```env
DB_HOST=...
DB_PORT=...
DB_NAME=postgres
DB_USER=...
DB_PASSWORD=...
```

---

# 🐳 4. Construir a imagem Docker

Execute:

```bash
docker compose build
```

Para reconstruir completamente a imagem:

```bash
docker compose build --no-cache
```

---

# ▶️ 5. Iniciar a API

Execute:

```bash
docker compose up
```

Para executar em segundo plano:

```bash
docker compose up -d
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

# 📊 6. Verificar os containers

Execute:

```bash
docker ps
```

Você deverá encontrar o container:

```text
sistema-reserva-salas-api
```

---

# 📜 7. Visualizar os logs

Para acompanhar os logs:

```bash
docker compose logs -f api
```

Uma inicialização bem-sucedida deverá apresentar mensagens semelhantes a:

```text
Banco de dados conectado com sucesso.
Servidor rodando na porta 3001
```

---

# 🛑 8. Parar a aplicação

Para parar os containers:

```bash
docker compose down
```

---

# 🔄 9. Reiniciar a aplicação

```bash
docker compose restart
```

Ou:

```bash
docker compose down
docker compose up -d
```

---

# 📦 Docker Compose

A aplicação utiliza um container para a API.

```yaml
services:

  api:
    build:
      context: .
      dockerfile: Dockerfile

    container_name: sistema-reserva-salas-api

    ports:
      - "3001:3001"

    env_file:
      - .env

    restart: unless-stopped
```

Arquitetura:

```text
┌──────────────────────────────────┐
│          Docker Desktop          │
│                                  │
│  ┌────────────────────────────┐  │
│  │ API                        │  │
│  │                            │  │
│  │ Node.js                    │  │
│  │ Express                    │  │
│  │ Sequelize                  │  │
│  │                            │  │
│  │ localhost:3001             │  │
│  └──────────────┬─────────────┘  │
│                 │                │
└─────────────────┼────────────────┘
                  │
                  │ Internet
                  ▼
        ┌─────────────────────┐
        │      Supabase       │
        │                     │
        │ PostgreSQL          │
        └─────────────────────┘
```

---

# 🐘 Banco de dados

O banco utilizado pela aplicação é:

```text
PostgreSQL
```

Hospedado no:

```text
Supabase
```

A API utiliza o Sequelize como ORM.

```text
Node.js
   ↓
Sequelize
   ↓
PostgreSQL
   ↓
Supabase
```

---

# 🗃️ Migrations

As tabelas do banco são gerenciadas através do Sequelize CLI.

As principais entidades são:

```text
users
rooms
reservations
```

---

## Verificar status das migrations

Execute dentro do container:

```bash
docker compose exec api npx sequelize-cli db:migrate:status
```

---

## Executar migrations

```bash
docker compose exec api npx sequelize-cli db:migrate
```

---

## Desfazer a última migration

```bash
docker compose exec api npx sequelize-cli db:migrate:undo
```

---

## Desfazer todas as migrations

```bash
docker compose exec api npx sequelize-cli db:migrate:undo:all
```

> Use esse comando com cuidado em ambientes que possuam dados importantes.

---

# 🔐 Autenticação

A API utiliza:

```text
JWT — JSON Web Token
```

Após o login, a API retorna um token.

O token deve ser enviado nas requisições protegidas utilizando:

```http
Authorization: Bearer SEU_TOKEN
```

Exemplo:

```http
GET /api/rooms
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# 👥 Perfis de usuário

A aplicação possui dois perfis:

```text
USER
ADMIN
```

### USER

Usuário comum que pode:

* realizar login;
* consultar salas;
* verificar disponibilidade;
* criar reservas;
* consultar suas reservas;
* cancelar/alterar suas reservas conforme as regras da API.

### ADMIN

Administrador que possui permissões adicionais, como:

* cadastrar salas;
* atualizar salas;
* excluir salas;
* alterar status das salas;
* consultar informações administrativas.

A autorização é realizada no backend.

O frontend não é responsável pela segurança.

---

# 🔑 Cadastro de usuário

Por segurança, o cadastro público cria usuários com:

```text
role = USER
```

O cliente não deve poder enviar:

```json
{
    "role": "ADMIN"
}
```

para criar um administrador.

A promoção para administrador deve ser realizada por um processo controlado no backend/banco de dados.

---

# 📚 Swagger / OpenAPI

A API possui documentação através do Swagger.

Após iniciar o Docker, acesse:

```text
http://localhost:3001/api-docs
```

A interface permite:

* visualizar os endpoints;
* consultar parâmetros;
* visualizar schemas;
* executar requisições;
* testar autenticação;
* enviar JWT através do botão `Authorize`.

---

# 🔌 Endpoints principais

## Authentication

### Registrar usuário

```http
POST /api/auth/register
```

Exemplo:

```json
{
    "name": "Bruno Moreira",
    "email": "bruno@email.com",
    "password": "123456"
}
```

---

### Login

```http
POST /api/auth/login
```

Exemplo:

```json
{
    "email": "bruno@email.com",
    "password": "123456"
}
```

Resposta:

```json
{
    "token": "JWT_TOKEN"
}
```

---

# 👤 Users

### Listar usuários

```http
GET /api/users
```

### Buscar usuário

```http
GET /api/users/:id
```

### Criar usuário

```http
POST /api/users
```

### Atualizar usuário

```http
PUT /api/users/:id
```

### Excluir usuário

```http
DELETE /api/users/:id
```

Os endpoints protegidos exigem autenticação e, quando necessário, autorização administrativa.

---

# 🏢 Rooms

### Listar salas

```http
GET /api/rooms
```

### Buscar sala

```http
GET /api/rooms/:id
```

### Criar sala

```http
POST /api/rooms
```

Requer:

```text
ADMIN
```

Exemplo:

```json
{
    "nome": "Sala de Reuniões 01",
    "descricao": "Sala para reuniões administrativas",
    "capacidade": 10,
    "localizacao": "Bloco A - 1º andar",
    "recursos": "Projetor, TV e Wi-Fi"
}
```

### Atualizar sala

```http
PUT /api/rooms/:id
```

Requer:

```text
ADMIN
```

### Excluir sala

```http
DELETE /api/rooms/:id
```

Requer:

```text
ADMIN
```

### Verificar disponibilidade

```http
GET /api/rooms/:roomId/availability
```

Exemplo:

```text
GET /api/rooms/1/availability?startDate=2026-10-05T09:00:00&endDate=2026-10-05T10:00:00
```

### Consultar reservas da sala

```http
GET /api/rooms/:roomId/reservations
```

---

# 📅 Reservations

### Listar reservas

```http
GET /api/reservations
```

### Buscar reserva

```http
GET /api/reservations/:id
```

### Minhas reservas

```http
GET /api/reservations/my
```

### Criar reserva

```http
POST /api/reservations
```

Exemplo:

```json
{
    "roomId": 1,
    "startDate": "2026-10-05T09:00:00",
    "endDate": "2026-10-05T10:00:00"
}
```

O usuário é identificado através do JWT.

---

### Atualizar reserva

```http
PUT /api/reservations/:id
```

O usuário proprietário da reserva ou um administrador poderá realizar alterações conforme as regras da aplicação.

---

### Cancelar reserva

```http
DELETE /api/reservations/:id
```

A reserva passa para:

```text
CANCELADA
```

em vez de necessariamente ser removida fisicamente do banco.

---

# ⚠️ Regra de conflito de reservas

A API impede que duas reservas confirmadas ocupem a mesma sala em períodos conflitantes.

Exemplo:

```text
Reserva existente

09:00 ───────── 11:00
```

Uma nova reserva:

```text
10:00 ───── 12:00
```

é recusada.

Porém:

```text
11:00 ───── 12:00
```

pode ser aceita, pois começa exatamente quando a reserva anterior termina.

A verificação considera apenas reservas:

```text
CONFIRMADA
```

Reservas:

```text
CANCELADA
```

não bloqueiam o horário.

---

# 🧪 Testando a API

A API pode ser testada através de:

* Swagger
* Postman
* Insomnia
* Frontend Next.js
* qualquer cliente HTTP compatível com REST

Recomendação para desenvolvimento:

```text
Swagger
   ↓
Autenticação
   ↓
Obter JWT
   ↓
Authorize
   ↓
Testar endpoints protegidos
```

---

# 🔍 Testando diretamente pelo Docker

Verificar os containers:

```bash
docker compose ps
```

Visualizar logs:

```bash
docker compose logs -f api
```

Entrar no container:

```bash
docker compose exec api sh
```

Verificar versão do Node:

```bash
docker compose exec api node --version
```

Verificar variáveis do banco:

```bash
docker compose exec api printenv | grep DB_
```

> Não compartilhe publicamente o valor de `DB_PASSWORD`.

---

# 🛠️ Desenvolvimento sem Docker

Também é possível executar a API diretamente no computador.

Instale:

* Node.js
* npm

Depois:

```bash
npm install
```

Configure o `.env`.

Execute:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

# 📦 Scripts

Os principais scripts são:

```bash
npm run dev
```

Executa a aplicação utilizando Nodemon.

```bash
npm start
```

Executa a aplicação em modo normal.

---

# 🐳 Dockerfile

A imagem utiliza Node.js 22:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

---

# 🚫 .dockerignore

Exemplo:

```text
node_modules
npm-debug.log
.git
.gitignore
.env
coverage
.vscode
```

O `.env` não é copiado para a imagem Docker. Ele é disponibilizado ao container através do:

```yaml
env_file:
    - .env
```

---

# 🔒 Segurança

Nunca versionar:

```text
.env
```

Nunca publicar:

```text
DB_PASSWORD
JWT_SECRET
```

No GitHub, utilize:

```text
.env.example
```

Exemplo:

```env
NODE_ENV=development
PORT=3001

DB_HOST=
DB_PORT=5432
DB_NAME=postgres
DB_USER=
DB_PASSWORD=
DB_SSL=true

JWT_SECRET=
JWT_EXPIRES_IN=1h
```

---

# 🌳 Fluxo de desenvolvimento

Uma sugestão de fluxo utilizando Git:

```text
main
 │
 ├── feature/authentication
 │
 ├── feature/users
 │
 ├── feature/rooms
 │
 ├── feature/reservations
 │
 ├── feature/swagger
 │
 └── fix/...
```

Após concluir uma funcionalidade:

```bash
git status
```

```bash
git add .
```

```bash
git commit -m "feat: implementa gerenciamento de salas"
```

```bash
git push -u origin nome-da-branch
```

Depois, abrir um Pull Request para `main`.

---

# 🔄 Fluxo da aplicação

```text
Cliente
   │
   ▼
Express Router
   │
   ▼
Middleware
   │
   ├── Autenticação JWT
   │
   └── Autorização
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├── Validator
   ├── Builder
   └── Regras de negócio
   │
   ▼
Repository
   │
   ▼
Sequelize
   │
   ▼
PostgreSQL
   │
   ▼
Supabase
```

---

# 🏛️ Separação de responsabilidades

A aplicação segue uma divisão clara entre as camadas.

### Routes

Responsáveis por:

* definir endpoints;
* receber requisições;
* configurar middlewares;
* direcionar chamadas para controllers.

### Controllers

Responsáveis por:

* receber `request`;
* chamar o Service;
* construir a resposta HTTP.

### Services

Responsáveis pelas:

* regras de negócio;
* validações de fluxo;
* orquestração das operações.

### Validators

Responsáveis por:

* validar dados de entrada;
* impedir dados inválidos.

### Builders

Responsáveis por:

* construir objetos de domínio/dados;
* organizar a criação das entidades.

### Repositories

Responsáveis por:

* comunicação com o banco;
* operações de persistência;
* consultas utilizando Sequelize.

### Models

Responsáveis pela representação das entidades no Sequelize.

---

# 📐 Modelo de dados

A aplicação possui três entidades principais:

```text
┌──────────────┐
│    USERS     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ password     │
│ role         │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────────┐
│   RESERVATIONS   │
├──────────────────┤
│ id               │
│ userId           │
│ roomId           │
│ startDate        │
│ endDate          │
│ status           │
└────────┬─────────┘
         │
         │ N:1
         ▼
┌──────────────┐
│    ROOMS     │
├──────────────┤
│ id           │
│ nome         │
│ descricao    │
│ capacidade   │
│ localizacao  │
│ recursos     │
│ status       │
└──────────────┘
```

Relacionamentos:

```text
User 1 ─────── N Reservation
Room 1 ─────── N Reservation
```

---

# 🩺 Troubleshooting

## Container reiniciando continuamente

Verifique:

```bash
docker compose logs -f api
```

Se aparecer:

```text
exited with code 1
```

a aplicação encontrou um erro durante a inicialização.

---

## Erro `ENETUNREACH`

Exemplo:

```text
SequelizeConnectionError:
connect ENETUNREACH
```

Esse erro indica que o container não conseguiu alcançar o endereço do PostgreSQL.

Verifique:

```env
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
```

Quando estiver utilizando Supabase, verifique também se a conexão escolhida é adequada para o ambiente Docker, como o Session Pooler.

---

## Verificar o host dentro do container

```bash
docker compose exec api printenv DB_HOST
```

Também é possível verificar a resolução DNS:

```bash
docker compose exec api getent hosts SEU_DB_HOST
```

---

## Alterou o Dockerfile e a alteração não apareceu

Reconstrua a imagem:

```bash
docker compose build --no-cache
```

Depois:

```bash
docker compose up
```

---

# 📁 Arquivos importantes

| Arquivo                       | Responsabilidade              |
| ----------------------------- | ----------------------------- |
| `index.js`                    | Inicialização da aplicação    |
| `src/app.js`                  | Configuração do Express       |
| `src/config/database.js`      | Configuração do banco         |
| `src/config/sequelize-cli.js` | Configuração do Sequelize CLI |
| `.sequelizerc`                | Configuração das migrations   |
| `Dockerfile`                  | Construção da imagem          |
| `docker-compose.yml`          | Orquestração do container     |
| `.env`                        | Variáveis de ambiente         |
| `.env.example`                | Modelo das variáveis          |
| `src/shared/database/`        | Conexão, models e migrations  |
| `src/shared/docs/`            | Documentação Swagger          |
| `src/shared/middlewares/`     | Middlewares compartilhados    |
| `src/modules/`                | Módulos da aplicação          |

---

# 🎯 Objetivo do projeto

O projeto tem como objetivo desenvolver uma API REST completa para gerenciamento de reservas de salas, aplicando conceitos de desenvolvimento de software como:

* Programação Orientada a Objetos;
* SOLID;
* Clean Code;
* Clean Architecture;
* Design Patterns;
* REST API;
* autenticação JWT;
* autorização por perfil;
* persistência com PostgreSQL;
* ORM com Sequelize;
* migrations;
* documentação OpenAPI/Swagger;
* containerização com Docker;
* integração com Supabase.

---

# 📌 Status do projeto

🚧 **Em desenvolvimento**

Funcionalidades previstas/implementadas:

* [x] Configuração do Node.js
* [x] Express
* [x] PostgreSQL
* [x] Sequelize
* [x] Migrations
* [x] Arquitetura modular
* [x] Programação Orientada a Objetos
* [x] Repository
* [x] Service Layer
* [x] Builder Pattern
* [x] Bridge Pattern
* [x] JWT
* [x] Controle de acesso
* [x] CRUD de salas
* [x] Verificação de disponibilidade
* [x] Regra de conflito de reservas
* [x] Swagger/OpenAPI
* [x] Docker
* [x] Docker Compose
* [x] Integração com Supabase
* [ ] Testes automatizados
* [ ] CI/CD
* [ ] Deploy da API

---

# 👨‍💻 Autor

**Bruno Moreira**

Desenvolvedor de Software Full Stack

GitHub:

https://github.com/fbmcarmo

LinkedIn:

https://www.linkedin.com/in/fbmcarmo/

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de aprendizado em desenvolvimento de software.

