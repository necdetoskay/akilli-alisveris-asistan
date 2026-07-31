export interface DbConfig {
  readonly databaseUrl: string;
  readonly maxConnections?: number;
  readonly connectionTimeoutMs?: number;
}

export class DbConfigError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "DbConfigError";
  }
}

export function loadDbConfig(environment: NodeJS.ProcessEnv = process.env): DbConfig {
  const databaseUrl = environment.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new DbConfigError("Missing required configuration: DATABASE_URL");
  }

  let maxConnections: number | undefined;
  if (environment.DATABASE_POOL_MAX?.trim()) {
    maxConnections = Number(environment.DATABASE_POOL_MAX);
    if (!Number.isInteger(maxConnections) || maxConnections < 1) {
      throw new DbConfigError("DATABASE_POOL_MAX must be a positive integer");
    }
  }

  let connectionTimeoutMs: number | undefined;
  if (environment.DATABASE_CONNECTION_TIMEOUT_MS?.trim()) {
    connectionTimeoutMs = Number(environment.DATABASE_CONNECTION_TIMEOUT_MS);
    if (!Number.isInteger(connectionTimeoutMs) || connectionTimeoutMs < 1) {
      throw new DbConfigError("DATABASE_CONNECTION_TIMEOUT_MS must be a positive integer");
    }
  }

  return {
    databaseUrl,
    ...(maxConnections !== undefined ? { maxConnections } : {}),
    ...(connectionTimeoutMs !== undefined ? { connectionTimeoutMs } : {}),
  };
}
