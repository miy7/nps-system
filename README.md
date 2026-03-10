# NPS Store System

A production-oriented inventory transfer system built with Next.js App Router + Prisma + PostgreSQL.

## Core Features

- Role-based authentication (`admin`, `store`, `viewer`)
- Outbound transfer creation (`PENDING` status)
- Receive approval flow (`COMPLETED` status)
- Inventory dashboard (aggregated from completed transactions)
- Transaction history with filters
- Material master management (admin only)
- Health endpoint for deployment checks: `/api/health`

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Environment Variables

Copy `.env.example` to `.env` and set real values:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/nps_system?sslmode=require"
JWT_SECRET="replace-with-a-strong-secret"
```

Notes:

- For production, `JWT_SECRET` (or `NEXTAUTH_SECRET` / `AUTH_SECRET`) must be set.
- Do not use `localhost` in production `DATABASE_URL`.

## Local Development

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Default Seed Accounts

- `admin / admin123`
- `store / store123`
- `viewer / viewer123`

## Deployment (Vercel)

1. Push this project to Git repository.
2. Create a Vercel project from that repository.
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy.
5. Run database migration on production database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

6. Verify health check:

- `https://<your-domain>/api/health` should return `{ "status": "ok" }`.

## Useful Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run typecheck` - TypeScript check
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - sync schema (non-migration)
- `npm run db:migrate` - apply migrations
- `npm run db:seed` - seed initial users/materials

## RBAC Rules

- `viewer`: dashboard + transaction history only
- `store`: viewer permissions + outbound + approve
- `admin`: store permissions + material master

## Troubleshooting Login Error

If login fails in production but works locally:

1. Check `DATABASE_URL` points to the real production DB.
2. Ensure production DB contains seeded users.
3. Ensure `JWT_SECRET` is set in deployment environment.
4. Confirm schema is applied (`prisma migrate deploy`).
