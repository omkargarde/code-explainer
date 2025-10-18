import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const environmentVariables = createEnv({
  server: {
    // gemini
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    // better auth
    BETTER_AUTH_SECRET: z.string().min(10),
    BETTER_AUTH_URL: z.url(),
    // neon db
    DATABASE_URL: z.url(),
    // github oauth
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    // gemini
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    // better auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    // neon db
    DATABASE_URL: process.env.DATABASE_URL,
    // github oauth
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
});
