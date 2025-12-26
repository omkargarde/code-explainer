import { drizzle } from "drizzle-orm/neon-serverless";
import { Env } from "@/Env";

export const db = drizzle(Env.DATABASE_URL);
