# Expenses Manager

A full-stack personal expense tracking application, built as a REST API backend (Laravel + Sanctum) paired with a separate React single-page application frontend.

## Tech Stack

**Backend:** Laravel 11, Sanctum (token authentication), PHPUnit
**Frontend:** React (Vite), Tailwind CSS, React Router, Vitest + React Testing Library
**Database:** MySQL

## Architecture

This project is a clean separation between backend and frontend:
- The root of this repository is a Laravel REST API — no Blade views, JSON only.
- `/frontend` is a completely separate React SPA that communicates with the API over HTTP.

This separation was a deliberate choice to demonstrate backend and frontend competencies independently.

## Features

- Full CRUD for expense records (create, view, edit, delete)
- User registration, login, and logout using Sanctum token authentication
- Expenses are scoped per-user — each user only sees and manages their own records
- Policy-based authorization: a user attempting to view/edit/delete another user's expense receives a 403 Forbidden
- Server-side validation matching the OpenAPI specification
- Dark/light theme toggle, persisted across sessions
- 18 automated backend tests (PHPUnit) covering auth, CRUD, validation, and authorization
- Automated frontend component tests (Vitest + React Testing Library)

## Known Deviations from the Original Specification

Documented in full in `openapi.json`:
1. `expense_type` was expanded from 3 categories (`travel`, `food`, `other`) to 5 (`education`, `travel`, `food`, `utility`, `other`).
2. Authentication (Sanctum) was added, which was not part of the original specification, to support per-user data ownership.

## Setup Instructions

### Backend (Laravel API)

\`\`\`bash
composer install
cp .env.example .env
php artisan key:generate
\`\`\`

Update `.env` with your database credentials, then:

\`\`\`bash
php artisan migrate
php artisan serve
\`\`\`

The API will be available at the URL Laravel reports (or via Laragon's virtual host, e.g. `http://expenses-manager.test`).

### Frontend (React SPA)

\`\`\`bash
cd frontend
npm install
\`\`\`

Create a `.env` file inside `/frontend`:

\`\`\`
VITE_API_BASE_URL=http://expenses-manager.test/api
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`.

## Running Tests

**Backend:**
\`\`\`bash
php artisan test
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm test
\`\`\`

## API Documentation

Full API specification is documented in [`openapi.json`](./openapi.json), including all endpoints, request/response schemas, and authentication requirements. This file can be imported directly into Postman or any compatible viewer.