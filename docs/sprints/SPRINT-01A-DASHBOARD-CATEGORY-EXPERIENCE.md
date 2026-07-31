# Sprint 01A — Dashboard & Category Experience

## Amaç
Çalışan fakat sade dashboard'u gerçek bir alışveriş keşif ekranına dönüştürmek. Seed/mock veri yoktur; ekran PostgreSQL'deki gerçek `product_offer` ve `brochure` kayıtlarından beslenir.

## Kullanıcı deneyimi
Ana sayfa sırası:
1. Navigasyon, arama ve kategori filtresi
2. **Bugün Bitiyor**
3. **Günlük İhtiyaçlarda Öne Çıkanlar** — iki satırlı yatay kaydırma
4. **Market Ürünleri** — BİM/A101 sekmeleri
5. Son Eklenen Broşürler

### Bugün Bitiyor
Yalnız bugün sona eren ve halen aktif teklifler gösterilir. Veri yoksa bölüm gizlenir. Temel ihtiyaçlar önce gelir. Renk yanında `Bugün sona eriyor` metni zorunludur.

### Günlük İhtiyaçlarda Öne Çıkanlar
BİM ve A101 karışık olabilir. Peynir, zeytin, yağ, süt, yumurta, pirinç, makarna, bakliyat, çay, kahve, temizlik ve bebek ihtiyaçları; televizyon, tekstil ve özel kampanya ürünlerinden önce gösterilir.

İlk puan:
`display_priority = essentiality_weight + lifecycle_weight + freshness_weight - low_confidence_penalty`

Doğrulanmış eski fiyat yoksa indirim yüzdesi üretilmez ve “en büyük indirim” iddiası kullanılmaz.

### Teklif durumları
- `active`: Şu anda geçerli
- `upcoming`: Yakında başlayacak
- `ending_today`: Bugün sona eriyor
- `expired`: Süresi doldu
- `unknown`: Tarih bilgisi eksik

Durum yalnız renkle anlatılmaz. Varsayılan timezone `Europe/Istanbul` olur.

### Market sekmeleri
BİM ve A101 sekmeleri yalnız ilgili market ürünlerini gösterir. Kategori filtreleri:
Temel Gıda, Süt ve Kahvaltılık, Et ve Şarküteri, Atıştırmalık, İçecek, Temizlik, Kişisel Bakım, Bebek, Ev ve Yaşam, Elektronik, Tekstil, Bahçe ve Yapı, Otomotiv, Evcil Hayvan, Diğer.

Sıralamalar:
Öncelikli, Yeni eklenen, Fiyatı düşük, Önce bitecek, Yakında başlayacak.

### Ürün kartı
Kart mümkün olduğunda şunları gösterir:
- display image
- `Temsili görsel` bilgisi
- ürün adı, marka, miktar
- fiyat
- market ve kategori
- yaşam döngüsü rozeti ve kalan süre
- doğrulama durumu
- `Broşürde Gör`

Eksik alanlar UI'ı bozmamalıdır.

## Kategori sistemi
Alanlar:
- `category_id`
- `raw_category`
- `normalized_category_slug`
- `category_source`: ai, rule, manual, fallback
- `category_confidence`
- `essentiality`: essential, frequent, occasional, special

Önemli alt kategoriler en az:
Beyaz Peynir, Kaşar Peyniri, Diğer Peynirler, Süt, Yoğurt, Tereyağı, Zeytin, Bal, Reçel, Yumurta, Sıvı Yağ, Zeytinyağı, Un, Şeker, Pirinç, Bulgur, Makarna, Bakliyat, Salça, Çay, Kahve, Deterjan, Bebek Bezi.

Normalizasyon sırası:
1. Extraction kategori önerir.
2. Sözlük eşleştirmesi yapılır.
3. Anahtar kelime kuralları uygulanır.
4. Eşleşmeyen `Diğer` olur.
5. Kaynak ve güven kaydedilir.

Geçmiş ürünler için `--dry-run` destekli, idempotent backfill gerekir. Manuel kategori ezilmez.

