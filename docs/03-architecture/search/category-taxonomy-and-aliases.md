# Kategori Taksonomisi ve Alias Sözlüğü

**Belge Kodu:** ARCH-SEARCH-003
**Sürüm:** 1.0

## 1. Taksonomi amacı

Mağazaların farklı kategori adlarını ve kullanıcıların günlük dilini tek kanonik ürün sınıflandırmasına bağlamak.

Örnek kanonik yol:

```text
anne-bebek
└── bebek-bakım
    └── bebek-bezi
        ├── cırtlı-bez
        └── külot-bez
```

```text
gıda
└── süt-ve-kahvaltılık
    └── peynir
        ├── kaşar
        ├── eritme-peyniri
        ├── dilimli-peynir
        └── tost-peyniri
```

## 2. Alias türleri

- Kullanıcı aliası: `bantlı bez` → `cırtlı bez`
- Mağaza kategori aliası: `bebek hijyen` → `bebek bezi`
- Ürün tipi aliası: `sandviç peyniri` → `dilimli eritme peyniri`
- Yazım aliası: `cirtli` → `cırtlı`
- Marka aliası: farklı yazım ve kısaltmalar
- Kullanım amacı aliası: `tostta eriyen` → `usage=toast`

## 3. Önerilen kayıt modeli

```ts
export interface SearchAlias {
  id: string;
  phrase: string;
  normalizedPhrase: string;
  targetType: "category" | "attribute" | "brand" | "usage" | "exclusion";
  targetKey: string;
  targetValue?: string;
  locale: "tr-TR";
  priority: number;
  source: "curated" | "merchant" | "model" | "analytics";
  status: "active" | "review" | "disabled";
  taxonomyVersion: string;
}
```

## 4. Yönetim ilkeleri

- Alias değişiklikleri sürümlenir.
- Otomatik keşfedilen alias doğrudan üretime alınmaz; güven eşiği veya insan onayı gerekir.
- Bir ifade birden fazla anlama gelebiliyorsa kategori bağlamı kullanılır.
- Kullanıcı davranışı yeni alias önerileri üretmekte kullanılabilir.
- Taksonomi silme yerine pasifleştirme ve yönlendirme ile evrilir.

## 5. İlk örnek sözlük

| İfade | Hedef |
|---|---|
| cırtlı bez | `baby_diaper.closure_type=tape` |
| bantlı bez | `baby_diaper.closure_type=tape` |
| külot bez | `baby_diaper.product_form=pants` |
| tost peyniri | `cheese.usage=toast` |
| sandviç peyniri | `cheese.usage=sandwich` |
| iyi eriyen peynir | `cheese.melting_quality=high` |
| renkliler için | `detergent.fabric_color=colored` |
| şekersiz | `sugar_free=true` |
