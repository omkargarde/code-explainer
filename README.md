# Code Explainer - Technical Interview Prep Platform

An AI-powered platform that helps you master technical interviews by generating tailored questions from your study notes and providing instant feedback on your verbal answers.

<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/801dc985-d8d4-457c-b6a3-e0abfd607bd5" />

## Project Summary

Upload your study materials, generate personalized interview questions, and practice with AI-powered audio feedback to improve your technical interview performance.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-organization/code-explainer.git
   cd code-explainer
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**

   ```bash
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run test` - Run tests
- `bun run lint` - Run linting
- `bun run format` - Format code
- `bun run check` - Format and fix code
- `bun run db:gen` - Generate database migrations
- `bun run db:m` - Run database migrations
- `bun run db:push` - Push database schema
- `bun run db:s` - Open database studio

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: TanStack Start, Nitro
- **Database**: Neon (PostgreSQL), Drizzle ORM
- **Authentication**: Better Auth
- **AI**: Google Generative AI
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Testing**: Vitest, Testing Library
- **Build Tool**: Vite

## Features

- 📝 Upload study notes (Markdown support)
- 🤖 AI-generated interview questions
- 🎤 Audio recording for answer practice
- 💬 Instant AI feedback on answers
- 🔐 User authentication
- 📱 Responsive design

## Development

This project uses file-based routing with TanStack Router. Routes are defined in the `src/routes` directory.

For more detailed documentation on the TanStack ecosystem, visit the [TanStack documentation](https://tanstack.com).
