# Sprint 01A — Kodsuz E2E Uygulama ve Doğrulama Rehberi

## Önkoşullar
PostgreSQL, API ve storage çalışmalıdır. A101/BİM ingestion gerçek verilerle en az bir kez tamamlanmış olmalıdır. Kabul demosunda seed/mock ürün kullanılmaz.

## 1. Migration
Migration sonrası:
- `categories` oluşur.
- product offer kategori alanlarını kazanır.
- mevcut teklif sayısı değişmez.
- eski API çalışır.
- rollback belgelenir.

## 2. Kategori sözlüğü
Sözlük iki kez yüklenir; duplicate oluşmamalıdır. Örnekler:
- Beyaz Peynir -> Süt ve Kahvaltılık
- Zeytin -> Süt ve Kahvaltılık
- Sıvı Yağ -> Temel Gıda
- Deterjan -> Temizlik
- Televizyon -> Elektronik

## 3. Backfill
Önce dry-run:
- incelenen, eşleşen, `Diğer`, düşük güvenli ve korunan manuel kayıt sayıları raporlanır.
- DB değişmez.

Sonra gerçek çalışma:
- manuel kategori ezilmez.
- ikinci çalıştırma duplicate veya beklenmeyen değişiklik üretmez.

## 4. API
`/dashboard/v2` yanıtında:
`ending_today`, `featured_essentials`, `retailers.bim`, `retailers.a101`, `recent_brochures`, `categories` bulunur.

Kontrol:
- marketler karışmaz.
- bugün biten gerçekten bugündür.
- yaklaşan gelecekte başlar.
- aktif bugün geçerlidir.
- temel ihtiyaçlar üst sıralardadır.

## 5. Kullanıcı akışı
- Sayfa yüklenir; API hatası anlaşılır gösterilir.
- Bugün biten yoksa bölüm gizlenir.
- Öne çıkanlar iki satırlı yatay akışta gösterilir.
- Peynir, yağ, zeytin gibi temel ürünler ilk bakışta öndedir.
- Aktif ve yaklaşan teklifler hem renk hem metinle ayrılır.
- BİM/A101 sekmeleri yalnız kendi ürünlerini gösterir.
- Kategori filtresi ve arama beraber çalışır.
- Kategori görselinde `Temsili görsel` bilgisi vardır.
- `Broşürde Gör` doğru orijinal SOT broşürünü açar.
- Son broşürlerde gerçek sayfa ve ürün sayıları görünür.

## 6. Mobil
320 px:
- sayfa geneli yatay taşmaz.
- kart okunur.
- fırsat scroller'ı kendi içinde çalışır.
- filtre ve sekmeler erişilebilirdir.
- lightbox ekran dışına taşmaz.

## 7. Hata senaryoları
API kapalı, görsel yok, fiyat/tarih/market/kategori eksik, boş dashboard, asset 404 ve yavaş API test edilir. UI çökmemelidir.

## 8. Otomatik kontroller
Repository'deki gerçek komutlar tespit edilip çalıştırılır. En az:
```text
pnpm typecheck
pnpm test
pnpm build
```
Gerçek lint, database verify ve Playwright komutları da çalıştırılır.

## 9. Teslim kanıtları
- değişen dosyalar
- migration ve kategori sayısı
- dry-run/gerçek backfill özeti
- kategorize ürün ve `Diğer` oranı
- API örnek özeti
- her test komutu + exit code
- masaüstü ve 320 px ekran görüntüleri
- BİM/A101, Bugün Bitiyor ve SOT kanıtı
- bilinen sınırlamalar

## Başarısız kabul
Seed/mock kullanımı, timezone hatası, market karışması, temsili görselin gerçekmiş gibi sunulması, SOT bağlantısının bozulması, mobil taşma veya testlerin atlanması durumunda sprint tamamlanmış sayılmaz.
