import { environmentVariables } from '@/env'
import { drizzle } from 'drizzle-orm/neon-serverless'

export const db = drizzle(environmentVariables.DATABASE_URL)
