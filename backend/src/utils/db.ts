// backend/src/utils/db.ts
import { Pool } from 'pg';

console.log('DEBUG: DATABASE_URL used:', process.env.DATABASE_URL); // <-- ADD THIS LINE


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Function to initialize the database schema
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- Add a function to update updated_at automatically
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Add a trigger to update updated_at on users table
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
          CREATE TRIGGER set_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END $$;
    `);
    console.log('Database schema initialized (users table created/checked).');
    client.release();
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // Exit if database initialization fails
  }
};

// Generic query function
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};