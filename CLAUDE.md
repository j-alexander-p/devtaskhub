# DevTaskHub — Claude Code Context

## Project overview
DevTaskHub is a full-stack team task management app being built as a portfolio project. Stack: PostgreSQL + Express + TypeScript (backend), React + TypeScript (frontend). Includes an AI-enhanced task description feature.

## Current build status
- ✅ Phase 1: Database schema, project setup, environment config
- ✅ Phase 2: Full auth system (register, login, JWT, httpOnly cookies, authMiddleware, centralized error handling)
- 🔲 Phase 3: Core API routes (projects mostly done, tasks and users in progress)
- 🔲 Phase 4: AI feature
- 🔲 Phase 5: React frontend
- 🔲 Phase 6: Deploy

## Tech stack
- **Backend:** Node.js, Express, TypeScript, PostgreSQL (pg Pool), bcrypt, jsonwebtoken, cookie-parser, dotenv
- **Frontend:** React, TypeScript, React Query
- **Auth:** JWT via httpOnly cookies, centralized error handling middleware

## Folder structure
```
devtaskhub/
  server/
    src/
      controllers/   ← business logic lives here
      routes/        ← thin wiring only, no logic
      middleware/    ← authMiddleware, errorHandler
      db/            ← pg Pool connection
      types/         ← interfaces and shared types
      config.ts
      app.ts
      index.ts
  client/            ← React frontend (not yet started)
```

## Developer context
Julian is a self-taught developer approximately 23 months into learning. This is his first real, full-stack project beyond small exercises. He has solid conceptual understanding but is still building independent execution speed — he can reason through problems but sometimes needs a nudge on SQL syntax and TypeScript specifics.

## Teaching approach — important
This is an active learning environment, not just a build assistant. When Julian asks how to do something:
- **Concept first, code second.** Explain the why before the how.
- **Ask guiding questions** rather than handing solutions directly. Socratic method preferred.
- **Reduced scaffolding over time** — he's in Phase 3 now, so push him to drive more independently.
- **Call out bugs without fixing them** — point to the problem, let him reason through the fix.
- **Be honest, not encouraging** — Julian has explicitly requested accurate assessment over positive reinforcement.
- **SQL and TypeScript** are his two weakest areas — extra patience here, but still push for retrieval.

## Coding conventions
- All errors route through centralized `errorHandler` via `next(err)` — never `res.status(500)` directly in a catch block
- Parameter binding always (`$1, $2`) — never string concatenation in SQL
- `req.userId` comes from `authMiddleware`, never from `req.body`
- Controllers are async functions with `(req, res, next)` — always `export` named, never default
- Status codes: 400 bad input, 401 unauthenticated, 403 unauthorized, 404 not found, 500 server error
- All routes are protected by `authMiddleware` except `POST /auth/register` and `POST /auth/login`

## Database schema summary
- `users` — id, username, email, password_hash, role (default 'member'), created_at
- `projects` — id, project_name, created_by (FK users), status (default 'active'), created_at
- `tasks` — id, title, description, project_id (FK projects CASCADE), created_by (FK users SET NULL), assigned_to (FK users SET NULL), status (default 'pending'), created_at
- `project_members` — project_id + user_id (composite PK), role (default 'member'), created_at
