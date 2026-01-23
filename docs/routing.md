# Routing Patterns

## TanStack Router

This project uses TanStack Router with file-based routing in `src/routes/`.

## Key Patterns

- Use `createFileRoute()` for route definitions
- Use `getRouteApi()` for accessing route APIs outside route files
- File-based routing is preferred over code-based routing for better type safety
  and organization

## Route Organization

- Page routes: `src/routes/`
- API routes: `src/routes/api/`
- Nested routes use folder-based structure

## File-Based Routing Conventions

### File Naming Patterns

- `__root.tsx` - Root route file (required)
- `index.tsx` - Index route for exact path matches
- `$param.tsx` - Dynamic route segments
- `_layout.tsx` - Pathless layout routes (prefixed with underscore)
- `folder/route.tsx` - Directory-based routes

### Route Structure Examples

```text
routes/
├── __root.tsx              # Root route
├── index.tsx               # Home page (/)
├── about.tsx               # About page (/about)
├── posts/
│   ├── index.tsx           # Posts index (/posts)
│   ├── $postId.tsx         # Post detail (/posts/$postId)
│   └── $postId.edit.tsx    # Edit post (/posts/$postId/edit)
└── _auth/
    ├── login.tsx          # Login (/login)
    └── register.tsx       # Register (/register)
```

## Route Configuration

### Basic Route

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});
```

### Dynamic Route with Params

```tsx
export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params }) => fetchPost(params.postId),
  component: PostComponent,
});

function PostComponent() {
  const { postId } = Route.useParams();
  return <div>Post ID: {postId}</div>;
}
```

### Layout Route

```tsx
export const Route = createFileRoute("/posts")({
  component: PostsLayout,
});

function PostsLayout() {
  return (
    <div>
      <h1>Posts</h1>
      <Outlet />
    </div>
  );
}
```

## Accessing Route APIs

### Using getRouteApi (for components outside route files)

```tsx
import { getRouteApi } from "@tanstack/react-router";

const postsApi = getRouteApi("/posts");

export function PostsHeader() {
  const posts = postsApi.useLoaderData();
  return <h1>Posts ({posts.length})</h1>;
}
```

### Route Context and Loaders

```tsx
export const Route = createFileRoute("/posts/$postId")({
  beforeLoad: async ({ params }) => {
    const post = await fetchPost(params.postId);
    if (!post) throw new Error("Post not found");
    return { post };
  },
  loader: ({ context }) => context.post,
  component: PostComponent,
});
```

## Type Safety Benefits

TanStack Router provides 100% inferred TypeScript support:

- Type-safe navigation with auto-completion
- Validated search parameters and path params
- Automatic route context inheritance
- Built-in error handling and loading states

## Search Parameters

Search params are first-class citizens with type safety:

```tsx
export const Route = createFileRoute("/posts")({
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    limit: Number(search.limit ?? 10),
    category: search.category as string | undefined,
  }),
  component: PostsComponent,
});

function PostsComponent() {
  const { page, limit, category } = Route.useSearch();
  // ... component logic
}
```
