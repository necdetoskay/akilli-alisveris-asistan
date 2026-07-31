# AGENTS.md — Akıllı Alışveriş Asistanı

## Purpose
Aktüel market broşürlerini otomatik çekip (aktuel-urunler.com), sayfa görsellerini immutable saklayıp, GPT-4.1 Mini ile 2x2 bölge bazlı ürün extraction'ı yaparak PostgreSQL'e product_offer kayıtları yazan monorepo. Dashboard gerçek veriden beslenir (seed/demo array yok).

## Ownership
- Monorepo: pnpm workspace + turbo. Paketler `packages/*`, uygulama `apps/api`, web `apps/web`, scriptler `scripts/*`, DB `database/`.
- Paketler: `config`, `storage`, `source`, `extraction`, `db`, `ingestion`.
- Kanonik dokümanlar: `docs/sprints/`, `docs/guides/`, `docs/agent-prompts/`.
- Sprint planları: `docs/sprints/` ve `AGENTS.md` "Gelecek Planlar" bölümü.

## Environment
- Node v24, pnpm 10.15.1. `.env` (gitignored) kök dizinde; `OPENROUTER_API_KEY`, `DATABASE_URL` içerir. Asla key yazdırma/commit etme.
- Docker engine uzak Portainer: `tcp://172.41.42.51:2375`; DB `172.41.42.51:5432/akilli_alisveris` (`postgresql://akilli_alisveris:akilli_alisveris_dev@172.41.42.51:5432/akilli_alisveris`).
- **Port Kuralı (172.41.42.51)**: Servis deploy edilmeden önce hedef port mutlaka kontrol edilir; boş port bulunur, varsayılan portta ısrar edilmez.

## Local Contracts
- Doğrulama: kök `pnpm test` kanoniktir (vitest, tüm repo). `pnpm typecheck` (turbo), `pnpm build`, `pnpm exec eslint packages --max-warnings=0`.
- Kök `pnpm lint` bilinen pre-existing hatalarla kırıktır (`eslint.config.mjs`, `scripts/poc-01/*.mjs`, `playwright.config.ts`, `vitest.config.ts`, `tests/e2e/*`, kök script'ler project service dışında). Paket seviyesi lint temiz tutulur.
- tsconfig.base: strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`. ESLint: non-null assertion, explicit return type (expression'larda izinli), unsafe assignment/access yasak.
- Workspace paketleri `dist/` üzerinden tüketilir; `tsc` öncesi `pnpm --filter <pkg> run build` gerekir. `packages/config`'te eski `tsconfig.tsbuildinfo` `dist` üretimini engelleyebilir; silinip yeniden build edilir.
- PowerShell blokları `<` içeren `-e` scriptlerde sorun çıkarır; temp `.mjs`/`.ts` dosyası kullan.

## Domain Rules (kanıtlanmış)
- Bir katalog = bir `brochure`; her tam boy görsel = bir `brochure_page`. `page_count_discovered` = taranan kaynak sayfalarındaki toplam görsel sayısı.
- Görsel filtre: `/wp-diger/uploads/YYYY/MM/` + `.webp`; `-1280x720`/`-960`/`-1280` varyantları ve `/uploads/story/` düşer.
- A101 detay: aynı-slug `/2/`,`/3/` sayfalama linkleri (`.sayfalamaic .post-page-numbers`), rel=next. BİM detay: tek sayfa.
- `son-sayfa-linki` = sonraki katalog navigasyonudur (sayfa değil).
- Tarih: JSON-LD `datePublished` + başlıktan Türkçe tarih parse (`parseTurkishDate`).
- Extraction: sayfa başına 2x2 region (overlap 0.12), `openai/gpt-4.1-mini`, strict json_schema. Maliyet `usage.cost`; TRY dönüşümü `INGESTION_USD_TRY`.
- İdempotency: brochure `(source_id, content_source_url)`, page `(brochure_id, page_number, source_image_url)`, asset `(asset_type, sha256, storage_provider)`, extraction run `(brochure_id, model_name, pipeline_version)`, job `idempotency_key`. Yeniden çalıştırmada yeni binary/extraction oluşmaz.
- Transaction sınırları: brochure+metadata; brochure_page+asset; extraction_run+regions; product_offers; fetch run summary.
- Dashboard: bu hafta / yaklaşan / süresi dolacak / son broşürler; gerçek product_offer'dan.

## Work Guidance
- Yeni özellik: önce `docs/sprints/` planı, sonra implementasyon, sonra kanonik doğrulama.
- Kod stili: yorum ekleme; mevcut paket desenlerini takip et; workspace paketlerini yeniden kullan.
- API sunucusu `apps/api/src/main.ts` üzerinden `buildDependencies()` ile pool/storage/extraction kurar (`.env`'i köke göre yükler); router `apps/api/src/router.ts` (health/readiness/dashboard/brochures/offers/sources/jobs/ingest/assets + `/assets/:id/content` + `/brochures/:id/pages` + `/` kökünde `apps/web` statik servisi).
- Web UI `apps/web` framework'süz statik (index.html/styles.css/app.js + format.js saf fonksiyonlar). `apps/web` JS'i tip-aware lint'tan override ile muaf; `apps/web/tsconfig.json` yalnızca project service çözümü içindir (noEmit). UI testleri `apps/web/format.test.ts` (vitest) + `tests/e2e/dashboard.spec.ts` (Playwright).
- Canlı ingestion: `pnpm exec tsx scripts/sprint-00/run-ingestion.ts <a101|bim>` (durdurulamaz; OpenRouter ücretli çağrı yapar).

## Verification
1. `pnpm exec eslint packages --max-warnings=0`
2. `pnpm typecheck` (turbo)
3. `pnpm test` (kök, kanonik)
4. `pnpm build`
5. Canlı DB doğrulama gerektiren değişikliklerde `pnpm db:verify` ve sorgularla satır kontrolü.

## Gelecek Planlar ve Yol Haritaları
- **Sprint 00 — Gerçek Broşür Ingestion (E2E dilimi)** — [tamamlandı]
  - `packages/source` (aktuel-urunler adapter, katalog/sayfa keşfi, Türkçe tarih) + fixture testleri.
  - `packages/extraction` (OpenRouter client, 2x2 region, merge/dedup, maliyet).
  - `packages/db` (pg pool, repository'ler, dashboard sorguları, migration 0002 + seeds 0002).
  - `packages/storage` (immutable local SOT, sha256 dedup, hash read-back).
  - `packages/ingestion` (orchestrator: discover→download→extract→write, idempotency, job/fetch-run takibi).
  - `apps/api` router + endpoint'ler; canlı A101+BİM run'ları (25 sayfa, 407 ürün, ~$0.19) ve DB/dashboard doğrulaması.
- **Sprint 01 — Dashboard Web Arayüzü** — [tamamlandı]
  - `apps/web` framework'süz statik UI (index.html/styles.css/app.js + format.js saf fonksiyonlar).
  - `apps/api` eklemeleri: `/assets/:id/content` (SOT görsel sunumu), `/brochures/:id/pages`, `/` kökünde statik servis.
  - Testler: `apps/web/format.test.ts` (vitest, 11), server statik/asset testleri, `tests/e2e/dashboard.spec.ts` (Playwright, canlı DB).
  - Ekran görüntüleri: `docs/sprints/evidence/sprint-01/`.
- Manuel yükleme (admin/user upload), scheduler — henüz planlanmadı.
