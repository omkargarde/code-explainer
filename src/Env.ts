import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const environmentVariables = createEnv({
  server: {
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(10),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
  },
  client: {},
  runtimeEnv: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
