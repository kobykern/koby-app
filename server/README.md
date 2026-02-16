# Koby App — Server

Express + TypeScript + Prisma + PostgreSQL backend with JWT authentication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/koby_app"
PORT=8000
JWT_SECRET="your-generated-secret-here"
JWT_REFRESH_SECRET="your-generated-refresh-secret-here"
```

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice — once for `JWT_SECRET` and once for `JWT_REFRESH_SECRET`.

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run database migrations

```bash
npx prisma db push
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:8000`.

## API Endpoints

### Auth (Public)

| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | `/api/auth/register` | Register a new user  |
| POST   | `/api/auth/login`    | Login                |
| POST   | `/api/auth/refresh`  | Refresh access token |
| POST   | `/api/auth/logout`   | Logout               |

### Users (Protected — requires Bearer token)

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/users`      | Get all users      |
| GET    | `/api/users/:id`  | Get user by ID     |

## Useful Commands

| Command                  | Description                        |
|--------------------------|------------------------------------|
| `npm run dev`            | Start dev server with hot reload   |
| `npx prisma studio`     | Open database GUI at localhost:5555|
| `npx prisma db push`    | Push schema changes to database    |
| `npx prisma generate`   | Regenerate Prisma client           |
| `docker compose up -d`  | Start PostgreSQL container         |
| `docker compose down`   | Stop PostgreSQL container          |