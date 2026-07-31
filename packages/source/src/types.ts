export interface CatalogueCandidate {
  readonly title: string;
  readonly url: string;
  readonly retailerCode: string;
  readonly validFrom: Date | null;
  readonly publishedAt: Date | null;
}

export interface CatalogueDetail {
  readonly canonicalUrl: string;
  readonly title: string;
  readonly retailerCode: string;
  readonly publishedAt: Date | null;
  readonly validFrom: Date | null;
  readonly validUntil: Date | null;
  readonly pageNumber: number;
  readonly nextPageUrl: string | null;
  readonly imageUrls: readonly string[];
}

export interface CataloguePage {
  readonly pageNumber: number;
  readonly sourcePageUrl: string;
  readonly imageUrls: readonly string[];
}

export interface ParsedCatalogue {
  readonly canonicalUrl: string;
  readonly title: string;
  readonly retailerCode: string;
  readonly publishedAt: Date | null;
  readonly validFrom: Date | null;
  readonly validUntil: Date | null;
  readonly pageCountDiscovered: number;
  readonly pages: readonly CataloguePage[];
}

export interface RetailerDefinition {
  readonly code: string;
  readonly slugPrefix: string;
  readonly categoryUrlPattern: RegExp;
  readonly catalogueUrlPattern: RegExp;
}
