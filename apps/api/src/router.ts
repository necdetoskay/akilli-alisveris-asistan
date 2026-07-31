import type { IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { CatalogRepository, DashboardRepository } from "@akilli-alisveris/db";
import { IngestionOrchestrator } from "@akilli-alisveris/ingestion";

import type { ApiDependencies } from "./deps.js";

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function sendProblem(response: ServerResponse, status: number, title: string): void {
  response.writeHead(status, {
    "content-type": "application/problem+json; charset=utf-8",
  });
  response.end(JSON.stringify({ status, title, type: "about:blank" }));
}

function parseLimit(value: string | null, fallback: number): number {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBool(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function optionalParam(value: string | null): string | undefined {
  return value ?? undefined;
}

function parseJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? (JSON.parse(raw) as unknown) : {});
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
    request.on("error", reject);
  });
}

const STATIC_CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function staticContentType(filePath: string): string {
  return STATIC_CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

export class ApiRouter {
  public constructor(private readonly deps: ApiDependencies) {}

  public get dashboard(): DashboardRepository {
    return new DashboardRepository(this.deps.pool);
  }

  public get catalog(): CatalogRepository {
    return new CatalogRepository(this.deps.pool);
  }

  public async route(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method ?? "GET";

    if (method === "GET" && pathname === "/health") {
      sendJson(response, 200, {
        service: "api",
        status: "ok",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (method === "GET" && pathname === "/readiness") {
      try {
        await this.deps.pool.query("SELECT 1");
        sendJson(response, 200, { status: "ok", database: "reachable" });
      } catch {
        sendJson(response, 503, { status: "unavailable", database: "unreachable" });
      }
      return;
    }

    if (method === "GET" && pathname === "/dashboard") {
      const hours = Number(url.searchParams.get("hours") ?? "48");
      const limit = parseLimit(url.searchParams.get("limit"), 24);
      const summary = await this.dashboard.summary(hours, limit);
      sendJson(response, 200, summary);
      return;
    }

    if (method === "GET" && pathname === "/brochures") {
      const limit = parseLimit(url.searchParams.get("limit"), 50);
      const retailerCode = optionalParam(url.searchParams.get("retailer"));
      const brochures = await this.catalog.listBrochures(limit, retailerCode);
      sendJson(response, 200, { brochures });
      return;
    }

    const brochureMatch = /^\/brochures\/([^/]+)$/.exec(pathname);
    if (method === "GET" && brochureMatch) {
      const brochureId = decodeURIComponent(brochureMatch[1] ?? "");
      const brochure = await this.catalog.getBrochureById(brochureId);
      if (!brochure) {
        sendProblem(response, 404, "Brochure not found");
        return;
      }
      const pages = await this.catalog.getBrochurePages(brochureId);
      const offers = await this.catalog.listProductOffers(500, brochureId);
      sendJson(response, 200, { brochure, pages, offers, broker: brochure.content_source_url });
      return;
    }

    if (method === "GET" && pathname === "/offers") {
      const limit = parseLimit(url.searchParams.get("limit"), 100);
      const brochureId = optionalParam(url.searchParams.get("brochure"));
      const needsReview = parseBool(url.searchParams.get("needs_review"));
      const offers = await this.catalog.listProductOffers(limit, brochureId, needsReview);
      sendJson(response, 200, { offers });
      return;
    }

    if (method === "GET" && pathname === "/sources") {
      const sources = await this.catalog.listSources();
      sendJson(response, 200, { sources });
      return;
    }

    if (method === "GET" && pathname === "/jobs") {
      const limit = parseLimit(url.searchParams.get("limit"), 50);
      const jobs = await this.catalog.listIngestionJobs(limit);
      sendJson(response, 200, { jobs });
      return;
    }

    if (method === "POST" && pathname === "/ingest") {
      const body = (await parseJsonBody(request)) as { retailer?: unknown };
      const retailerCode = typeof body.retailer === "string" ? body.retailer : "";
      if (!retailerCode) {
        sendProblem(response, 400, "retailer is required");
        return;
      }
      const orchestrator = this.createOrchestrator();
      const result = await orchestrator.runSource(retailerCode);
      sendJson(response, 200, result);
      return;
    }

    if (method === "GET" && pathname === "/assets") {
      const brochureId = optionalParam(url.searchParams.get("brochure"));
      if (!brochureId) {
        sendProblem(response, 400, "brochure is required");
        return;
      }
      const pages = await this.catalog.getBrochurePages(brochureId);
      const pageAssets = await Promise.all(
        pages
          .filter((page) => page.original_asset_id !== null)
          .map(async (page) => {
            const asset = page.original_asset_id
              ? await this.catalog.getAssetById(page.original_asset_id)
              : null;
            return { page_id: page.id, page_number: page.page_number, asset };
          }),
      );
      sendJson(response, 200, { assets: pageAssets });
      return;
    }

    const assetContentMatch = /^\/assets\/([^/]+)\/content$/.exec(pathname);
    if (method === "GET" && assetContentMatch) {
      const assetId = decodeURIComponent(assetContentMatch[1] ?? "");
      const asset = await this.catalog.getAssetById(assetId);
      if (!asset) {
        sendProblem(response, 404, "Asset not found");
        return;
      }
      let bytes: Buffer;
      try {
        bytes = await this.deps.storage.get(asset.storage_key);
      } catch {
        sendProblem(response, 404, "Asset object not found");
        return;
      }
      response.writeHead(200, {
        "content-type": asset.media_type,
        "content-length": String(bytes.length),
        "cache-control": "public, max-age=31536000, immutable",
      });
      response.end(bytes);
      return;
    }

    sendProblem(response, 404, "Not Found");
  }

  private async serveStatic(request: IncomingMessage, response: ServerResponse): Promise<boolean> {
    if (request.method !== "GET" && request.method !== "HEAD") return false;

    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/" || pathname === "") pathname = "/index.html";

    try {
      const staticUrl = new URL(pathname, this.deps.webUrl);
      const res = await fetch(staticUrl.toString());
      if (!res.ok) return false;

      const body = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") ?? staticContentType(staticUrl.pathname);

      response.writeHead(200, {
        "content-type": contentType,
        "content-length": String(body.byteLength),
        "cache-control": "public, max-age=31536000, immutable",
      });
      if (request.method === "GET") response.end(Buffer.from(body));
      else response.end();
      return true;
    } catch {
      return false;
    }
  }

  private createOrchestrator(): IngestionOrchestrator {
    return new IngestionOrchestrator({
      pool: this.deps.pool,
      storage: this.deps.storage,
      config: this.deps.ingestionConfig,
      extraction: this.deps.extraction,
    });
  }
}
