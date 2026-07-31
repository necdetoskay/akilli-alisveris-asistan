import type { Queryable } from "./pool.js";

export interface DashboardOfferRow {
  readonly id: string;
  readonly retailer_code: string;
  readonly retailer_name: string;
  readonly product_name: string;
  readonly brand: string | null;
  readonly category: string | null;
  readonly variant: string | null;
  readonly quantity_raw_text: string | null;
  readonly current_price: number | null;
  readonly previous_price: number | null;
  readonly currency: string;
  readonly valid_from: Date | null;
  readonly valid_until: Date | null;
  readonly verification_status: string;
  readonly needs_review: boolean;
  readonly brochure_id: string;
  readonly brochure_title: string;
  readonly brochure_page_id: string;
  readonly page_number: number;
  readonly content_source: string;
  readonly asset_storage_key: string | null;
}

export interface DashboardSummary {
  readonly this_week: readonly DashboardOfferRow[];
  readonly upcoming: readonly DashboardOfferRow[];
  readonly expiring_soon: readonly DashboardOfferRow[];
  readonly recent_brochures: readonly DashboardOfferRow[];
}

const offerSelect = `
SELECT o.id,
       r.code AS retailer_code,
       r.name AS retailer_name,
       o.product_name,
       o.brand,
       o.category,
       o.variant,
       o.quantity_raw_text,
       o.current_price,
       o.previous_price,
       o.currency,
       o.valid_from,
       o.valid_until,
       o.verification_status,
       o.needs_review,
       b.id AS brochure_id,
       b.title AS brochure_title,
       p.id AS brochure_page_id,
       p.page_number,
       b.content_source_url AS content_source,
       a.storage_key AS asset_storage_key
FROM catalog.product_offers o
JOIN catalog.retailers r ON r.id = o.retailer_id
JOIN catalog.brochures b ON b.id = o.brochure_id
JOIN catalog.brochure_pages p ON p.id = o.brochure_page_id
LEFT JOIN catalog.brochure_assets a ON a.id = p.original_asset_id
WHERE o.archived_at IS NULL
  AND o.current_price IS NOT NULL
`;

function mapRows(rows: unknown[]): DashboardOfferRow[] {
  return rows.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: r.id as string,
      retailer_code: r.retailer_code as string,
      retailer_name: r.retailer_name as string,
      product_name: r.product_name as string,
      brand: (r.brand as string | null) ?? null,
      category: (r.category as string | null) ?? null,
      variant: (r.variant as string | null) ?? null,
      quantity_raw_text: (r.quantity_raw_text as string | null) ?? null,
      current_price: r.current_price === null ? null : Number(r.current_price),
      previous_price: r.previous_price === null ? null : Number(r.previous_price),
      currency: r.currency as string,
      valid_from: r.valid_from === null ? null : new Date(r.valid_from as string),
      valid_until: r.valid_until === null ? null : new Date(r.valid_until as string),
      verification_status: r.verification_status as string,
      needs_review: Boolean(r.needs_review),
      brochure_id: r.brochure_id as string,
      brochure_title: r.brochure_title as string,
      brochure_page_id: r.brochure_page_id as string,
      page_number: Number(r.page_number),
      content_source: r.content_source as string,
      asset_storage_key: (r.asset_storage_key as string | null) ?? null,
    };
  });
}

export class DashboardRepository {
  public constructor(private readonly db: Queryable) {}

  public async summary(expiringWithinHours = 48, limit = 24): Promise<DashboardSummary> {
    const [thisWeek, upcoming, expiringSoon, recentBrochures] = await Promise.all([
      this.db.query(
        `${offerSelect}
         AND (o.valid_from IS NULL OR o.valid_from <= now())
         AND (o.valid_until IS NULL OR o.valid_until >= now())
         ORDER BY o.valid_from DESC NULLS LAST, o.created_at DESC
         LIMIT $1`,
        [limit],
      ),
      this.db.query(
        `${offerSelect}
         AND o.valid_from > now()
         ORDER BY o.valid_from ASC
         LIMIT $1`,
        [limit],
      ),
      this.db.query(
        `${offerSelect}
         AND o.valid_until IS NOT NULL
         AND o.valid_until <= now() + ($2 * interval '1 hour')
         AND o.valid_until >= now()
         ORDER BY o.valid_until ASC
         LIMIT $1`,
        [limit, expiringWithinHours],
      ),
      this.db.query(
        `${offerSelect}
         ORDER BY o.created_at DESC
         LIMIT $1`,
        [limit],
      ),
    ]);

    return {
      this_week: mapRows(thisWeek.rows),
      upcoming: mapRows(upcoming.rows),
      expiring_soon: mapRows(expiringSoon.rows),
      recent_brochures: mapRows(recentBrochures.rows),
    };
  }
}
