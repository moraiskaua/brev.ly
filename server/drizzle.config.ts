import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  verbose: true,
  strict: true,
});
