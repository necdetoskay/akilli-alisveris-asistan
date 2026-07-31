BEGIN;

-- Sprint 00 real brochure ingestion model.
-- One catalogue is one brochure; each catalogue image is one brochure_page.
-- Original images are immutable source evidence stored as brochure_assets.
-- discovery_source / content_source / verification_status are persisted separately.

CREATE TABLE IF NOT EXISTS catalog.brochure_sources (
  id uuid PRIMARY KEY,
  retailer_id uuid NOT NULL REFERENCES catalog.retailers(id),
  source_type text NOT NULL,
  name text NOT NULL,
  base_url text NOT NULL,
  category_url text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  parser_version text NOT NULL,
  last_success_at timestamptz,
  last_error_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.brochures (
  id uuid PRIMARY KEY,
  retailer_id uuid NOT NULL REFERENCES catalog.retailers(id),
  source_id uuid NOT NULL REFERENCES catalog.brochure_sources(id),
  discovery_source_url text NOT NULL,
  content_source_url text NOT NULL,
  title text NOT NULL,
  campaign_name text,
  publication_date timestamptz,
  valid_from timestamptz,
  valid_until timestamptz,
  verification_status text NOT NULL DEFAULT 'extracted' CHECK (verification_status IN ('extracted', 'reviewed', 'retailer_verified')),
  ingestion_status text NOT NULL DEFAULT 'pending' CHECK (ingestion_status IN ('pending', 'discovered', 'pages_discovered', 'downloading', 'downloaded', 'complete', 'incomplete', 'failed')),
  page_count_discovered integer NOT NULL DEFAULT 0,
  page_count_downloaded integer NOT NULL DEFAULT 0,
  extraction_status text NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'running', 'complete', 'partial', 'review_required', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  CONSTRAINT brochures_valid_period CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from),
  CONSTRAINT brochures_page_counts CHECK (page_count_downloaded >= 0 AND page_count_discovered >= 0),
  UNIQUE (source_id, content_source_url)
);

CREATE TABLE IF NOT EXISTS catalog.brochure_assets (
  id uuid PRIMARY KEY,
  brochure_id uuid NOT NULL REFERENCES catalog.brochures(id) ON DELETE CASCADE,
  brochure_page_id uuid,
  asset_type text NOT NULL CHECK (asset_type IN ('original', 'region_crop')),
  storage_provider text NOT NULL,
  storage_key text NOT NULL,
  original_filename text,
  media_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  sha256 text NOT NULL,
  width integer,
  height integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (asset_type, sha256, storage_provider)
);

CREATE TABLE IF NOT EXISTS catalog.brochure_pages (
  id uuid PRIMARY KEY,
  brochure_id uuid NOT NULL REFERENCES catalog.brochures(id) ON DELETE CASCADE,
  page_number integer NOT NULL CHECK (page_number >= 1),
  source_page_url text NOT NULL,
  source_image_url text NOT NULL,
  original_asset_id uuid REFERENCES catalog.brochure_assets(id),
  sha256 text,
  width integer,
  height integer,
  download_status text NOT NULL DEFAULT 'pending' CHECK (download_status IN ('pending', 'downloaded', 'failed', 'duplicate')),
  extraction_status text NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'running', 'complete', 'partial', 'review_required', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brochure_id, page_number, source_image_url)
);

CREATE TABLE IF NOT EXISTS catalog.extraction_runs (
  id uuid PRIMARY KEY,
  brochure_id uuid NOT NULL REFERENCES catalog.brochures(id) ON DELETE CASCADE,
  model_provider text NOT NULL,
  model_name text NOT NULL,
  pipeline_version text NOT NULL,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'complete', 'partial', 'failed')),
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd numeric(20,10) NOT NULL DEFAULT 0,
  cost_try numeric(20,4) NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  error_code text,
  error_message text,
  UNIQUE (brochure_id, model_name, pipeline_version)
);

