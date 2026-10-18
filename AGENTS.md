# AGENTS.MD — PROJECT INSTRUCTIONS FOR AI CODING ASSISTANTS

## Project Overview
- **Name:** Random Food App
- **Structure:** Lightweight Monorepo:
  - `apps/backend`: NestJS + TypeScript + Mongoose + Jest + Swagger
  - `apps/mobile`: React Native + Expo + TypeScript + Expo Router + TanStack Query
  - `docs/`: System documentation (REQUIREMENTS, ARCHITECTURE, DATABASE, API_SPEC, UI_FLOWS, TEST_PLAN, DEVELOPMENT_WORKFLOW)

## Environment & Tooling Rules (Windows Environment)
1. **Node & NPM Execution:**
   - On Windows, always invoke `npm.cmd` and `npx.cmd` in commands instead of bare `npm`/`npx` to prevent PowerShell script execution policy blocking (`.ps1`).
2. **Database Credentials:**
   - MongoDB Atlas connection string MUST remain inside `apps/backend/.env`.
   - Never commit `.env` or hardcode connection strings / JWT secrets in code or frontend.
   - Always maintain `apps/backend/.env.example` and `apps/mobile/.env.example`.
3. **Mobile Networking for Expo Go:**
   - The user tests the mobile app on a real phone using Expo Go over local Wi-Fi.
   - Mobile frontend must connect to the backend using the local machine Wi-Fi IP (e.g. `http://192.168.1.3:3000/api/v1`), never `http://localhost:3000`.

## Engineering & Development Workflow
1. **Superpowers Discipline:**
   - Follow `using-superpowers`, `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, and `verification-before-completion`.
   - Before implementing any non-trivial feature, ensure the plan is broken down into small incremental steps.
   - Maintain the task checklist in the task tracking artifact.
2. **Code Verification:**
   - Run tests using `npm.cmd test` and verify actual output before claiming completion.
   - Run TypeScript typecheck (`npx.cmd tsc --noEmit`) to ensure type safety across frontend and backend.
3. **Coding Standards:**
   - Backend: Clean architecture (Controller -> Service -> Model/Repository). Use `class-validator` for all incoming DTOs.
   - Frontend: Clean component separation, hooks, React Query for server state caching.
   - Error handling: Never leave empty catch blocks. Always provide user-friendly error messages.
