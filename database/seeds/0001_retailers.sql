BEGIN;

INSERT INTO catalog.retailers (id, code, name, website_url)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'a101', 'A101', 'https://www.a101.com.tr')
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  is_active = true,
  updated_at = now();

COMMIT;
