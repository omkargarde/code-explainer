import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const Env = createEnv({
  server: {
    SERVER_URL: z.url().optional(),
    // gemini
    GEMINI_API_KEY: z.string().min(1),
    // better auth
    BETTER_AUTH_SECRET: z.string().min(10),
    BETTER_AUTH_URL: z.url(),
    // neon db
    DATABASE_URL: z.url(),
    // github oauth
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // runtimeEnv: import.meta.env,
  runtimeEnv: {
    // gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // better auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    // neon db
    DATABASE_URL: process.env.DATABASE_URL,
    // github oauth
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
