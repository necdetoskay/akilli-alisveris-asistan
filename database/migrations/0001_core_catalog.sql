BEGIN;

CREATE SCHEMA IF NOT EXISTS catalog;

CREATE TABLE IF NOT EXISTS catalog.retailers (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  website_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.products (
  id uuid PRIMARY KEY,
  canonical_name text NOT NULL,
  brand text,
  category_code text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'review')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.product_variants (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  quantity_value numeric(14,4),
  quantity_unit text,
  gtin text UNIQUE,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_quantity_pair CHECK (
    (quantity_value IS NULL AND quantity_unit IS NULL)
    OR (quantity_value IS NOT NULL AND quantity_unit IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS catalog.retailer_listings (
  id uuid PRIMARY KEY,
  retailer_id uuid NOT NULL REFERENCES catalog.retailers(id),
  external_id text NOT NULL,
  source_url text,
  raw_title text NOT NULL,
  normalized_title text,
  variant_id uuid REFERENCES catalog.product_variants(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'quarantined')),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (retailer_id, external_id)
);

CREATE TABLE IF NOT EXISTS catalog.offers (
  id uuid PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES catalog.retailer_listings(id) ON DELETE CASCADE,
  valid_from timestamptz,
  valid_until timestamptz,
  currency char(3) NOT NULL DEFAULT 'TRY',
  regular_price numeric(14,2),
  sale_price numeric(14,2) NOT NULL,
  promotion_text text,
  availability text NOT NULL DEFAULT 'unknown' CHECK (availability IN ('in_stock', 'out_of_stock', 'unknown')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offers_positive_sale_price CHECK (sale_price > 0),
  CONSTRAINT offers_positive_regular_price CHECK (regular_price IS NULL OR regular_price > 0),
  CONSTRAINT offers_valid_period CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from)
);

CREATE TABLE IF NOT EXISTS catalog.price_observations (
  id uuid PRIMARY KEY,
  offer_id uuid NOT NULL REFERENCES catalog.offers(id) ON DELETE CASCADE,
  observed_at timestamptz NOT NULL,
  price numeric(14,2) NOT NULL CHECK (price > 0),
  currency char(3) NOT NULL DEFAULT 'TRY',
  availability text NOT NULL DEFAULT 'unknown' CHECK (availability IN ('in_stock', 'out_of_stock', 'unknown')),
  source_fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (offer_id, observed_at, source_fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_products_category_code ON catalog.products(category_code);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON catalog.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_variant_id ON catalog.retailer_listings(variant_id);
CREATE INDEX IF NOT EXISTS idx_listings_last_seen_at ON catalog.retailer_listings(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON catalog.offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_validity ON catalog.offers(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_price_observations_offer_time ON catalog.price_observations(offer_id, observed_at DESC);

CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.schema_migrations(version)
VALUES ('0001_core_catalog')
ON CONFLICT (version) DO NOTHING;

COMMIT;
