import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { environmentVariables } from "@/Env";

export const db = drizzle(environmentVariables.DATABASE_URL);
