import { environmentVariables } from '@/Env'
import { drizzle } from 'drizzle-orm/neon-serverless'

export const db = drizzle(environmentVariables.DATABASE_URL)