## Görsel yaklaşımı
Bu sprintte Product Visual Service, internet görsel arama ve YOLO yapılmaz.

Fallback:
1. verified_product_image
2. admin_selected_image
3. brochure_crop
4. category_placeholder
5. general_placeholder

Sprint 01A'da en az kategori ve genel placeholder çalışır. Kategori görselleri markasız ve nötr olmalıdır. API:
```json
{
  "display_image_url": "/assets/categories/beyaz-peynir.webp",
  "image_source_type": "category_placeholder",
  "image_is_representative": true
}
```

## Veri modeli
`categories`:
- id, slug unique, name, parent_id
- priority_weight
- essentiality_default
- fallback_asset_id
- is_active
- created_at, updated_at

`product_offers` ekleri:
- category_id
- raw_category
- category_source
- category_confidence
- essentiality

Migration kırıcı olmamalı ve geri alınabilmelidir.

## API
- `GET /dashboard/v2`
- `GET /offers?retailer=&category=&status=&query=&sort=&limit=&cursor=`
- `GET /categories`
- `GET /brochures/recent`

`/dashboard/v2`:
```json
{
  "ending_today": [],
  "featured_essentials": [],
  "retailers": {"bim": [], "a101": []},
  "recent_brochures": [],
  "categories": []
}
```
Eski `/dashboard` korunur. Sorgular parameterized, sıralama deterministik ve listeler limitli olmalıdır.

## Web
Mevcut frameworksüz yapı korunur. Büyük `app.js` test edilebilir modüllere ayrılır: lifecycle, filters, format ve render yardımcıları.

Erişilebilirlik:
- semantik/klavye ile çalışan sekmeler
- durum yalnız renk değildir
- anlamlı alt metin
- görünür focus
- 320 px'te sayfa geneli yatay taşma yok

## Kapsam dışı
- Product Visual Service
- Playwright ürün görseli arama
- admin image review
- YOLO/detector
- kalıcı kullanıcı favorileri ve bildirim
- fiyat geçmişi
- canonical product eşleştirme

Bunlar Sprint 01B–01E'de planlanacaktır.

## Kabul kriterleri
1. Dashboard gerçek DB verisi gösterir.
2. Bugün bitenler doğru hesaplanır; boşsa bölüm gizlenir.
3. Temel ihtiyaçlar özel ürünlerden önce gelir.
4. BİM/A101 sekmeleri doğru filtreler.
5. Kategori ve arama birlikte çalışır.
6. Aktif/yaklaşan/bugün biten/süresi dolan durumları doğru görünür.
7. Doğru kategori placeholder fallback'i çalışır.
8. Temsili görsel gerçek ürün görseli gibi sunulmaz.
9. `Broşürde Gör` immutable SOT akışını korur.
10. Backfill dry-run/idempotency/manual preservation sağlar.
11. Mobil 320 px ve masaüstü E2E geçer.
12. Eski dashboard, ingestion, brochure ve asset akışlarında regresyon yoktur.
13. Unit, integration, API ve Playwright testleri geçer.

## Test planı
Unit:
- lifecycle/timezone
- category normalizer
- essentiality ve display priority
- Türkçe arama
- image fallback
- eksik alan kartları

Integration/API:
- migration
- sözlük idempotency
- backfill dry-run/idempotency/manual preservation
- dashboard v2
- retailer/category/status/query filtreleri
- eski dashboard geriye uyumluluğu

Playwright:
- dashboard gerçek veri
- Bugün Bitiyor koşullu görünüm
- iki satırlı scroller
- BİM/A101 sekmeleri
- kategori ve arama
- durum rozetleri
- Broşürde Gör
- 320 px taşma kontrolü

## Definition of Done
Migration, kategori sözlüğü, backfill, dashboard v2, yeni UI, kategori görselleri, responsive/E2E, regresyon kontrolleri, typecheck/test/build/lint tamamlanır. `AGENTS.md`, README ve operasyon belgeleri gerçek durumla güncellenir.
