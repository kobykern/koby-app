# Koby App

A full-stack mobile application built with React Native (Expo) and Express.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React Native, Expo, TypeScript      |
| Backend    | Express, TypeScript, Prisma         |
| Database   | PostgreSQL (Docker)                 |
| Auth       | JWT (access + refresh tokens)       |

## Project Structure

```
koby-app/
├── client/    ← React Native (Expo) app
├── server/    ← Express API
└── README.md
```

## Quick Start

### 1. Start the database

```bash
cd server
docker compose up -d
```

### 2. Start the backend

```bash
cd server
npm install
npx prisma db push
npx prisma generate
npm run dev
```

### 3. Start the frontend

```bash
cd client
npm install
npx expo start --clear
```

See individual READMEs for detailed setup:

- [Server README](./server/README.md)
- [Client README](./client/README.md)