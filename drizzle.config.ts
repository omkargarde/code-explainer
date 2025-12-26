import { defineConfig } from "drizzle-kit";
import { Env } from "@/Env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Env.DATABASE_URL,
  },
});
