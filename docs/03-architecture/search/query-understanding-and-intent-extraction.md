# Sorgu Anlama ve Niyet Çıkarımı

**Belge Kodu:** ARCH-SEARCH-002
**Sürüm:** 1.0

## 1. Amaç

Kullanıcı sorgusunu yalnızca kelime listesi olarak değil, makine tarafından uygulanabilir bir arama planı olarak temsil etmek.

## 2. Arama planı modeli

```ts
export interface ProductSearchPlan {
  rawQuery: string;
  normalizedQuery: string;
  categoryId?: string;
  brandIds?: string[];
  requiredAttributes: Record<string, string | number | boolean | string[]>;
  preferredAttributes: Record<string, string | number | boolean | string[]>;
  excludedAttributes: Record<string, string | number | boolean | string[]>;
  usageIntents: string[];
  quantity?: {
    value: number;
    unit: string;
  };
  priceConstraint?: {
    min?: number;
    max?: number;
  };
  confidence: number;
  unresolvedTerms: string[];
}
```

## 3. İşleme sırası

1. Unicode ve Türkçe karakter normalizasyonu
2. Küçük harfe dönüştürme
3. Birim ve sayı çözümleme: `1 kg`, `1000 gr`, `40 adet`
4. Yazım hatası adayları: `cirtli` → `cırtlı`
5. Alias çözümleme
6. Kategori çıkarımı
7. Özellik ve kullanım amacı çıkarımı
8. Hariç tutma ifadeleri: `külot olmasın`, `şekersiz`, `laktozsuz`
9. Güven skoru üretimi

## 4. Kural tabanlı ve model tabanlı yaklaşım

Her sorguda büyük dil modeli çağrılmayacaktır. Öncelik sırası:

1. Deterministik sözlük ve taksonomi kuralları
2. Küçük sınıflandırıcı veya embedding tabanlı kategori tahmini
3. Belirsiz sorgularda LLM fallback

Bu yaklaşım maliyeti, gecikmeyi ve tutarsızlığı azaltır.

## 5. Belirsizlik yönetimi

Sistem yüksek güvenle yorumlayamadığı terimi sessizce kesin bilgiye çevirmemelidir.

Örnek:

```json
{
  "rawQuery": "çocuk için güzel peynir",
  "categoryId": "cheese",
  "usageIntents": [],
  "confidence": 0.58,
  "unresolvedTerms": ["çocuk için", "güzel"]
}
```

Bu durumda geniş sonuç döndürülebilir ve kullanıcıya açıklayıcı filtreler sunulabilir.

## 6. Sorgu önbelleği

Normalize edilmiş sorgu ile arama planı kısa süreli önbelleğe alınabilir. Taksonomi veya alias sürümü değiştiğinde önbellek anahtarına sürüm dahil edilmelidir.
