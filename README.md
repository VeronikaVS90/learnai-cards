## LearnAI Cards

LearnAI Cards is a Next.js App Router project that delivers spaced-repetition flashcard learning (à la Anki) with smart scheduling, analytics, and a modern UX.

### Stack

- Next.js 16 (App Router, Server Components, Edge-ready middleware)
- React Query, React Hook Form, Zod, Tailwind CSS
- Prisma ORM + SQLite (dev) with typed env helpers
- Vitest + Testing Library + Playwright for automated tests

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and adjust values as needed. `DATABASE_URL` defaults to a local SQLite file.

3. **Database**

   ```bash
   npm run db:migrate -- --name init   # creates dev.db and runs seed
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command                                  | Purpose                              |
| ---------------------------------------- | ------------------------------------ |
| `npm run dev`                            | Start Next.js in development mode    |
| `npm run build` / `npm run start`        | Build and serve production bundle    |
| `npm run lint`                           | Run ESLint over the repo             |
| `npm run test` / `npm run test:watch`    | Run Vitest unit tests                |
| `npm run test:e2e`                       | Execute Playwright end-to-end tests  |
| `npm run prisma:generate`                | Regenerate Prisma Client             |
| `npm run db:push` / `npm run db:migrate` | Sync schema or create migrations     |
| `npm run db:seed`                        | Seed demo data (users, decks, cards) |

## Conventions

- Shared runtime configuration lives in `src/env.ts`; import from there inside server code.
- Spaced repetition logic is centralized in `src/server/srs/updateSRS.ts` with accompanying unit tests.
- All API/data access should flow through Prisma (see `prisma/schema.prisma` and generated client).
