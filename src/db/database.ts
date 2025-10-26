import { drizzle } from 'drizzle-orm/singlestore/driver'
import { environmentVariables } from '@/env'

export const db = drizzle(environmentVariables.DATABASE_URL)
