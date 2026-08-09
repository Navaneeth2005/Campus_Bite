# Campus Bite 🍴

A full-stack college food delivery platform. Students browse canteen menus, build a cart, and place orders that get delivered to their dorm; canteen admins manage the menu and track order status.

Built as a genuine, end-to-end application — every feature below talks to a real database through a real REST API.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Authentication Flow](#authentication-flow)
6. [API Endpoints](#api-endpoints)
7. [MongoDB Schema Overview](#mongodb-schema-overview)
8. [Environment Variables](#environment-variables)
9. [Running Locally](#running-locally)
10. [Seeding Data](#seeding-data)
11. [API Testing](#api-testing)
12. [Future Improvements](#future-improvements)

---

## Features

**Student flow**
- Register / login with JWT authentication (passwords hashed with bcrypt)
- Browse the menu with **debounced search** and category filters
- Add items to a cart, change quantities, see live totals
- Place an order (prices are computed server-side, never trusted from the client)
- Track order history and live status (pending → preparing → delivered)

**Admin / canteen flow**
- Add, edit and delete menu items
- Mark items available / unavailable
- View all orders and update their status

**Engineering**
- Modular Express REST API (routes → controllers → models) with centralized error handling
- MongoDB + Mongoose with indexed, validated schemas
- Role-based authorization (user vs admin)
- Security: bcrypt, JWT, Helmet, CORS allow-list, express-validator, `.env` secrets (never committed)
- Responsive React UI with Tailwind CSS (mobile / tablet / desktop)
- Reusable component library, React Context for global state, lazy-loaded routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 7, Context API, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose (ODM) |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS |
| Dev tooling | Nodemon, Git |

---

## Architecture

```
React UI
   │  fetch() via centralized api service (src/api/api.js)
   ▼
Express REST API  (Backend/src)
   │  routes → validate → authenticate/authorize → controllers
   ▼
Mongoose models (User, MenuItem, Order)
   ▼
MongoDB
   ▲
response → React Context (AuthContext / CartContext) → UI updates
```

State ownership:
- **AuthContext** — global auth state (user, token, login/logout/register)
- **CartContext** — global cart state (items, quantities, totals), persisted to `localStorage`
- **Local page state** — everything else (filters, forms, loading flags) stays in the page component

---

## Folder Structure

```
Campus_Bite-main/
├── Backend/
│   ├── .env.example              # copy to .env
│   ├── package.json
│   ├── scripts/
│   │   └── seed.js               # seed menu + admin account
│   └── src/
│       ├── server.js             # entry point (connect DB, listen)
│       ├── app.js                # express app (middleware, routes, errors)
│       ├── config/
│       │   ├── env.js            # environment variables
│       │   └── db.js             # mongoose connection
│       ├── models/
│       │   ├── User.js
│       │   ├── MenuItem.js
│       │   └── Order.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── menu.controller.js
│       │   └── order.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── menu.routes.js
│       │   └── order.routes.js
│       ├── middleware/
│       │   ├── auth.js           # authenticate + authorize roles
│       │   ├── validate.js       # express-validator results
│       │   ├── errorHandler.js   # centralized errors
│       │   └── notFound.js
│       ├── services/
│       │   └── token.service.js  # JWT sign/verify
│       └── utils/
│           └── AppError.js
│
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx              # providers + router
│       ├── App.jsx               # routes (lazy loaded)
│       ├── index.css             # Tailwind directives
│       ├── api/
│       │   └── api.js            # centralized REST client
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── UI/               # Button, Input
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── MenuCard.jsx
│       │   ├── CartItem.jsx
│       │   ├── OrderCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── Skeleton.jsx
│       │   ├── ErrorMessage.jsx
│       │   ├── EmptyState.jsx
│       │   └── ProtectedRoute.jsx
│       ├── hooks/
│       │   └── useDebounce.js
│       ├── utils/
│       │   └── format.js
│       └── pages/
│           ├── Home.jsx
│           ├── Menu.jsx
│           ├── Cart.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Orders.jsx
│           ├── Profile.jsx
│           └── Admin.jsx
│
├── .gitignore
└── README.md
```

---

## Authentication Flow

**Registration**
```
Register form → POST /api/auth/register
  → express-validator validates input
  → bcrypt hashes the password (salt rounds = 10)
  → user saved to MongoDB
  → JWT signed ({ id, role }, expires in 24h)
  → { token, user } returned → AuthContext stores it
```

**Login**
```
Login form → POST /api/auth/login
  → backend finds user by email
  → bcrypt.compare verifies the password
  → JWT signed and returned
  → token + user stored in AuthContext (and localStorage)
```

**Protected requests**
```
api.js attaches:  Authorization: Bearer <token>
  → authenticate middleware verifies the JWT
  → loads the user from MongoDB
  → attaches req.user
  → authorize('admin') enforces role where needed
```

The token is stored in `localStorage`; the app validates it against `GET /api/auth/me` on first load.

---

## API Endpoints

Base URL: `http://localhost:5000`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create an account (name, email, college, password) |
| POST | `/api/auth/login` | public | Log in, returns JWT |
| GET | `/api/auth/me` | authenticated | Current user |
| PUT | `/api/auth/profile` | authenticated | Update name / college |
| POST | `/api/auth/logout` | authenticated | Log out (client discards token) |

### Menu
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/menu` | public | List menu (`?category=`, `?q=` search, `?available=`) |
| GET | `/api/menu/:id` | public | Single item |
| POST | `/api/menu` | admin | Add item |
| PUT | `/api/menu/:id` | admin | Update item |
| PUT | `/api/menu/:id/availability` | admin | Toggle available/unavailable |
| DELETE | `/api/menu/:id` | admin | Remove item |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | authenticated | Place an order `{ items: [{ menuItem, quantity }] }` |
| GET | `/api/orders` | authenticated | Current user's orders |
| GET | `/api/orders/:id` | owner/admin | Single order |
| GET | `/api/orders/all` | admin | All orders (`?status=`) |
| PUT | `/api/orders/:id/status` | admin | Update order status |

### Other
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |

---

## MongoDB Schema Overview

**User**
```
name        String (required)
email       String (required, unique, lowercase)
college     String (required)
password    String (hashed with bcrypt, never returned by the API)
role        'user' | 'admin'   (default: 'user')
createdAt / updatedAt (timestamps)
```

**MenuItem**
```
name        String (required)
description String
price       Number (required, min 0)
category    String (required, indexed)
image       String (URL)
available   Boolean (default: true)
```

**Order**
```
user        ObjectId → User (required, indexed)
items       [{ menuItem: ObjectId → MenuItem, name, price, quantity }]
totalAmount Number (computed server-side)
status      'pending' | 'preparing' | 'delivered' | 'cancelled' (default: pending)
```

Order items are **denormalized** (snapshots of name/price at purchase time) so a past order stays accurate even if the menu changes.

---

## Environment Variables

**Backend** (`Backend/.env` — copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_bite
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

**Frontend** (`frontend/.env` — optional, copy from `.env.example`):
```
VITE_API_URL=http://localhost:5000
```

---

## Running Locally

Requirements: **Node.js 18+** and **MongoDB running on `127.0.0.1:27017`**.

### 1. Start MongoDB

If MongoDB isn't installed, download the Community Server zip from the MongoDB Download Center and run:

```
mongod --dbpath <data-dir> --bind_ip 127.0.0.1 --port 27017
```

On the author's machine (portable install) the backend has a convenience script:

```
npm run db:start
```

### 2. Backend

```
cd Backend
npm install
npm run seed          # loads 33 menu items + admin account
npm run dev           # starts on http://localhost:5000
```

### 3. Frontend

```
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```

Open **http://localhost:5173**.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@campusbite.com` | `admin123` |
| Student | register a new account from the sign-up page | — |

---

## Seeding Data

```
npm run seed                  # idempotent - adds menu + admin if missing
node scripts/seed.js --reset  # wipe menu, then reseed
node scripts/seed.js --reset-all  # wipe menu + users + orders, then reseed
```

---

## API Testing

A quick way to exercise the API with `curl`:

```bash
# register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@college.edu","college":"CBIT","password":"secret123"}'

# login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@college.edu","password":"secret123"}'

# authenticated request (use the token from login)
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>"

# place an order
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menuItem":"<menuItemId>","quantity":2}]}'
```

You can also import the endpoints above into **Postman** and use the collection runner for the auth → menu → order flow.

---

## Future Improvements

- Delivery address / hostel room selection and a delivery partner role
- Real-time order tracking (WebSockets or SSE) instead of polling
- Payment integration (UPI / cards)
- Email verification and password reset
- Automated tests (Jest for the backend, React Testing Library for the frontend)
- Docker Compose for one-command setup
- Deployment (Render / Vercel / Atlas) with CI/CD
