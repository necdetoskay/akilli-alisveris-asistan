# Servis Sınırları ve Modüler Monolit

**Belge Kodu:** ARCH-004
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Başlangıç yaklaşımı

İlk üretim sürümü modüler monolit olarak geliştirilir. Modüller tek deploy edilebilir uygulama içinde bulunabilir; ancak kod, veri sahipliği ve olay sözleşmeleri açısından açık sınırlar taşır.

Bu karar, POC aşamasında mikroservis operasyon maliyetinden kaçınırken ileride ölçülen ihtiyaçlara göre bağımsızlaştırma imkânını korur.

## 2. Önerilen modüller

- `source-catalog`
- `ingestion`
- `observation`
- `normalization`
- `identity-resolution`
- `catalog`
- `offer`
- `pricing`
- `search`
- `watchlist`
- `notification`
- `review-operations`

## 3. Sınır kuralları

Bir modül başka modülün tablolarına doğrudan yazamaz. Değişiklikler modülün uygulama servisi veya tanımlı domain olayı üzerinden yapılır.

Ortak klasör, domain nesnelerinin kontrolsüz paylaşım alanı olamaz. Ortak kod yalnızca gerçekten teknik ve kararlı yapı taşlarını içerir.

Modüller arası sözleşmeler sürümlenebilir DTO veya olay şemalarıyla ifade edilir. İç domain modeli dışarı sızdırılmaz.

## 4. Ayrıştırma adayları

Aşağıdaki koşullar oluşursa bir modül bağımsız servise dönüştürülebilir:

- farklı ölçekleme profili,
- ayrı hata izolasyonu ihtiyacı,
- bağımsız yayın gereksinimi,
- farklı güvenlik sınırı,
- yoğun hesaplama veya tarayıcı iş yükü,
- farklı ekip sahipliği.

İlk güçlü adaylar ingestion workers, browser pool, arama indeksi ve bildirim gönderimidir.

## 5. Monorepo sınırı

Kod deposu monorepo olabilir. Monorepo, modül sınırlarının olmadığı anlamına gelmez. Paket bağımlılıkları lint ve architecture tests ile denetlenmelidir.
