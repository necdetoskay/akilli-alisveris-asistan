import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export interface StoredObject {
  readonly storageKey: string;
  readonly sha256: string;
  readonly byteSize: number;
  readonly existed: boolean;
}

export interface StorageProvider {
  readonly name: string;
  put(key: string, data: Buffer, sha256: string): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  stat(key: string): Promise<{ readonly byteSize: number; readonly sha256: string }>;
}

export function hashSha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export class LocalStorageError extends Error {
  public constructor(message: string, readonly storageKey: string) {
    super(message);
    this.name = "LocalStorageError";
  }
}

/**
 * Immutable local filesystem storage.
 *
 * Writes are atomic (temp file + rename) and never overwrite existing keys.
 * Deduplication is delegated to the caller through `put` returning `existed`.
 */
export class LocalStorage implements StorageProvider {
  public readonly name = "local";

  private readonly root: string;

  public constructor(rootDirectory: string) {
    if (!rootDirectory.trim()) throw new Error("LocalStorage root directory is required.");
    this.root = rootDirectory;
  }

  private resolve(key: string): string {
    const resolved = path.resolve(path.isAbsolute(key) ? key : path.resolve(this.root, key));
    const root = path.resolve(this.root);
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      throw new LocalStorageError(`Storage key escapes the root directory: ${key}`, key);
    }
    return resolved;
  }

  public async put(key: string, data: Buffer, sha256: string): Promise<StoredObject> {
    if (!data.length) throw new LocalStorageError("Refusing to store empty object", key);

    const filePath = this.resolve(key);
    if (await this.exists(filePath)) {
      return { storageKey: key, sha256, byteSize: data.length, existed: true };
    }

    await mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
    await writeFile(tempPath, data, { flag: "wx" });
    try {
      await rename(tempPath, filePath);
    } catch (error) {
      await rm(tempPath, { force: true });
      throw error;
    }

    return { storageKey: key, sha256, byteSize: data.length, existed: false };
  }

  public async get(key: string): Promise<Buffer> {
    const filePath = this.resolve(key);
    if (!(await this.exists(filePath))) {
      throw new LocalStorageError(`Object not found: ${key}`, key);
    }
    return readFile(filePath);
  }

  public async exists(key: string): Promise<boolean> {
    const filePath = this.resolve(key);
    try {
      await readFile(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async stat(key: string): Promise<{ readonly byteSize: number; readonly sha256: string }> {
    const filePath = this.resolve(key);
    const data = await this.get(filePath);
    return { byteSize: data.length, sha256: hashSha256(data) };
  }
}

export function computeStorageKey(
  retailerSlug: string,
  brochureId: string,
  pageNumber: number,
  assetId: string,
  extension: string,
): string {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safeExtension = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "bin";
  return `brochures/${retailerSlug}/${year}/${month}/${brochureId}/pages/${pageNumber}/${assetId}.${safeExtension}`;
}