CREATE TABLE IF NOT EXISTS catalog.extraction_regions (
  id uuid PRIMARY KEY,
  extraction_run_id uuid NOT NULL REFERENCES catalog.extraction_runs(id) ON DELETE CASCADE,
  brochure_page_id uuid NOT NULL REFERENCES catalog.brochure_pages(id) ON DELETE CASCADE,
  region_key text NOT NULL,
  left_px integer NOT NULL,
  top_px integer NOT NULL,
  width_px integer NOT NULL,
  height_px integer NOT NULL,
  result_asset_id uuid REFERENCES catalog.brochure_assets(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (extraction_run_id, brochure_page_id, region_key)
);

CREATE TABLE IF NOT EXISTS catalog.product_offers (
  id uuid PRIMARY KEY,
  retailer_id uuid NOT NULL REFERENCES catalog.retailers(id),
  brochure_id uuid NOT NULL REFERENCES catalog.brochures(id) ON DELETE CASCADE,
  brochure_page_id uuid NOT NULL REFERENCES catalog.brochure_pages(id) ON DELETE CASCADE,
  extraction_run_id uuid REFERENCES catalog.extraction_runs(id) ON DELETE SET NULL,
  source_region_id uuid REFERENCES catalog.extraction_regions(id) ON DELETE SET NULL,
  discovery_source text NOT NULL,
  content_source text NOT NULL,
  product_name text NOT NULL,
  brand text,
  category text,
  variant text,
  quantity_value numeric(14,4),
  quantity_unit text,
  quantity_raw_text text,
  current_price numeric(14,2),
  previous_price numeric(14,2),
  currency char(3) NOT NULL DEFAULT 'TRY',
  valid_from timestamptz,
  valid_until timestamptz,
  confidence numeric(4,3) NOT NULL DEFAULT 0,
  needs_review boolean NOT NULL DEFAULT false,
  uncertainty_reason text,
  verification_status text NOT NULL DEFAULT 'extracted' CHECK (verification_status IN ('extracted', 'reviewed', 'retailer_verified')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  CONSTRAINT product_offers_positive_current_price CHECK (current_price IS NULL OR current_price > 0),
  CONSTRAINT product_offers_positive_previous_price CHECK (previous_price IS NULL OR previous_price > 0),
  CONSTRAINT product_offers_valid_period CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until >= valid_from),
  CONSTRAINT product_offers_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE TABLE IF NOT EXISTS catalog.ingestion_jobs (
  id uuid PRIMARY KEY,
  source_id uuid REFERENCES catalog.brochure_sources(id),
  brochure_id uuid REFERENCES catalog.brochures(id) ON DELETE CASCADE,
  brochure_page_id uuid REFERENCES catalog.brochure_pages(id) ON DELETE CASCADE,
  job_type text NOT NULL CHECK (job_type IN ('discover', 'download_page', 'extract_page', 'extract_brochure')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'retrying')),
  idempotency_key text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE TABLE IF NOT EXISTS catalog.source_fetch_runs (
  id uuid PRIMARY KEY,
  source_id uuid NOT NULL REFERENCES catalog.brochure_sources(id),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'complete', 'partial', 'failed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  discovered_brochure_count integer NOT NULL DEFAULT 0,
  discovered_page_count integer NOT NULL DEFAULT 0,
  downloaded_page_count integer NOT NULL DEFAULT 0,
  duplicate_page_count integer NOT NULL DEFAULT 0,
  extracted_product_count integer NOT NULL DEFAULT 0,
  total_cost_usd numeric(20,10) NOT NULL DEFAULT 0,
  total_cost_try numeric(20,4) NOT NULL DEFAULT 0,
  error_message text
);

CREATE INDEX IF NOT EXISTS idx_brochures_retailer_validity ON catalog.brochures(retailer_id, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_brochures_verification ON catalog.brochures(verification_status, ingestion_status);
CREATE INDEX IF NOT EXISTS idx_pages_brochure_number ON catalog.brochure_pages(brochure_id, page_number);
CREATE INDEX IF NOT EXISTS idx_assets_sha256 ON catalog.brochure_assets(sha256);
CREATE INDEX IF NOT EXISTS idx_offers_retailer_validity ON catalog.product_offers(retailer_id, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_offers_brochure ON catalog.product_offers(brochure_id);
CREATE INDEX IF NOT EXISTS idx_offers_page ON catalog.product_offers(brochure_page_id);
CREATE INDEX IF NOT EXISTS idx_offers_review ON catalog.product_offers(needs_review, verification_status);
CREATE INDEX IF NOT EXISTS idx_offers_created ON catalog.product_offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fetch_runs_source ON catalog.source_fetch_runs(source_id, started_at DESC);

INSERT INTO public.schema_migrations(version)
VALUES ('0002_sprint00_brochure_ingestion')
ON CONFLICT (version) DO NOTHING;

COMMIT;
