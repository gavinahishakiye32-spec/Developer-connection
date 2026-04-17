# Developer Connection 🚀

A full-stack platform where developers showcase skills, post content, and get hired — and employers recruit based on skill level.

## Stack

- **Frontend**: React (Vite) + Tailwind CSS + Axios
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT

## Features

- 🔐 Auth (Register/Login) with role: `developer` or `employer`
- 👤 Developer profiles with skills, bio, and level (beginner/intermediate/experienced)
- 📝 Feed with posts, likes, and comments
- 💼 Job board with level-matching enforcement
- 📩 Applications with status tracking (pending/accepted/rejected)
- 📨 Employer → Developer invitations
- 🔔 Real-time notifications

## Getting Started

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Open

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
developer-connection/
├── server/
│   ├── config/         # DB connection
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Business logic
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth + role checks
│   └── server.js
└── client/
    └── src/
        ├── components/ # Reusable UI
        ├── pages/      # Route pages
        ├── context/    # Auth context
        └── services/   # API calls
```

## Business Rules

- Developers can only apply to jobs matching their level
- Only employers can post jobs
- Employers can search developers and send invitations
- Notifications are created automatically on key events
