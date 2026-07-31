# Sprint 01 - Dashboard Web Arayüzü (UI Vertical Slice)

## 1. Amaç

Sprint 00'da canlı veriyle çalışan API zinciri kuruldu: `web kaynağı -> katalog keşfi -> immutable storage -> GPT-4.1 Mini extraction -> PostgreSQL -> API`. Bu sprint, zincirin son halkasını ekler: **gerçek veriyi gösteren web arayüzü**.

Sprint 00'da dashboard yalnızca API endpoint'i olarak vardı (`/dashboard`, `/brochures`, `/offers`, `/assets`). Bu sprintte:

- Arayüz, mevcut API'yi tüketir (seed/demo veri yok; dashboard gerçek `product_offer` kayıtlarından beslenir).
- SPA framework kurulmaz; tek sayfalık statik HTML/CSS/JS (`apps/web`) API sunucusu tarafından servis edilir.
- Yeni eklenen `GET /assets/:id/content` endpoint'i ile orijinal broşür sayfası görselleri tarayıcıda gösterilir.
- Mobil ve masaüstü duyarlı (responsive) tek sayfa.

## 2. Kapsam Dışı (bu sprintte yapılmaz)

- Manuel yükleme (admin/user upload) — kendi sprinti.
- Scheduler — kendi sprinti.
- Kimlik doğrulama/oturum — `docs/11-api` uzun vadeli hedef; bu sprintte açık erişim.
- SPA framework (React/Vue), build tooling — gereksiz; statik dosya yeterli.

## 3. Temel Ürün Kararları

### 3.1 Tek sayfa uygulama, frameworksüz

`apps/web/` altında:

- `index.html` — sayfa iskeleti
- `styles.css` — tema + responsive grid
- `app.js` — API çağrıları + render (vanilla JS, modül)

API sunucusu (`apps/api`) statik dosyaları `/` kökü üzerinden servis eder; `/api/*` JSON rotaları mevcut router'da kalır. Böylece tek `pnpm dev` / `pnpm start` ile hem API hem UI çalışır.

### 3.2 Sayfa görselleri gerçek SOT'tan

Dashboard ürün kartlarındaki "Broşürü Görüntüle" akışı `brochure_page.original_asset_id -> brochure_assets.storage_key` üzerinden `GET /assets/:id/content` ile ilgili orijinal görseli döndürür (immutable SOT). Ekran görüntüsü değil, gerçek kaynak.

### 3.3 Dashboard bölümleri (Sprint 00 kanonu)

Sprint 00 E2E guide'ın "Dashboard" bölümüne birebir uyulur:

1. Bu Haftanın Fırsatları
2. Yakında Başlayacak İndirimler
3. Süresi Dolmak Üzere Olanlar
4. Son Eklenen Broşürler

Her ürün kartı: market adı, ürün adı, miktar, fiyat, tarih, verification durumu, "Broşürü Görüntüle" bağlantısı.

## 4. API Eklemeleri

Mevcut router'a üç ekleme yapılır (UI ihtiyacı için, kırıcı değişiklik yok):

| Endpoint | Açıklama |
|---|---|
| `GET /assets/:id/content` | Brochure asset'inin orijinal bytes'ını doğru content-type ile döndürür (SOT). |
| `GET /brochures/:id/pages` | Sayfa listesi + her sayfanın asset content URL'i (`/assets/:id/content`). |
| `GET /api/*` statik servis | `/` kökü `apps/web` dizinindeki statik dosyaları servis eder. |

Ek repository/metot gerekmez; `getAssetById` + `StorageProvider.get` yeterli.

## 5. UI Davranışları

### 5.1 Ana sayfa

- Üst bar: başlık, canlı veri rozeti ("canlı veri", seed yok), tazeleme butonu.
- Dört bölüm grid'i; her bölümde ürün kartları.
- Bölüm boşsa açıklayıcı boş durum metni (ör. "Süresi dolmak üzere ürün yok").

### 5.2 Ürün kartı

- Market rozeti (A101/BİM).
- Ürün adı, marka, miktar (`quantity_raw_text`).
- Fiyat (`current_price` + `currency`), varsa `previous_price` çizgili.
- `valid_from`/`valid_until` tarihleri (Türkçe format).
- `verification_status` rozeti; `needs_review` uyarı işareti.
- "Broşürü Görüntüle" -> broşür sayfasına gider.

### 5.3 Broşür görünümü

- `/brochures/:id` görünümü: broşür başlığı, market, tarih, sayfa thumbnails (SOT görselleri).
- Sayfa tıklanınca tam boy orijinal görsel açılır.
- Sayfa altında o broşüre ait ürün listesi.

### 5.4 Hata/boş durumlar

- API erişilemezse hata banner'ı + yeniden dene.
- Sayı formatı `Intl.NumberFormat('tr-TR')`.

## 6. Test ve Doğrulama

- `apps/web` için: `app.js`'in saf fonksiyonları (format, kart render mapping) vitest ile test edilir; DOM/network test edilmez.
- `apps/api`: `/assets/:id/content` endpoint'i için server test'i (asset yoksa 404, content-type doğru).
- E2E (Playwright): dashboard sayfası gerçek veriyle açılır, dört bölüm render olur, broşür görünümü açılır. `tests/e2e/dashboard.spec.ts`.
- Kanonik: `pnpm exec eslint packages --max-warnings=0`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## 7. Uygulama Sırası

1. API: `GET /assets/:id/content` + `GET /brochures/:id/pages` endpoint'leri ve testleri.
2. API: statik dosya servisi (`/` kökü → `apps/web`), `apps/web/index.html` placeholder + test.
3. UI: `styles.css` + tema (responsive).
4. UI: `app.js` — dashboard fetch/render, ürün kartları, boş/hata durumları.
5. UI: broşür görünümü (sayfalar + ürünler).
6. E2E Playwright testleri.
7. Canlı doğrulama: API + UI birlikte açılır, gerçek DB verisi görülür.
8. DOX pass: `AGENTS.md` güncelle (bu sprint `[tamamlandı]`; kapsam dışı madde kaldır).

## 8. Doğrulama Kanıtları

- Dashboard masaüstü + mobil ekran görüntüsü (gerçek veri).
- Broşür görünümü + SOT görsel ekran görüntüsü.
- API asset endpoint'i 200/404 testi.
- Playwright E2E geçişi.
- `pnpm typecheck` + `pnpm test` + `pnpm build` + paket lint temiz.
