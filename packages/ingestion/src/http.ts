import { Buffer } from "node:buffer";

export class HttpError extends Error {
  public constructor(
    message: string,
    readonly status: number | null,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function isRetryableHttpError(error: unknown): boolean {
  return error instanceof HttpError ? error.retryable : true;
}

export interface HttpFetcherOptions {
  readonly fetchImpl?: typeof fetch;
  readonly userAgent?: string;
  readonly timeoutMs?: number;
  readonly maxRetries?: number;
}

export interface FetchTextOptions {
  readonly maxBytes?: number;
}

export interface FetchBytesOptions extends FetchTextOptions {
  readonly contentType?: RegExp;
}

export interface FetchBytesResult {
  readonly bytes: Buffer;
  readonly contentType: string;
  readonly status: number;
  readonly finalUrl: string;
}

const DEFAULT_MAX_BYTES = 25 * 1024 * 1024;

/**
 * HTTP client for ingestion with retry classification and size limits.
 *
 * Retryable failures: timeout, transient network errors, HTTP 429 and 5xx.
 * Non-retryable: 4xx (other than 429), unsupported media, oversize bodies.
 */
export class HttpFetcher {
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  public constructor(options: HttpFetcherOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? "akilli-alisveris-asistan/0.1";
    this.timeoutMs = options.timeoutMs ?? 30000;
    this.maxRetries = options.maxRetries ?? 2;
  }

  private async attempt(
    url: string,
    maxBytes: number,
    acceptContentType: RegExp | null,
  ): Promise<FetchBytesResult> {
    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        redirect: "follow",
        headers: {
          "User-Agent": this.userAgent,
          Accept: acceptContentType
            ? "image/*,*/*;q=0.8"
            : "text/html,application/xhtml+xml,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new HttpError(`Network failure fetching ${url}: ${message}`, null, true);
    }

    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500;
      throw new HttpError(`HTTP ${response.status} fetching ${url}`, response.status, retryable);
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (acceptContentType && !acceptContentType.test(contentType)) {
      throw new HttpError(
        `Unsupported content-type "${contentType}" for ${url}`,
        response.status,
        false,
      );
    }

    const declaredLength = Number(response.headers.get("content-length") ?? "0");
    if (declaredLength > maxBytes) {
      throw new HttpError(
        `Response exceeds size limit (${declaredLength} > ${maxBytes}) for ${url}`,
        response.status,
        false,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) {
      throw new HttpError(`Response exceeds size limit for ${url}`, response.status, false);
    }

    return {
      bytes: Buffer.from(arrayBuffer),
      contentType,
      status: response.status,
      finalUrl: response.url ?? url,
    };
  }

  public async fetchBytes(url: string, options: FetchBytesOptions = {}): Promise<FetchBytesResult> {
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
    const contentType = options.contentType ?? null;
    let lastError: HttpError | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        return await this.attempt(url, maxBytes, contentType);
      } catch (error) {
        if (!isRetryableHttpError(error) || attempt === this.maxRetries) throw error;
        lastError = error as HttpError;
        const delayMs = 500 * 2 ** attempt;
        await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
      }
    }

    throw lastError ?? new HttpError(`Fetch failed: ${url}`, null, true);
  }

  public async fetchText(url: string, options: FetchTextOptions = {}): Promise<string> {
    const result = await this.fetchBytes(url, options);
    return result.bytes.toString("utf8");
  }
}
