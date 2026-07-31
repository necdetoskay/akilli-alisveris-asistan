# Coding Agent Prompt — Sprint 01A Dashboard & Category Experience

Repository: `necdetoskay/akilli-alisveris-asistan`

`docs/sprints/SPRINT-01A-DASHBOARD-CATEGORY-EXPERIENCE.md` belgesini eksiksiz uygula ve `docs/guides/SPRINT-01A-DASHBOARD-CATEGORY-E2E-GUIDE.md` doğrulamalarını yap.

## Çalışma kuralları
1. Önce repository'nin tamamını, branch/HEAD/working tree'yi, package scripts, migration, API, web, extraction, storage, test, Docker ve `AGENTS.md` yapısını incele.
2. Kullanıcının ilgisiz yerel değişikliklerine dokunma, stage etme veya silme.
3. Seed/mock dashboard verisi ekleme.
4. Gerçek ingestion, PostgreSQL ve immutable SOT akışını koru.
5. Eski `/dashboard`, brochure detail ve asset endpointlerini kırma.
6. Dosya/komut tahmin etme; repository gerçekliğini doğrula.
7. Başarısız testi başarılı raporlama ve gereksinimi sessizce atlama.

## Uygulama
- Geri alınabilir kategori migration'ı.
- Parent-child kategori sözlüğü, priority ve essentiality.
- Product offer kategori alanları ve index/constraint.
- Türkçe kategori normalizer; ai/rule/manual/fallback source ve confidence.
- `--dry-run` destekli, idempotent backfill; manuel kategori koruması.
- `/dashboard/v2`, `/categories`, filtreli `/offers`, recent brochures.
- Europe/Istanbul lifecycle: active/upcoming/ending_today/expired/unknown.
- Deterministik essentiality/lifecycle/freshness/confidence sıralaması.
- Markasız category placeholder + general fallback.
- API'de display image sözleşmesi ve UI'da `Temsili görsel`.
- Mevcut frameworksüz web'i modüllere ayır.
- Navigasyon, arama, Bugün Bitiyor, iki satırlı Günlük İhtiyaçlar, BİM/A101 tabları, kategori, sıralama, durum rozetleri, son broşürler.
- Klavye erişilebilirliği, alt metin, focus ve 320 px responsive.
- `Broşürde Gör` ve SOT regresyonu.

Bu sprintte Product Visual Service, internet görsel arama, admin review, YOLO, kalıcı favoriler veya bildirim ekleme.

## Testler
Repository'de gerçekten mevcut komutları bul ve çalıştır. En az:
```text
pnpm typecheck
pnpm test
pnpm build
```
Ayrıca gerçek lint, DB verify ve E2E komutları.

Zorunlu testler:
- lifecycle/timezone
- category normalizer
- display priority
- image fallback
- migration
- sözlük/backfill idempotency
- manuel kategori koruması
- dashboard v2 ve offer filtreleri
- eski dashboard regresyonu
- web render
- Playwright desktop + 320 px
- BİM/A101 tabları
- kategori + arama
- rozetler
- brochure/SOT

## Canlı doğrulama
Sistemi repository'nin gerçek yöntemiyle ayağa kaldır ve gerçek veride:
- BİM/A101 ayrımı
- temel ihtiyaç önceliği
- Bugün Bitiyor
- aktif/yaklaşan renk+metin
- kategori ve arama
- placeholder/temsili etiket
- SOT
- mobil taşma

kontrollerini yap. Ekran görüntülerini test artifact olarak sakla; gereksiz binary commit etme.

## Dokümantasyon
`AGENTS.md`, README, env örneği, migration/backfill kullanımı ve API sözleşmesini gerçek implementasyona göre güncelle.

## Git güvenliği
Commit öncesi:
```text
git status --short
git diff --check
git diff --cached --name-status
```
Yalnız Sprint 01A değişikliklerini stage et.

Commit mesajı:
`feat: enrich dashboard with categories and essential offers`

## Zorunlu sonuç raporu
1. Uygulananlar
2. Veri modeli ve backfill sonuçları
3. Dashboard özellikleri
4. Her test komutu ve exit code
5. E2E ekran görüntüsü/kanıtları
6. Regresyon sonucu
7. Bilinen sınırlamalar
8. Son git durumu ve push

Bir kontrol başarısızsa gerçek hatayı ve ilgili dosyayı açıkla; yarım işi tamamlanmış gösterme.
