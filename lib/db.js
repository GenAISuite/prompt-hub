// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USER || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME || 'prompt_hub',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  port: process.env.DATABASE_PORT || 5432,
});

export default pool;