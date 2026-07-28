# Scraping, Normalizasyon ve Eşleştirme Hattı

**Belge Kodu:** ARCH-005
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Aşama 1 — Keşif ve edinme

URL keşfi kaynak haritaları, kategori sayfaları, arama sonuçları veya önceden bilinen ürün URL'lerinden yapılabilir. Her URL normalize edilerek aynı hedefin gereksiz tekrarları azaltılır.

Fetcher; zaman aşımı, yönlendirme, robots/politika kararı, yanıt kodu, içerik türü ve içerik hash'ini kaydeder.

## 2. Aşama 2 — Parsing

Parser kaynağa özgüdür. Çıktısı en az şu alanları taşımalıdır:

- kaynak ürün kimliği,
- başlık,
- marka ve model adayları,
- varyant özellikleri,
- güncel fiyat,
- eski fiyat iddiası,
- para birimi,
- stok durumu,
- satıcı,
- kampanya metni,
- canonical URL,
- alan bazlı kanıt veya selector bilgisi.

## 3. Aşama 3 — Kalite kapısı

Eksik fiyat, anlamsız para birimi, geçersiz URL veya boş ürün başlığı gibi sorunlar sınıflandırılır. Her hata kalıcı başarısızlık değildir; bazıları yeniden deneme, bazıları parser güncellemesi, bazıları insan incelemesi gerektirir.

## 4. Aşama 4 — Normalizasyon

Normalizasyon deterministik kurallarla başlar:

- Unicode ve boşluk temizliği,
- marka sözlüğü,
- birim dönüşümleri,
- model token ayrıştırma,
- renk ve kapasite eş anlamlıları,
- satıcı adı standardizasyonu,
- fiyat ve para biçimi çözümleme.

AI destekli çıkarım kullanılırsa kaynak metin, model sürümü, prompt sürümü ve güven skoru saklanır.

## 5. Aşama 5 — Aday üretimi

Tüm katalogla pahalı karşılaştırma yapmak yerine marka, kategori, model tokenları, GTIN/EAN, üretici kodu ve belirleyici özelliklerle aday kümesi üretilir.

## 6. Aşama 6 — Skorlama ve karar

Eşleştirme skoru tek sayıdan ibaret olmamalıdır. Marka, model, varyant, kapasite, renk, GTIN ve kategori uyumları ayrı özellikler olarak kaydedilir. Nihai karar gerekçesi denetlenebilir olmalıdır.

Örnek kararlar:

- `exact_match`
- `probable_match`
- `new_variant_candidate`
- `new_product_candidate`
- `review_required`
- `rejected`

## 7. Aşama 7 — Teklif ve fiyat güncelleme

Kanonik kimlik kararı oluştuktan sonra teklif güncellenir. Aynı gözlem tekrar geldiğinde yeni kopya üretmek yerine idempotent güncelleme yapılır. Fiyat noktası yalnızca anlamlı değişiklik veya yeni gözlem politikası gerektiriyorsa eklenir.
