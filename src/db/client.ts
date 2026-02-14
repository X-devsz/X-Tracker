import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import * as schema from './schema';
import { migrations, journal } from './migrations';

const DB_NAME = 'expense-tracker.db';

const expoDb = openDatabaseSync(DB_NAME);

export const db = drizzle(expoDb, { schema });

export async function runMigrations(): Promise<void> {
  console.log('[DB] Running migrations...');
  try {
    await migrate(db, { migrations, journal });
    console.log('[DB] Migrations complete');
  } catch (error) {
    console.error('[DB] Migration failed:', error);
    throw error;
  }
}
