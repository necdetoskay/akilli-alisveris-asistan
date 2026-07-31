import * as cheerio from "cheerio";

import type { CatalogueCandidate, CatalogueDetail, CataloguePage, ParsedCatalogue, RetailerDefinition } from "./types.js";
import { parseTurkishDate } from "./turkish-date.js";

export const RETAILERS: readonly RetailerDefinition[] = [
  {
    code: "a101",
    slugPrefix: "a101",
    categoryUrlPattern: /\/a101-aktuel-urunler(\/page\/\d+\/)?\/?$/i,
    catalogueUrlPattern: /\/a101-(.+)-aktuel-urunler-katalogu\/?$/i,
  },
  {
    code: "bim",
    slugPrefix: "bim",
    categoryUrlPattern: /\/bim-aktuel(\/page\/\d+\/)?\/?$/i,
    catalogueUrlPattern: /\/bim-(.+)-aktuel-urunler-katalogu\/?$/i,
  },
];

function retailerForCatalogueUrl(url: string): RetailerDefinition | null {
  const trimmed = url.replace(/\/$/, "");
  return (
    RETAILERS.find((retailer) => retailer.catalogueUrlPattern.test(trimmed)) ?? null
  );
}

/**
 * Full-size image heuristic for aktuel-urunler.com.
 *
 * WordPress serves scaled variants with suffixes such as `-1280x720.webp`,
 * `-960.webp` and `-1280.webp`; the original catalogue page uses plain
 * `-<n>.webp` names. Story/sidebar images live under `/uploads/story/`.
 */
function isFullSizeImageUrl(url: string): boolean {
  if (!/\/wp-diger\/uploads\/\d{4}\/\d{2}\//.test(url)) return false;
  if (/\/uploads\/story\//.test(url)) return false;
  const filename = url.split("/").pop() ?? "";
  const base = filename.replace(/\.(webp|png|jpe?g)$/i, "");
  return !/^.*-\d{3,4}x\d{1,4}$/.test(base) && !/^.*-\d{3,4}$/.test(base);
}

function extractImageUrls(html: string): string[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const urls: string[] = [];

  $("img").each((_, element) => {
    const src = $(element).attr("src");
    if (!src) return;
    const absolute = new URL(src, "https://aktuel-urunler.com").href;
    if (!isFullSizeImageUrl(absolute)) return;
    if (seen.has(absolute)) return;
    seen.add(absolute);
    urls.push(absolute);
  });

  return urls;
}

function extractDatePublished(html: string): Date | null {
  const match = /"datePublished"\s*:\s*"([^"]+)"/.exec(html);
  const raw = match?.[1];
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractTitle(html: string): string {
  const ogTitle = /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i.exec(html);
  const ogValue = ogTitle?.[1];
  if (ogValue) return ogValue.trim();
  const title = /<title>([^<]*)<\/title>/i.exec(html);
  const titleValue = title?.[1];
  return titleValue ? titleValue.trim() : "";
}

function extractCanonicalUrl(html: string): string | null {
  const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i.exec(html);
  const canonicalValue = canonical?.[1];
  if (canonicalValue) return canonicalValue.trim();
  const alternate = /<link[^>]+rel="alternate"[^>]+href="([^"]+)"[^>]*>/i.exec(html);
  const alternateValue = alternate?.[1];
  return alternateValue ? alternateValue.trim() : null;
}

function currentPageNumber($: cheerio.CheerioAPI): number {
  const current = $(".post-page-numbers.current strong").first().text().trim();
  if (current && /^\d+$/.test(current)) return Number(current);
  const currentSpan = $("span.post-page-numbers.current").first().text().trim();
  if (currentSpan && /^\d+$/.test(currentSpan)) return Number(currentSpan);
  return 1;
}

function extractPagination(html: string, canonicalUrl: string): {
  readonly sameSlugLinks: ReadonlyArray<{ readonly pageNumber: number; readonly url: string }>;
  readonly nextRelUrl: string | null;
} {
  const $ = cheerio.load(html);
  const canonicalPath = new URL(canonicalUrl).pathname.replace(/\/+$/, "");

  const sameSlugLinks: Array<{ pageNumber: number; url: string }> = [];
  $("a.post-page-numbers").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    const url = new URL(href, canonicalUrl).href;
    const pathname = new URL(url).pathname.replace(/\/+$/, "");

    // Page links stay under the same catalogue path: /slug/2/
    if (!pathname.startsWith(canonicalPath) || pathname === canonicalPath) return;

    const pageMatch = /\/(\d+)$/.exec(pathname);
    if (!pageMatch) return;
    sameSlugLinks.push({ pageNumber: Number(pageMatch[1]), url });
  });

  const nextRel = $('link[rel="next"]').attr("href");
  const nextRelUrl = nextRel ? new URL(nextRel, canonicalUrl).href : null;

  return { sameSlugLinks, nextRelUrl };
}

