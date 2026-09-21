# TimeFlow — Task and Time Tracking App

This is a Full Stack task and time tracking application built as a technical assignment. It allows users to create tasks, track their time using a live timer, view time log sessions, and get a daily summary of their productivity.

## Important Links

- **GitHub Repository:** [lokeshwardewangan/taskflow-time-tracking-app](https://github.com/lokeshwardewangan/taskflow-time-tracking-app)
- **Live Frontend:** [https://timeflow-task-tracker.vercel.app/](https://timeflow-task-tracker.vercel.app/)
- **Backend Health/API:** [https://timeflow-task-tracker-api.vercel.app/health](https://timeflow-task-tracker-api.vercel.app/health)
- **Postman API Collection:** [Workspace Link](https://www.postman.com/lokeshwar-dewangan/workspace/assignment-task)
- **Assignment Brief:** [Notion Link](https://curved-memory-1dd.notion.site/Full-Stack-Assignment-1eb1fc0d84b0803f9f43d02ce956b10f)

---

## Features

- **Authentication:** Secure user signup and login with JWT and bcrypt password hashing.
- **Task Management:** Full CRUD operations (Create, Read, Update, Delete) for tasks.
- **Status Workflows:** Move tasks between *Pending*, *In Progress*, and *Completed* states.
- **Real-Time Time Tracking:** Live timer ticking on the frontend that synchronizes automatically with backend endpoints. Automatically manages concurrent timers.
- **Time Logs:** View a detailed history of individual tracking sessions and total duration for any task.
- **Daily Dashboard:** View daily aggregated productivity metrics, a bar chart of time spent per task, and an activity table.
- **AI Task Assistant:** Leverage OpenAI integration to refine and improve task descriptions.

---

## Tech Stack

**Frontend**
- React 19 & Vite
- React Router (v8)
- Tailwind CSS v4
- Shadcn & Base UI
- React Query (TanStack)
- React Hook Form & Zod (Validation)
- React ApexCharts

**Backend**
- Node.js / Bun
- Express.js
- Prisma ORM
- PostgreSQL
- Zod (Request Validation)
- OpenAI API

**Tools & Infrastructure**
- Docker & Docker Compose
- Vitest (Testing)
- TypeScript (Strict mode)

---

## Project Structure

This project uses a monorepo structure.

```text
Time-Tracking-App/
├── packages/
│   ├── client/       # React frontend application
│   └── server/       # Express REST API backend and Prisma schema
├── docker-compose.yml
└── package.json
```

---

## Local Setup

### Prerequisites
- [Bun](https://bun.sh/) (or npm/yarn) installed globally.
- PostgreSQL database (if running locally without Docker).

### 1. Install Dependencies
Run the following command at the root of the project to install dependencies for both workspaces:
```bash
bun install
```

### 2. Environment Variables
Navigate to the `packages/server` directory, copy the example environment file, and fill in your database credentials:
```bash
cp packages/server/.env.example packages/server/.env
```
Ensure you provide a valid `DATABASE_URL` and your `OPENAI_API_KEY`. (There may also be an `.env` needed for the `client`).

### 3. Database Migration
Generate the Prisma client and push the schema to your database:
```bash
cd packages/server
bunx prisma generate
bunx prisma db push
```

### 4. Run the Development Servers
From the root directory, start both the frontend and backend servers concurrently:
```bash
bun run dev
```
The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## Docker

If you prefer to run the entire stack (Frontend, Backend, and PostgreSQL) via Docker, ensure Docker Desktop is running, and simply execute:

```bash
docker compose up --build
```
This will automatically provision the PostgreSQL database, run the Prisma migrations, and start both the client and server.

---

## API & Postman

The backend exposes a RESTful API with endpoints protected by JWT authentication. Request bodies and query parameters are strictly validated using Zod.

You can interact with the API using the provided [Postman Collection](https://www.postman.com/lokeshwar-dewangan/workspace/assignment-task).

---

## Testing

The backend contains unit and integration tests covering core business logic and services (e.g., `TaskService`, `TimeLogService`, `TaskAI`).

To run the backend tests:
```bash
cd packages/server
bun run test
```

Manual endpoint testing was comprehensively performed using Postman during development.

---

## AI Development & Usage

Artificial Intelligence tools were utilized during the development lifecycle of this project to accelerate implementation, conduct code reviews, resolve debugging bottlenecks, and refine the AI-assisted task improvement feature itself.

- **Codex / ChatGPT:** Used for architectural decisions, structural implementation, and debugging. [View Chat History](https://chatgpt.com/s/cx_6ab131982b808191a2d19b8db16d5ab0).
- **Google Antigravity:** Used as an agentic IDE assistant for deep codebase refactoring, UI/UX implementation, component extraction, API design, and code review. (Note: Development history was tracked locally; no shareable/exportable link is available).
