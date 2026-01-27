# Development Rules

## TypeScript Configuration

- Strict TypeScript mode enabled
- All async functions should handle errors appropriately

## Code Quality

- ESLint + oxlint with TanStack rules enforced
- Use `bun run lint` for checking code quality
- Use `bun run check` for formatting and fixing issues

## Testing

- Test framework: Vitest
- Run all tests: `bun run test`
- Run single test: `bun run test <file>`

## Development Practices

- Follow existing code patterns and conventions
- Use functional components only
- Implement proper error handling for async operations
