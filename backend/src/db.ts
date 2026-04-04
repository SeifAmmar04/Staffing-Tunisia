import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'staffing-db',
  password: '123456789',
  port: 5432,
});