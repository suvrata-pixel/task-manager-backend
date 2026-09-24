# Task Tracker API

A backend system for user registration, login, role-based access, and personal task management, built with Node.js, Express, Prisma, and SQLite.

## Tech Stack

- Node.js + Express
- SQLite (via Prisma ORM)
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation
- Jest + Supertest for testing

## Project Structure

    src/
      controllers/     request handlers
      middleware/       auth, role, and error-handling middleware
      routes/           route definitions
      validators/       express-validator rules
      utils/            prisma client and JWT helper
      scripts/          one-off admin-promotion script
      app.js            express app setup
      server.js         entry point
    prisma/
      schema.prisma     database schema
    tests/
      unit/             unit tests (hashing, token generation)
      api/              integration tests against the running app
    .env.example

## 1. Setup

Install dependencies:

    npm install

Create your local environment file:

    cp .env.example .env

Open `.env` and set a real value for `JWT_SECRET` (any long random string). Leave `DATABASE_URL` as `file:./dev.db` unless you want to point it elsewhere.

Generate the Prisma client and create the database:

    npx prisma generate
    npx prisma migrate dev --name init

This creates `dev.db` in the project root with the `User` and `Task` tables.

## 2. Run the server

    npm run dev

or, without auto-reload:

    npm start

The API will be available at `http://localhost:5000`.

## 3. Run tests

    npm test

This runs both unit tests (`tests/unit`) and integration tests (`tests/api`). Tests run against a separate `test.db` SQLite file (created automatically before tests run), so they never touch your development data.

## 4. Creating an admin user

There is no public endpoint to create an admin account — that's intentional, since anyone who could self-promote to admin would defeat the role check. Register a normal user through `/auth/register`, then promote them from the command line:

    npm run make-admin -- yourname@example.com

## API Reference

### Auth

**POST /auth/register**

    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "password123"
    }

Returns `201` with the created user (no password field).

**POST /auth/login**

    {
      "email": "jane@example.com",
      "password": "password123"
    }

Returns `200` with `{ "token": "<jwt>" }`.

All protected routes below require the header:

    Authorization: Bearer <token>

### Users

| Method | Route | Access | Description |
|---|---|---|---|
| GET | /users | admin only | List all users |
| GET | /users/me | any authenticated user | View own profile |
| DELETE | /users/:id | admin only | Delete a user |

### Tasks

| Method | Route | Access | Description |
|---|---|---|---|
| POST | /tasks | any authenticated user | Create a task |
| GET | /tasks | any authenticated user | List own tasks (admin sees all) |
| PUT | /tasks/:id | owner or admin | Update a task |
| DELETE | /tasks/:id | owner or admin | Delete a task |

Task body:

    {
      "title": "Finish assignment",
      "description": "Optional details",
      "status": "pending"
    }

`status` must be `pending` or `completed`.

## Sample requests (curl)

Register:

    curl -X POST http://localhost:5000/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'

Login:

    curl -X POST http://localhost:5000/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"jane@example.com","password":"password123"}'

Create a task (replace `<TOKEN>`):

    curl -X POST http://localhost:5000/tasks \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <TOKEN>" \
      -d '{"title":"Finish assignment"}'

Get own tasks:

    curl http://localhost:5000/tasks \
      -H "Authorization: Bearer <TOKEN>"

## Security notes

- Passwords are hashed with bcrypt before storage; plain text passwords are never saved.
- JWT secret and database URL are read from environment variables, never hard-coded.
- `.env` is in `.gitignore` and is not committed. `.env.example` documents required variables without real values.
- Role checks happen server-side on every protected route; a normal user cannot access another user's tasks or the admin-only endpoints even with a valid token.
