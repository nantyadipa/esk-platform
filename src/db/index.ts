import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = globalForDb.db ?? drizzle(pool, { schema })

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export default db
