BEGIN;

-- Sprint 00 brochure source definitions. These are system bootstrap records,
-- not demo data. Each source is the configured discovery/content entry point
-- for a retailer on aktuel-urunler.com.

INSERT INTO catalog.brochure_sources (id, retailer_id, source_type, name, base_url, category_url, is_enabled, parser_version)
VALUES
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'aktuel-urunler',
    'aktuel-urunler.com A101',
    'https://aktuel-urunler.com',
    'https://aktuel-urunler.com/a101-aktuel-urunler/',
    true,
    'sprint-00-1'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'aktuel-urunler',
    'aktuel-urunler.com BİM',
    'https://aktuel-urunler.com',
    'https://aktuel-urunler.com/bim-aktuel/',
    true,
    'sprint-00-1'
  )
ON CONFLICT (id) DO UPDATE
SET
  retailer_id = EXCLUDED.retailer_id,
  source_type = EXCLUDED.source_type,
  name = EXCLUDED.name,
  base_url = EXCLUDED.base_url,
  category_url = EXCLUDED.category_url,
  is_enabled = EXCLUDED.is_enabled,
  parser_version = EXCLUDED.parser_version,
  updated_at = now();

COMMIT;
