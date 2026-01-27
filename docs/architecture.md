# Architecture & Framework Choices

## Core Stack

- **Framework**: React 19 + TypeScript, functional components only
- **Styling**: Tailwind CSS + DaisyUI components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Authentication**: Better Auth with GitHub OAuth integration
- **Database**: Neon PostgreSQL + Drizzle ORM

## Project Structure

- File-based routing with `createFileRoute()`
- Auth middleware in `src/lib/auth-*.ts`
- Database schema in `src/db/schema.ts`
- Shared components in `src/components/`
- API routes in `src/routes/api/`
- Server utilities in `src/utils/server-only-utils/`

## Import Patterns

- Use `@/*` path aliases (configured in tsconfig.json)
- Follow the established import organization in existing files
