# Ürün Özellik Çıkarımı ve Zenginleştirme

**Belge Kodu:** ARCH-SEARCH-004
**Sürüm:** 1.0

## 1. Neden gerekli?

Semantik arama, ürünler arasındaki anlam yakınlığını bulur; fakat kesin filtreleri güvenilir biçimde uygulamak için ürünlerin yapılandırılmış özelliklere sahip olması gerekir.

Örneğin `Prima Premium Care 4 Numara 52 Adet` başlığında `cırtlı` yazmayabilir. Ürün serisi ve kategori bilgisi kullanılarak ürün biçimi `standart/cırtlı` olarak zenginleştirilebilir.

## 2. Kaynaklar

Özellik çıkarımı şu kaynaklardan yapılabilir:

- Ürün başlığı
- Mağaza açıklaması
- Teknik özellik tablosu
- Breadcrumb ve mağaza kategorisi
- Marka-seri bilgi tabanı
- Paket görseli veya OCR çıktısı
- İnsan tarafından doğrulanmış kanonik ürün kaydı

## 3. Çıktı modeli

```ts
export interface ExtractedProductAttribute {
  attributeKey: string;
  value: string | number | boolean | string[];
  normalizedValue: string | number | boolean | string[];
  source: "title" | "description" | "specification" | "category" | "brand_rule" | "image" | "manual";
  confidence: number;
  extractorVersion: string;
  evidence?: string;
}
```

## 4. Güven seviyeleri

- **Kesin:** açık teknik alan veya insan doğrulaması
- **Yüksek:** başlıkta açık ifade veya güçlü marka-seri kuralı
- **Orta:** açıklama ve bağlamsal çıkarım
- **Düşük:** yalnızca semantik tahmin

Kesin filtrelerde yalnızca yeterli güven seviyesine sahip özellikler kullanılmalıdır.

## 5. Kategori şemaları

Her kategori kendi özellik şemasına sahip olmalıdır.

Bebek bezi örneği:

```json
{
  "size": 5,
  "count": 40,
  "closureType": "tape",
  "productForm": "standard",
  "usagePeriod": ["day", "night"]
}
```

Peynir örneği:

```json
{
  "cheeseType": "processed",
  "form": "sliced",
  "weightGrams": 200,
  "usage": ["toast", "sandwich", "burger"],
  "meltingQuality": "high"
}
```

## 6. Yeniden işleme

Özellik çıkarıcı sürümü değiştiğinde ham gözlemler ve kanonik ürünler tekrar işlenebilmelidir. Eski ve yeni değerler denetim iziyle karşılaştırılmalıdır.
