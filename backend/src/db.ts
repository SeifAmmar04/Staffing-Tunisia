import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.postgresql://postgres.dedmkwhuhfgtkhldygmc:SeifAmmar2004.@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true,
  ssl: { rejectUnauthorized: false },
});
