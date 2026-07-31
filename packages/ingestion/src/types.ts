export type PageRunStatus = "downloaded" | "duplicate" | "failed";

export interface PageRunResult {
  readonly pageNumber: number;
  readonly sourcePageUrl: string;
  readonly sourceImageUrl: string;
  readonly status: PageRunStatus;
  readonly sha256: string | null;
  readonly byteSize: number | null;
  readonly storageKey: string | null;
  readonly errorMessage: string | null;
}

export interface BrochureRunResult {
  readonly brochureId: string;
  readonly title: string;
  readonly contentSourceUrl: string;
  readonly discoverySourceUrl: string;
  readonly pageCountDiscovered: number;
  readonly pageCountDownloaded: number;
  readonly pageCountDuplicate: number;
  readonly pageCountFailed: number;
  readonly extractedProductCount: number;
  readonly extractionStatus: string;
  readonly costUsd: number;
  readonly costTry: number;
  readonly pages: readonly PageRunResult[];
  readonly errors: readonly string[];
}

export type SourceRunStatus = "complete" | "partial" | "failed";

export interface SourceRunResult {
  readonly sourceId: string;
  readonly sourceFetchRunId: string;
  readonly retailerCode: string;
  readonly status: SourceRunStatus;
  readonly discoveredBrochureCount: number;
  readonly discoveredPageCount: number;
  readonly downloadedPageCount: number;
  readonly duplicatePageCount: number;
  readonly extractedProductCount: number;
  readonly totalCostUsd: number;
  readonly totalCostTry: number;
  readonly errorMessage: string | null;
  readonly brochures: readonly BrochureRunResult[];
}
