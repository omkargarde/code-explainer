import { drizzle } from "drizzle-orm/neon-serverless";
import { ENV } from "@/Env";

export const db = drizzle(ENV.DATABASE_URL);
