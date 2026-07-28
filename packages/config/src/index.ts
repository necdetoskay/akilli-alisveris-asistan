export type AppEnvironment = "development" | "test" | "production";

export interface ApiConfig {
  readonly appEnv: AppEnvironment;
  readonly host: string;
  readonly port: number;
}

export class ConfigurationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

const allowedEnvironments = new Set<AppEnvironment>(["development", "test", "production"]);

function readRequiredString(
  environment: NodeJS.ProcessEnv,
  key: string,
  fallback?: string,
): string {
  const value = environment[key]?.trim() || fallback;

  if (!value) {
    throw new ConfigurationError(`Missing required configuration: ${key}`);
  }

  return value;
}

function readPort(environment: NodeJS.ProcessEnv): number {
  const rawPort = readRequiredString(environment, "API_PORT", "3000");
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new ConfigurationError("API_PORT must be an integer between 1 and 65535");
  }

  return port;
}

export function loadApiConfig(environment: NodeJS.ProcessEnv = process.env): ApiConfig {
  const appEnvValue = readRequiredString(environment, "APP_ENV", "development");

  if (!allowedEnvironments.has(appEnvValue as AppEnvironment)) {
    throw new ConfigurationError(
      "APP_ENV must be one of development, test or production",
    );
  }

  return {
    appEnv: appEnvValue as AppEnvironment,
    host: readRequiredString(environment, "API_HOST", "127.0.0.1"),
    port: readPort(environment),
  };
}
