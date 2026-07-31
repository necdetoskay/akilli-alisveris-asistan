import { Pool, type PoolClient } from "pg";

import type { DbConfig } from "./config.js";

/**
 * Creates a pg Pool from a validated DbConfig.
 */
export function createPool(config: DbConfig): Pool {
  return new Pool({
    connectionString: config.databaseUrl,
    ...(config.maxConnections !== undefined ? { max: config.maxConnections } : {}),
    ...(config.connectionTimeoutMs !== undefined
      ? { connectionTimeoutMillis: config.connectionTimeoutMs }
      : {}),
  });
}

export type Queryable = Pool | PoolClient | { query: Pool["query"] };

/**
 * Runs `work` inside a single transaction and returns its result.
 * Commits on success, rolls back and rethrows on failure.
 */
export async function runInTransaction<T>(
  pool: Pool,
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}