export function parseCatalogueDetail(html: string, sourcePageUrl: string): CatalogueDetail {
  const canonicalUrl = extractCanonicalUrl(html) ?? sourcePageUrl;
  const title = extractTitle(html);
  const publishedAt = extractDatePublished(html);
  const validFrom = parseTurkishDate(title);
  const retailerCode = retailerForCatalogueUrl(canonicalUrl)?.code ?? "";

  const pageNumber = currentPageNumber(cheerio.load(html));
  const { sameSlugLinks, nextRelUrl } = extractPagination(html, canonicalUrl);

  let nextPageUrl: string | null = null;
  const directNext = sameSlugLinks.find((link) => link.pageNumber === pageNumber + 1);
  if (directNext) {
    nextPageUrl = directNext.url;
  } else if (
    nextRelUrl &&
    new URL(nextRelUrl).pathname.replace(/\/+$/, "").startsWith(
      new URL(canonicalUrl).pathname.replace(/\/+$/, ""),
    )
  ) {
    nextPageUrl = nextRelUrl;
  }

  return {
    canonicalUrl,
    title,
    retailerCode,
    publishedAt,
    validFrom,
    validUntil: null,
    pageNumber,
    nextPageUrl,
    imageUrls: extractImageUrls(html),
  };
}

/**
 * Crawls a catalogue by following the pagination chain (rel=next / same-slug
 * page links) until the last page. page_count_discovered is the total number
 * of images found, because the sprint maps one catalogue image to one
 * brochure_page.
 */
export async function crawlCatalogue(
  startPageUrl: string,
  fetchPage: (url: string) => Promise<string>,
  onPage?: (page: CataloguePage) => void,
): Promise<ParsedCatalogue> {
  const pages: CataloguePage[] = [];
  const seenUrls = new Set<string>();

  let nextUrl: string | null = startPageUrl;
  let firstDetail: CatalogueDetail | null = null;

  while (nextUrl) {
    if (seenUrls.has(nextUrl)) break;
    seenUrls.add(nextUrl);

    const html = await fetchPage(nextUrl);
    const detail = parseCatalogueDetail(html, nextUrl);
    if (!firstDetail) firstDetail = detail;

    const page: CataloguePage = {
      pageNumber: detail.pageNumber,
      sourcePageUrl: nextUrl,
      imageUrls: detail.imageUrls,
    };
    pages.push(page);
    onPage?.(page);

    nextUrl = detail.nextPageUrl;
    if (nextUrl && !new URL(nextUrl).pathname.startsWith(new URL(detail.canonicalUrl).pathname)) {
      break;
    }
  }

  if (!firstDetail) {
    throw new Error(`No catalogue detail could be parsed from ${startPageUrl}`);
  }

  const pageCountDiscovered = pages.reduce((sum, page) => sum + page.imageUrls.length, 0);

  return {
    canonicalUrl: firstDetail.canonicalUrl,
    title: firstDetail.title,
    retailerCode: firstDetail.retailerCode,
    publishedAt: firstDetail.publishedAt,
    validFrom: firstDetail.validFrom,
    validUntil: firstDetail.validUntil,
    pageCountDiscovered,
    pages,
  };
}

export function discoverCatalogueCandidates(
  html: string,
  retailerCode: string,
  baseUrl = "https://aktuel-urunler.com",
): CatalogueCandidate[] {
  const $ = cheerio.load(html);
  const retailer = RETAILERS.find((r) => r.code === retailerCode);
  if (!retailer) throw new Error(`Unknown retailer code: ${retailerCode}`);

  const seen = new Map<string, string>();
  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    const url = new URL(href, baseUrl).href.replace(/\/$/, "");

    if (!retailer.catalogueUrlPattern.test(url)) return;

    const text = $(element).text().replace(/\s+/g, " ").trim();
    const title = $(element).attr("title")?.trim() || text;
    if (!title || title.toLowerCase().includes("devamini oku")) return;
    if (!seen.has(url)) seen.set(url, title);
  });

  return [...seen.entries()].map(([url, title]) => ({
    title,
    url: `${url}/`,
    retailerCode,
    validFrom: parseTurkishDate(title),
    publishedAt: null,
  }));
}

export function parseCategoryPage(
  html: string,
  retailerCode: string,
): { readonly candidates: readonly CatalogueCandidate[]; readonly nextPageUrl: string | null } {
  const candidates = discoverCatalogueCandidates(html, retailerCode);
  const $ = cheerio.load(html);
  const nextLink = $("a.next, a.next.page-numbers").attr("href");
  const nextPageUrl = nextLink ? new URL(nextLink, "https://aktuel-urunler.com").href : null;
  return { candidates, nextPageUrl };
}
