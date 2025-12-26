# AGENTS.md

## Build/Test Commands

- `bun run dev` - Start development server (port 3000)
- `bun run build` - Production build
- `bun run test` - Run all tests (Vitest)
- `bun run test <file>` - Run single test file
- `bun run lint` - Run oxlint + eslint + typecheck
- `bun run check` - Format code and fix eslint issues
- `bun run db:push` - Push database schema changes
- `bun run db:m` - Run database migrations
- `bun run db:gen` - Generate database migrations

## Code Style Guidelines

- **Framework**: React 19 + TypeScript, functional components only
- **Routing**: TanStack Router file-based routing in `src/routes/`
- **Styling**: Tailwind CSS + DaisyUI components
- **Imports**: Use `@/*` path aliases (configured in tsconfig.json)
- **State**: TanStack Query for server state, React hooks for local state
- **Auth**: Better Auth with GitHub OAuth integration
- **Database**: Neon PostgreSQL + Drizzle ORM

## Architecture Patterns

- File-based routing with `createFileRoute()`
- Auth middleware in `src/lib/auth-*.ts`
- Database schema in `src/db/schema.ts`
- Shared components in `src/components/`
- API routes in `src/routes/api/`
- Server utilities in `src/utils/server-only-utils/`

## Development Rules

- Strict TypeScript mode enabled
- ESLint + oxlint with TanStack rules enforced
- Use `getRouteApi()` for accessing route APIs outside route files
- Follow TanStack Router patterns from `.cursor/rules/`
- Database changes require migration generation and push
- All async functions should handle errors appropriately
