import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/brev_ly',
});
export const db = drizzle(pool, { schema });
