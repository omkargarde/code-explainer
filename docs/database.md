# Database Operations

## Database Stack

- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Schema**: Defined in `src/db/schema.ts`

## Database Commands

- `bun run db:push` - Push database schema changes
- `bun run db:m` - Run database migrations
- `bun run db:gen` - Generate database migrations

## Database Rules

- Database changes require migration generation and push
- All database operations should use Drizzle ORM patterns
- Follow existing schema patterns in `src/db/schema.ts`
