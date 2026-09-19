# Real-time Notification System — Gmail Clone

> Event-driven microservices Gmail clone with real-time push notifications, built with Node.js, Kafka, Socket.IO, MongoDB, and React.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://reactjs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.x-black)](https://socket.io)
[![Kafka](https://img.shields.io/badge/Kafka-2.12--2.2.1-orange)](https://kafka.apache.org)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Running Services Locally](#running-services-locally)
- [API Reference](#api-reference)
- [Event-Driven Flows](#event-driven-flows)
- [Real-time Layer (Socket.IO)](#real-time-layer-socketio)
- [Frontend (Client)](#frontend-client)
- [Database Models](#database-models)
- [Testing](#testing)
- [Swagger / OpenAPI Docs](#swagger--openapi-docs)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository implements a **Gmail-like email/notification system** as a distributed microservices application. Users can register, log in, compose messages, view inbox/sent/starred, search, and receive **instant real-time notifications** via WebSockets.

Authentication is handled by a dedicated service issuing JWT access/refresh tokens. User profile data is managed separately and kept in sync via **Apache Kafka** events. The notification service persists messages (treated as emails) and pushes them live to online users through **Socket.IO**. An **API Gateway** fronts all HTTP traffic, validates sessions via the Auth Service, and proxies to downstream services. The frontend is a React + Vite SPA styled with Tailwind CSS.

---

## Features

- **Authentication & Session Management**
  - Register with `name`, `email`, `password`, `birthDate`, `gender` (`auth-service/services/authService.js:8`)
  - Login with JWT access + refresh tokens stored as `httpOnly` cookies (`auth-service/controllers/authController.js:31`)
  - `GET /auth/me` validates token and returns `X-User-Id`/`X-User-Email` headers for gateway propagation
  - Token refresh (`POST /auth/refresh-token`) and logout with refresh-token revocation
  - Password update by email (`PUT /auth/update-password/email/:email`)
  - Bcrypt hashing (10 salt rounds), JWT verification, automatic 401 handling in gateway

- **User Service**
  - CRUD: `GET /users`, `POST /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id`
  - Lookup by email: `GET /users/email/:email`, `PUT /users/email/:email`
  - Kafka consumer for `userRegistered` events — creates a profile in `User` collection (`user-service/events/userEventsConsumer.js:4`)
  - Publishes `userNameUpdated` event when profile name changes (`user-service/services/userService.js:60`) — consumed by notification service to denormalize names

- **Notification / Email Service**
  - Model with `title`, `content`, `senderEmail`, `senderName`, `receiverEmail`, `receiverName`, `category` (`inbox`|`spam`|`starred`), `isRead` (`notification-service/models/Notification.js:3`)
  - Full-text index on `title` + `content` + regex fallback for short queries (`notification-service/repositories/notificationRepository.js:58`)
  - Endpoints: `GET /notifications/receiver-email/:email` (inbox + sent), `GET /notifications/search/:email?q=`, `GET|PUT|DELETE /notifications/:id`
  - Real-time delivery + persistence in a single Socket.IO `notification` handler (`notification-service/utils/socketHandler.js:54`)
  - Kafka consumer for `userNameUpdated` to update denormalized sender/receiver names (`notification-service/events/notificationEventConsumer.js:4`)

- **API Gateway**
  - Central entry point on `:3000` — proxies `/api/auth/*`, `/api/users/*` (auth-guarded), `/api/notifications/*` (auth-guarded) via `http-proxy-middleware` (`api-gateway/routes/proxy.js:16`)
  - `authenticate` middleware forwards cookies to `GET /auth/me` and injects `X-User-Id`/`X-User-Email` on success (`api-gateway/middlewares/authMiddleWare.js:4`)
  - CORS configured for `http://localhost:8000` with credentials

- **Client (React SPA)**
  - Pages: `/login`, `/register`, `/dashboard` (inbox), `/starred`, `/sent`, `/compose`, `/email/:id`, `/settings`, `*` → NotFound (`client/src/App.jsx:12`)
  - `AuthContext` manages `localStorage` user, token, and `js-cookie` — with axios interceptor for silent refresh on 401 (`client/src/utils/axiosInstance.js:22`)
  - `ComposeEmail` validates recipient, subject, body and emits `notification` via Socket.IO (`client/src/components/Email/ComposeEmail.jsx:20`)
  - `Dashboard` joins socket room (`join` event), fetches `GET /api/notifications/receiver-email/:email`, listens for `notification` push, and filters by route + search query (`client/src/pages/Dashboard.jsx:16`)
  - Layout with `Header`/`Sidebar`/`MainLayout`, Tailwind styling, `lucide-react` icons

- **Cross-cutting**
  - Swagger/OpenAPI docs per service (`/api-docs`)
  - Centralized `HTTP_STATUS` constants and error middleware
  - Graceful Kafka producer/consumer shutdown on `SIGINT`/`SIGTERM`

---

## Architecture

```
                    ┌─────────────────┐
                    │  React Client    │
                    │  Vite :8000      │◄─────────┐
                    └────────┬────────┘          │
                             │ HTTP / WS          │ Socket.IO
                             ▼                    │
                    ┌─────────────────┐           │
                    │  API Gateway     │           │
                    │  :3000           │           │
                    │  /api/* proxy    │           │
                    └────────┬────────┘           │
                             │                    │
              ┌──────────────┼──────────────┐     │
              ▼              ▼              ▼     │
     ┌────────────┐  ┌────────────┐  ┌──────────────────┐
     │ Auth       │  │ User       │  │ Notification     │───┘
     │ :3001      │  │ :3002      │  │ :3003 + Socket.IO│
     │ Mongo      │  │ Mongo      │  │ Mongo            │
     └─────┬──────┘  └─────▲──────┘  └────────┬─────────┘
           │               │                  │
           │ userRegistered│                  │ userNameUpdated
           └──────────────►│                  │
                      Kafka│◄─────────────────┘
                    ┌──────┴──────┐
                    │  Kafka :9092 │
                    │  Zookeeper   │
                    │  :2181       │
                    └─────────────┘
                           ▲
                    ┌──────┴──────┐
                    │  MongoDB    │
                    │  :27017     │
                    └─────────────┘
```

**Request flow (authenticated):**

1. Browser → `API Gateway` (`POST /api/users/email/...` with `access_token` cookie)
2. Gateway `authenticate` → `Auth Service GET /auth/me` with cookie header
3. On 200, gateway proxies to `User Service` with `X-User-Id` header
4. Response flows back through gateway to client

**Real-time flow (compose email):**

1. `ComposeEmail.jsx` → `socket.emit("notification", {senderEmail, receiverEmail, title, content, category:"inbox"})`
2. `notification-service/utils/socketHandler.js:54` → `getNames()` fetches sender/receiver names from User Service via HTTP
3. `notificationService.createNotification()` persists to Mongo
4. If `receiverEmail` is in `onlineUsers` map, `io.to(socketId).emit("notification", event)` pushes instantly
5. `Dashboard.jsx:37` listener prepends notification to state

**Event-driven sync:**

- `authService.register()` → `sendEvent("userRegistered", [{value: JSON.stringify({email, userId, name, birthDate, gender})}])` (`auth-service/services/authService.js:23`)
- `user-service` consumer `handleUserRegistered` → `userService.createUser({ _id: userId, ...body })`
- `userService.updateUserByEmail()` → `sendEvent("userNameUpdated", [{value: JSON.stringify({email, name})}])`
- `notification-service` consumer `handleUserNameUpdatedEvent` → `updateManyNotifications` for both `senderEmail` and `receiverEmail`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router 6, Vite 5, Tailwind CSS 3, Axios, Socket.IO Client 4.8, js-cookie |
| **Gateway** | Node 18, Express 5, http-proxy-middleware 3, Axios, CORS, Morgan, Swagger |
| **Auth Service** | Express 5, Mongoose 8, bcrypt 6, jsonwebtoken 9, kafkajs 2, Swagger |
| **User Service** | Express 5, Mongoose 8, kafkajs 2, Swagger |
| **Notification Service** | Express 5, Mongoose 8, Socket.IO 4.8, Axios, CORS, Swagger |
| **Messaging** | Apache Kafka 2.12-2.2.1 + Zookeeper (Bitnami) |
| **Database** | MongoDB 6 |
| **Infra** | Docker & Docker Compose, Nodemon (dev) |

---

## Project Structure

```
Real-time-Notification-System/
├── docker-compose.yml              # Zookeeper, Kafka, Mongo
├── api-gateway/
│   ├── index.js                    # Express + CORS + /api proxy (api-gateway/index.js:1)
│   ├── routes/proxy.js             # http-proxy-middleware targets (api-gateway/routes/proxy.js:1)
│   ├── middlewares/authMiddleWare.js
│   └── package.json
├── auth-service/
│   ├── index.js                    # Express + /auth router + Swagger (auth-service/index.js:1)
│   ├── controllers/authController.js
│   ├── services/authService.js     # register/login/refresh/logout logic
│   ├── models/AuthUser.js          # {email, hashedPassword, refreshTokens}
│   ├── repositories/authRepository.js
│   ├── utils/{kafkaClient,kafkaProducer,constants,functions}.js
│   ├── docs/auth.swagger.js
│   └── Dockerfile                  # EXPOSE 3001
├── user-service/
│   ├── index.js                    # Express + /users router + Kafka consumer boot
│   ├── controllers/userController.js
│   ├── services/userService.js
│   ├── models/User.js              # {email, name, birthDate, gender}
│   ├── repositories/userRepository.js
│   ├── events/userEventsConsumer.js
│   ├── utils/{kafkaClient,kafkaConsumer,kafkaProducer,constants,functions}.js
│   ├── docs/user.swagger.js
│   └── Dockerfile                  # EXPOSE 3002
├── notification-service/
│   ├── index.js                    # Express + http.Server + Socket.IO + /notifications (notification-service/index.js:1)
│   ├── controllers/notificationController.js
│   ├── services/notificationService.js
│   ├── models/Notification.js      # {title, content, sender/receiver Email+Name, category, isRead}
│   ├── repositories/notificationRepository.js  # text search + CRUD
│   ├── events/notificationEventConsumer.js
│   ├── utils/{kafkaClient,kafkaConsumer,socketHandler,constants,functions}.js
│   ├── docs/notification.swagger.js
│   └── package.json                # (no Dockerfile committed; use same pattern as other services)
├── client/
│   ├── index.html
│   ├── vite.config.js              # server.port = 8000
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx                 # Routes + ProtectedRoute
│   │   ├── main.jsx
│   │   ├── contexts/AuthContext.jsx
│   │   ├── utils/{axiosInstance,constants}.js
│   │   ├── components/{Socket,Layout/*,Email/*}
│   │   └── pages/{Login,Register,Dashboard,Compose,ViewEmail,Settings,NotFound}.jsx
│   └── package.json                # name: gmail-clone
├── tests/
│   ├── package.json
│   └── unit-tests/{authController,authService,notificationController,notificationService,userController,userService}.unit.test.js
└── LICENSE (MIT)
```

---

## Prerequisites

- **Node.js** 18+ and **npm** 8+
- **Docker** & **Docker Compose** (for Kafka/Zookeeper/Mongo) — or local installs
- **MongoDB** 6+ if not using Docker
- **Git**

Check versions:

```bash
node -v
npm -v
docker --version
docker compose version
```

---

## Environment Variables

Create a `.env` file in **each service directory** (`auth-service/.env`, `user-service/.env`, `notification-service/.env`, `api-gateway/.env`). A root `.env` is not read by the services — each `dotenv.config()` loads from its own folder.

### Shared / Required

| Variable | Example | Description | Used In |
|----------|---------|-------------|---------|
| `MONGO_URI` | `mongodb://localhost:27017/gmail_clone` | MongoDB connection string | auth, user, notification (`* /utils/functions.js:5`) |
| `JWT_SECRET` | `super_secret_jwt_key_change_me` | Secret for signing/verifying JWTs | auth-service (`services/authService.js:5`) |
| `KAFKA_BROKERS` *(implicit)* | `localhost:9092` | Hard-coded in `* /utils/kafkaClient.js:5` — override if needed | all services |

### Auth Service (`auth-service/.env`)

```env
MONGO_URI=mongodb://localhost:27017/gmail_clone
JWT_SECRET=your_jwt_secret_here
AUTH_SERVICE_PORT=3001
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=7d
ACCESS_TOKEN_MAX_AGE=900000        # 15 * 60 * 1000 (ms) — for cookie maxAge
REFRESH_TOKEN_MAX_AGE=604800000    # 7 * 24 * 60 * 60 * 1000
```

### User Service (`user-service/.env`)

```env
MONGO_URI=mongodb://localhost:27017/gmail_clone
USER_SERVICE_PORT=3002
```

### Notification Service (`notification-service/.env`)

```env
MONGO_URI=mongodb://localhost:27017/gmail_clone
NOTIFICATION_SERVICE_PORT=3003
USER_SERVICE_PORT=3002             # used by socketHandler.getNames() to resolve names
```

### API Gateway (`api-gateway/.env`)

```env
PORT=3000
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003
```

> **Tip:** `docker-compose.yml` exposes `mongo:27017`, `kafka:9092`, `zookeeper:2181`. If you run services via Docker, set `MONGO_URI=mongodb://mongo:27017/gmail_clone` and `KAFKA_BROKERS=mongo:9092` accordingly — but the current code hard-codes `localhost:9092`, so Docker networking for Kafka requires either host networking or updating `kafkaClient.js`.

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/<your-org>/Real-time-Notification-System.git
cd Real-time-Notification-System

# Install per-service (or use a workspace script)
npm install --prefix auth-service
npm install --prefix user-service
npm install --prefix notification-service
npm install --prefix api-gateway
npm install --prefix client
npm install --prefix tests
```

### 2. Configure Environment

Create the four `.env` files as shown above (copy the examples and adjust secrets).

For a fast local dev setup, you can create them in one go:

```bash
cat > auth-service/.env <<'EOF'
MONGO_URI=mongodb://localhost:27017/gmail_clone
JWT_SECRET=dev_jwt_secret_change_in_prod
AUTH_SERVICE_PORT=3001
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=7d
ACCESS_TOKEN_MAX_AGE=900000
REFRESH_TOKEN_MAX_AGE=604800000
EOF

cat > user-service/.env <<'EOF'
MONGO_URI=mongodb://localhost:27017/gmail_clone
USER_SERVICE_PORT=3002
EOF

cat > notification-service/.env <<'EOF'
MONGO_URI=mongodb://localhost:27017/gmail_clone
NOTIFICATION_SERVICE_PORT=3003
USER_SERVICE_PORT=3002
EOF

cat > api-gateway/.env <<'EOF'
PORT=3000
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
NOTIFICATION_SERVICE_PORT=3003
EOF
```

### 3. Start Infrastructure

```bash
docker compose up -d
# Verify
docker compose ps
# Logs
docker compose logs -f kafka
```

This starts:
- **Zookeeper** `:2181`
- **Kafka** `:9092` (`KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092`)
- **MongoDB** `:27017` with `mongo-data` volume

### 4. Start Microservices (4 terminals or `concurrently`)

```bash
# Terminal 1 — Auth
npm --prefix auth-service start
# or: node auth-service/index.js

# Terminal 2 — User (auto-starts Kafka consumer)
npm --prefix user-service start

# Terminal 3 — Notification (starts Socket.IO + Kafka consumer)
npm --prefix notification-service start

# Terminal 4 — Gateway
npm --prefix api-gateway start

# Terminal 5 — Client
npm --prefix client run dev
# → http://localhost:8000
```

> The `package.json` scripts currently only have `test` placeholders for backend services — run with `node <service>/index.js` or add `"start": "node index.js"` / `"dev": "nodemon index.js"` to each.

### 5. Verify

```bash
curl http://localhost:3001/api-docs  # Auth Swagger (proxied? direct)
curl http://localhost:3002/api-docs  # User Swagger
curl http://localhost:3003/api-docs  # Notification Swagger
curl http://localhost:3000/api/auth/me -b "access_token=<token>"

# Client
open http://localhost:8000
```

Register a user via UI or curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123","birthDate":"1995-06-15","gender":"female"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

---

## Running Services Locally

| Service | Command | Port | Swagger |
|---------|---------|------|---------|
| API Gateway | `node api-gateway/index.js` | `3000` | `http://localhost:3000/api-docs` *(if swag wired)* |
| Auth Service | `node auth-service/index.js` | `3001` | `http://localhost:3001/api-docs` |
| User Service | `node user-service/index.js` | `3002` | `http://localhost:3002/api-docs` |
| Notification Service | `node notification-service/index.js` | `3003` | `http://localhost:3003/api-docs` |
| Client | `npm --prefix client run dev` | `8000` | — |

All services log with `morgan("dev")` and `colors`. Errors are handled by a centralized middleware returning `{ error: message }` with appropriate `HTTP_STATUS`.

---

## API Reference

Base URL via gateway: `http://localhost:3000/api`

### Auth Service — `auth-service/controllers/authController.js:6`

| Method | Path | Auth | Body / Params | Description |
|--------|------|------|---------------|-------------|
| `GET` | `/api/auth/me` | Cookie `access_token` | — | Validate token, return `{id, email}` + `X-User-*` headers |
| `POST` | `/api/auth/register` | No | `{name, email, password, birthDate, gender}` | Register; emits `userRegistered` Kafka event |
| `POST` | `/api/auth/login` | No | `{email, password}` | Login; sets `access_token` + `refresh_token` httpOnly cookies, returns tokens |
| `POST` | `/api/auth/refresh-token` | No | `{refreshToken}` | Verify refresh token, issue new `access_token` cookie |
| `POST` | `/api/auth/logout` | Cookie `refresh_token` | — | Revoke refresh token, clear cookies |
| `PUT` | `/api/auth/update-password/email/:email` | No | `{password}` (≥6 chars) | Update password (bcrypt hash) |

**Auth examples:**

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@example.com","password":"pass1234","birthDate":"1990-01-01","gender":"male"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt -d '{"email":"bob@example.com","password":"pass1234"}'

# Me
curl http://localhost:3000/api/auth/me -b cookies.txt

# Refresh
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

### User Service — `user-service/controllers/userController.js:8`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/users` | Yes (gateway) | List all users |
| `POST` | `/api/users` | Yes | Create user (internal, also via Kafka) |
| `GET` | `/api/users/:id` | Yes | Get by ID |
| `PUT` | `/api/users/:id` | Yes | Update by ID |
| `PUT` | `/api/users/email/:email` | Yes | Update by email — emits `userNameUpdated` if name changes |
| `DELETE` | `/api/users/:id` | Yes | Delete |
| `GET` | `/api/users/email/:email` | Yes | Get by email (used by notification service) |

### Notification Service — `notification-service/controllers/notificationController.js:8`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/notifications/receiver-email/:email` | Yes | All notifications where user is receiver **or** sender (inbox + sent combined — `services/notificationService.js:38`) |
| `GET` | `/api/notifications/search/:email?q=` | Yes | Full-text search (`$text`) with regex fallback for queries <3 chars |
| `GET` | `/api/notifications/:id` | Yes | Get single notification |
| `PUT` | `/api/notifications/:id` | Yes | Update (e.g., `isRead`, `category` to `starred`) |
| `DELETE` | `/api/notifications/:id` | Yes | Delete |

**Notification examples:**

```bash
# Get inbox + sent
curl http://localhost:3000/api/notifications/receiver-email/alice@example.com -b cookies.txt

# Search
curl "http://localhost:3000/api/notifications/search/alice@example.com?q=meeting" -b cookies.txt

# Mark as read
curl -X PUT http://localhost:3000/api/notifications/<id> \
  -H "Content-Type: application/json" -b cookies.txt \
  -d '{"isRead":true}'

# Star
curl -X PUT http://localhost:3000/api/notifications/<id> \
  -H "Content-Type: application/json" -b cookies.txt \
  -d '{"category":"starred"}'
```

---

## Event-Driven Flows

### Kafka Topics

| Topic | Producer | Consumer | Payload | Purpose |
|-------|----------|----------|---------|---------|
| `userRegistered` | `auth-service` (`services/authService.js:23`) | `user-service` (`events/userEventsConsumer.js:14`) | `{email, userId, name, birthDate, gender}` | Create profile in User DB |
| `userNameUpdated` | `user-service` (`services/userService.js:60`) | `notification-service` (`events/notificationEventConsumer.js:4`) | `{email, name}` | Denormalize names in notifications |

**Kafka client:** `kafkajs` with `clientId: gmail-clone`, `brokers: ['localhost:9092']` (`*/utils/kafkaClient.js:3`). Consumers use groups `user-service-group` and `notification-service-group-username` with `fromBeginning: false`.

---

## Real-time Layer (Socket.IO)

**Server** — `notification-service/utils/socketHandler.js:37`

```js
const io = new Server(server, { cors: { origin: "http://localhost:8000", credentials: true } });
io.on("connection", socket => {
  socket.on("join", ({ userEmail, socketId }) => putSocket(userEmail, socketId));
  socket.on("notification", async event => { /* persist + emit to receiver if online */ });
  socket.on("disconnect", () => onlineUsers.delete(email));
});
```

- `onlineUsers: Map<email, socketId>`, `socketToUsers: Map<socketId, email>`
- `getNames()` resolves names via `GET http://localhost:${USER_SERVICE_PORT}/users/email/:email` before persisting
- `startNotificationEventConsumer()` is awaited at boot (`socketHandler.js:94`)

**Client** — `client/src/components/Socket.js:6`

```js
import { io } from "socket.io-client";
export default function getSocket() {
  if (!socketInstance) socketInstance = io(NOTIFICATION_SERVICE_URL, { withCredentials: true });
  return socketInstance;
}
```

- Singleton socket, `NOTIFICATION_SERVICE_URL = http://localhost:3003` (`client/src/utils/constants.js:2`)
- `Dashboard` emits `join` on `connect`, listens for `notification` and prepends if `receiverEmail === user.email`
- `ComposeEmail` emits `notification` with `{senderEmail, receiverEmail, title, content, category:"inbox"}`

---

## Frontend (Client)

**Stack:** React 18 + React Router 6 + Vite 5 + Tailwind + Axios + Socket.IO Client

**Routes** (`client/src/App.jsx:27`):

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | `Login.jsx` | public |
| `/register` | `Register.jsx` | public |
| `/dashboard` | `Dashboard.jsx` (inbox) | `ProtectedRoute` |
| `/starred` | `Dashboard.jsx` (filter `category===starred`) | `ProtectedRoute` |
| `/sent` | `Dashboard.jsx` (filter `senderEmail===userEmail`) | `ProtectedRoute` |
| `/compose` | `Compose.jsx` → `ComposeEmail.jsx` | `ProtectedRoute` |
| `/email/:id` | `ViewEmail.jsx` | `ProtectedRoute` |
| `/settings` | `Settings.jsx` | `ProtectedRoute` |
| `*` | `NotFound.jsx` | — |

**Auth:** `AuthContext.jsx:19` — `login()` posts to `/api/auth/login`, stores `access_token`/`refresh_token` in `localStorage` + `js-cookie`, sets `user` in context. `axiosInstance` (`client/src/utils/axiosInstance.js:10`) intercepts 401, attempts silent refresh via `POST /api/auth/refresh-token`, retries original request, else redirects to `/login`.

**Dev server:** `vite.config.js:2` → `server.port = 8000`. Build with `npm --prefix client run build`, preview with `npm --prefix client run preview`.

---

## Database Models

**AuthUser** — `auth-service/models/AuthUser.js:4`
```js
{ email: String! unique, hashedPassword: String!, roles: [String]="user",
  isActive: Boolean=false, refreshTokens: [String], createdAt: Date }
```

**User** — `user-service/models/User.js:3`
```js
{ email: String! unique, name: String!, birthDate: Date!, gender: "male"|"female"|"other"!,
  isActive: Boolean=true, createdAt: Date, updatedAt: Date }
```

**Notification** — `notification-service/models/Notification.js:3`
```js
{ title: String!, content: String!, senderEmail: String!, senderName: String!,
  receiverEmail: String!, receiverName: String!, category: "inbox"|"spam"|"starred"!,
  isRead: Boolean=false, createdAt: Date }
  // index: { title: "text", content: "text" }
```

All services share `MONGO_URI` but can point to separate DBs via distinct database names.

---

## Testing

Unit tests live in `tests/unit-tests/` and use `supertest` + `express` mocks:

```
tests/unit-tests/
├── authController.unit.test.js
├── authService.unit.test.js
├── userController.unit.test.js
├── userService.unit.test.js
├── notificationController.unit.test.js
└── notificationService.unit.test.js
```

**Run:**

```bash
npm --prefix tests test
# or per-file with a runner (e.g., jest/mocha if configured)
npx jest tests/unit-tests/authService.unit.test.js
```

> Backend `package.json` scripts are currently placeholders (`"test": "echo \"Error: no test specified\""`). Wire them to `jest --coverage` or `mocha` as needed.

---

## Swagger / OpenAPI Docs

Each service serves Swagger UI at `/api-docs`:

- Auth: `http://localhost:3001/api-docs` — `auth-service/docs/auth.swagger.js:1`
- User: `http://localhost:3002/api-docs` — `user-service/docs/user.swagger.js:1`
- Notification: `http://localhost:3003/api-docs` — `notification-service/docs/notification.swagger.js:1`
- Gateway: `http://localhost:3000/api-docs` (if `docs/gateway.swagger.js` is present — note `api-gateway/index.js:29` references it but file is not yet committed; use service-level docs in the meantime)

Swagger is built with `swagger-jsdoc` + `swagger-ui-express`.

---

## Docker

**Infrastructure only** is containerized in `docker-compose.yml:1`:

```yaml
services:
  zookeeper: bitnami/zookeeper:latest :2181
  kafka: wurstmeister/kafka:2.12-2.2.1 :9092  (KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181)
  mongo: mongo:6 :27017  (volume: mongo-data:/data/db)
```

```bash
docker compose up -d
docker compose logs -f
docker compose down        # stop
docker compose down -v     # stop + delete volumes
```

**Service Dockerfiles** (for microservices):

- `auth-service/Dockerfile:1` — `FROM node:18`, `EXPOSE 3001`, `CMD ["node","index.js"]`
- `user-service/Dockerfile:1` — `FROM node:18`, `EXPOSE 3002`
- `api-gateway/Dockerfile:1` — `FROM node:18`, `EXPOSE 3000`
- `notification-service` — no Dockerfile committed; create one mirroring the others with `EXPOSE 3003`

To containerize all services, extend `docker-compose.yml`:

```yaml
  auth-service:
    build: ./auth-service
    ports: ["3001:3001"]
    env_file: ./auth-service/.env
    depends_on: [mongo, kafka]
  user-service:
    build: ./user-service
    ports: ["3002:3002"]
    env_file: ./user-service/.env
    depends_on: [mongo, kafka]
  notification-service:
    build: ./notification-service
    ports: ["3003:3003"]
    env_file: ./notification-service/.env
    depends_on: [mongo, kafka]
  api-gateway:
    build: ./api-gateway
    ports: ["3000:3000"]
    env_file: ./api-gateway/.env
    depends_on: [auth-service, user-service, notification-service]
```

---

## Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| `Kafka producer connected` never logs / `ECONNREFUSED localhost:9092` | Kafka not running or `KAFKA_ADVERTISED_LISTENERS` mismatch. Ensure `docker compose up -d` and `kafkaClient.js` brokers match compose. Check `docker compose logs kafka`. |
| `MongoDB Connection` fails | `MONGO_URI` wrong or Mongo container down. Try `mongosh mongodb://localhost:27017` or `docker compose logs mongo`. |
| `401 Unauthorized` via gateway | `access_token` cookie missing/expired. Check `api-gateway/middlewares/authMiddleWare.js:11` logs, verify `JWT_SECRET` is identical across auth & gateway (gateway delegates to auth). Try manual `curl -b cookies.txt http://localhost:3001/auth/me`. |
| Socket.IO `notification` not received | Receiver not in `onlineUsers` map — ensure `Dashboard` emitted `join` after `connect`. Check `notification-service/utils/socketHandler.js:51` logs. Verify `USER_SERVICE_PORT` env so `getNames()` can resolve names. |
| CORS errors in browser | Gateway and notification service only allow `http://localhost:8000`. If serving client elsewhere, update `cors({origin})` in `api-gateway/index.js:31` and `notification-service/index.js:23`. |
| `userRegistered` not creating profile | User service consumer not running. Confirm `node user-service/index.js` logs `Kafka consumer started for 'userRegistered' events` (`user-service/events/userEventsConsumer.js:19`). Check topic exists: `docker exec -it <kafka> kafka-topics.sh --list --zookeeper zookeeper:2181`. |
| Vite `port 8000 already in use` | Another process on 8000. Change `client/vite.config.js:3` or `kill $(lsof -ti:8000)`. |
| Swagger 404 at gateway | `api-gateway/docs/gateway.swagger.js` not committed. Use service-level `/api-docs` endpoints directly. |

---

## Roadmap

- [ ] Add `docker-compose` service definitions for all microservices + health checks
- [ ] Centralize env via root `.env` + `dotenv` path config
- [ ] Add refresh-token rotation & httpOnly `secure` handling for non-HTTPS dev
- [ ] Persist `onlineUsers` in Redis for horizontal scaling of notification service
- [ ] Add pagination & sorting to `GET /notifications/*`
- [ ] Add attachment support (S3/MinIO) and `category` filters (`spam`, `starred`) UI
- [ ] Add WebSocket auth (verify `access_token` on `connection`)
- [ ] Add integration & E2E tests (Playwright/Cypress) and CI pipeline
- [ ] Add rate limiting & helmet to gateway
- [ ] Make `kafkajs` brokers configurable via env (`KAFKA_BROKERS`)

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Make changes, add tests under `tests/unit-tests/`
3. Run `npm --prefix tests test` and manual smoke tests via gateway
4. Commit with conventional messages (`feat:`, `fix:`, `docs:`)
5. Open a pull request — include service(s) affected and env changes

---

## License

MIT — Copyright (c) 2025 Omar Mohammad. See [LICENSE](LICENSE) for details.
