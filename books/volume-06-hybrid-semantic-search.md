# Cilt 06 — Hibrit ve Semantik Ürün Araması

Bu cilt, Akıllı Alışveriş Asistanı'nın kullanıcı dilini ürün kataloğuna bağlayan arama mimarisini tek akışta sunar.

## İçindekiler

1. Hibrit ve Semantik Ürün Arama Mimarisi
2. Hibrit Semantik Ürün Araması
3. Sorgu Anlama ve Niyet Çıkarımı
4. Kategori Taksonomisi ve Alias Sözlüğü
5. Ürün Özellik Çıkarımı ve Zenginleştirme
6. Sıralama ve Sonuç Açıklamaları
7. ADR-0005 — PostgreSQL Tabanlı Hibrit Ürün Araması

---

<!-- SOURCE: docs/03-architecture/search/README.md -->

# Hibrit ve Semantik Ürün Arama Mimarisi

**Belge Kodu:** ARCH-SEARCH-000
**Sürüm:** 1.0
**Durum:** Onaylandı

Bu bölüm, kullanıcının market diliyle yazdığı sorguları kanonik kategori, özellik, kullanım amacı ve hariç tutma kurallarına dönüştüren ürün arama mimarisini tanımlar.

Amaç yalnızca ürün başlığında geçen kelimeleri bulmak değildir. Sistem; `bebek bezi cırtlı`, `tost peyniri`, `gece sızdırmayan bez`, `renkliler için sıvı deterjan` gibi sorguları anlamlandırmalı, kesin ürün özelliklerini korumalı ve semantik olarak yakın fakat yanlış ürünleri elemelidir.

## Belgeler

1. [Hibrit semantik ürün araması](hybrid-semantic-product-search.md)
2. [Sorgu anlama ve niyet çıkarımı](query-understanding-and-intent-extraction.md)
3. [Kategori taksonomisi ve alias sözlüğü](category-taxonomy-and-aliases.md)
4. [Ürün özellik çıkarımı ve zenginleştirme](product-attribute-extraction.md)
5. [Sıralama ve sonuç açıklamaları](ranking-and-result-explanations.md)
6. [ADR-0005: PostgreSQL tabanlı hibrit arama](../adr/ADR-0005-postgresql-hybrid-search.md)

## Temel karar

Arama tek bir teknolojiye dayanmayacaktır. Sonuçlar aşağıdaki sinyallerin birlikte değerlendirilmesiyle üretilecektir:

- Tam ve yaklaşık metin eşleşmesi
- Kategori ve özellik filtreleri
- Alias ve eşanlamlı eşleşmeleri
- Semantik vektör benzerliği
- Kullanım amacı ve bağlamsal uyum
- Veri kalitesi ve ürün kimliği güveni
- Yeniden sıralama kuralları

## Güvenlik ilkesi

Semantik yakınlık, kesin ürün özelliklerinin yerine geçmez. Örneğin `cırtlı bez` sorgusunda `külot bez` semantik olarak yakın olsa bile kullanıcı niyetiyle çeliştiği için filtrelenebilir veya açıkça ayrı bir öneri grubunda gösterilebilir.

---

<!-- SOURCE: docs/03-architecture/search/hybrid-semantic-product-search.md -->

# Hibrit Semantik Ürün Araması

**Belge Kodu:** ARCH-SEARCH-001
**Sürüm:** 1.0

## 1. Problem

Perakende ürün adları mağazadan mağazaya değişir. Kullanıcı ise katalog dilini değil günlük dili kullanır. `Tost peyniri` ifadesi bazı mağazalarda doğrudan ürün adında yer alırken başka mağazalarda aynı ihtiyaç `dilimli eritme peyniri`, `burger peyniri` veya `sandviç peyniri` adıyla listelenebilir.

Yalnızca kelime araması kullanılırsa ilgili ürünlerin bir bölümü bulunamaz. Yalnızca embedding kullanılırsa da birbirine yakın fakat işlevsel olarak farklı ürünler yanlış sonuçlara karışabilir.

## 2. Çözüm

Arama beş katmandan oluşur:

1. **Sorgu normalizasyonu:** Türkçe karakter, büyük-küçük harf, yazım hatası, kelime sırası ve birim ifadeleri normalize edilir.
2. **Sorgu ayrıştırma:** kategori, marka, boyut, miktar, ürün biçimi, kullanım amacı, tercih ve hariç tutmalar çıkarılır.
3. **Aday üretimi:** full-text, trigram, alias ve vektör araması paralel veya ardışık olarak aday üretir.
4. **Kesin filtreleme:** kategori, ürün biçimi, beden, miktar, alerjen veya benzeri yapılandırılmış kısıtlar uygulanır.
5. **Yeniden sıralama:** metin, semantik, özellik ve kalite skorları tek sıralama skoruna dönüştürülür.

## 3. Örnek: bebek bezi cırtlı

Sorgu şu yapıya dönüştürülebilir:

```json
{
  "normalizedQuery": "bebek bezi cırtlı",
  "category": "baby_diaper",
  "requiredAttributes": {
    "closureType": "tape"
  },
  "excludedAttributes": {
    "productForm": "pants"
  }
}
```

Ürün başlığında `cırtlı` yazmasa bile ürün ailesi veya özellik çıkarımı ürünün standart bantlı bez olduğunu biliyorsa aday olabilir. `Külot bez` ise semantik benzerlik yüksek olsa bile kesin özellik uyuşmazlığı nedeniyle elenir.

## 4. Örnek: tost peyniri

Sorgu şu niyete dönüştürülebilir:

```json
{
  "normalizedQuery": "tost peyniri",
  "category": "cheese",
  "usageIntent": "toast",
  "preferredProductTypes": [
    "toast_cheese",
    "processed_sliced_cheese",
    "melting_cheese",
    "kashar_cheese"
  ]
}
```

Sonuç grupları:

1. Başlığında doğrudan `tost peyniri` geçenler
2. Kullanım amacı `tost` olarak işaretlenmiş ürünler
3. Dilimli veya kolay eriyen peynirler
4. Daha genel fakat uygun kaşar ürünleri

## 5. Aday üretim kaynakları

- PostgreSQL full-text search
- `pg_trgm` benzerliği
- Kategori ve marka alias tabloları
- Yapılandırılmış özellik indeksleri
- `pgvector` embedding yakınlığı
- Popüler sorgu ve tıklama sinyalleri

## 6. İlk sürüm sınırları

POC aşamasında ayrı Elasticsearch/OpenSearch kümesi kurulmayacaktır. PostgreSQL tabanlı çözüm yeterli olduğu sürece korunacaktır. Ölçülen gecikme, indeks boyutu veya sorgu hacmi sınırı aşılırsa arama servisi ayrıştırılabilir.

---

<!-- SOURCE: docs/03-architecture/search/query-understanding-and-intent-extraction.md -->

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

---

<!-- SOURCE: docs/03-architecture/search/category-taxonomy-and-aliases.md -->

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

---

<!-- SOURCE: docs/03-architecture/search/product-attribute-extraction.md -->

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

---

<!-- SOURCE: docs/03-architecture/search/ranking-and-result-explanations.md -->

# Sıralama ve Sonuç Açıklamaları

**Belge Kodu:** ARCH-SEARCH-005
**Sürüm:** 1.0

## 1. Amaç

Aday ürünleri yalnızca semantik benzerliğe göre değil, kullanıcı niyetine gerçek uyumuna göre sıralamak.

## 2. Örnek skor bileşenleri

```text
final_score =
    lexical_score
  + semantic_score
  + category_score
  + required_attribute_score
  + preferred_attribute_score
  + usage_intent_score
  + product_identity_quality_score
  + availability_score
  - exclusion_penalty
  - uncertainty_penalty
```

Ağırlıklar kategori bazında farklılaştırılabilir ve çevrimdışı testlerle ayarlanır.

## 3. Kesin filtre ve yumuşak tercih ayrımı

- `5 numara` gibi açık beden isteği kesin filtre olabilir.
- `iyi eriyen` gibi yoruma açık özellik yumuşak tercih olabilir.
- `külot olmasın` açık hariç tutmadır.
- `uygun fiyatlı` sonuç kümesinde fiyat sıralamasını etkileyen tercihtir.

## 4. Açıklanabilir sonuç

Sistem sonuç kartında kısa gerekçe gösterebilir:

- `Cırtlı bebek bezi olarak eşleşti`
- `Tost kullanımına uygun dilimli eritme peyniri`
- `Aradığınız 5 numara ve 40+ adet koşullarını karşılıyor`
- `Benzer ürün; ürün adında “tost” geçmiyor`

Bu açıklamalar model tarafından serbestçe uydurulmamalı; kayıtlı eşleşme sinyallerinden üretilmelidir.

## 5. Değerlendirme metrikleri

- Precision@K
- Recall@K
- NDCG@K
- Yanlış kategori oranı
- Kesin özellik ihlali oranı
- Sonuçsuz sorgu oranı
- Tıklama ve sepete yönlendirme oranı
- Kullanıcının sorguyu yeniden yazma oranı

## 6. Test veri seti

İlk altın veri setinde en az şu sorgu aileleri yer almalıdır:

- Günlük dil ve katalog dili farkı
- Yazım hataları ve Türkçe karakter eksikleri
- Marka + ürün tipi
- Boyut, adet ve ağırlık
- Hariç tutma
- Kullanım amacı
- Belirsiz ve çok anlamlı sorgular
- İlgisiz semantik yakınlık vakaları

---

<!-- SOURCE: docs/03-architecture/adr/ADR-0005-postgresql-hybrid-search.md -->

# ADR-0005 — PostgreSQL Tabanlı Hibrit Ürün Araması

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Ürün araması; tam metin, yazım toleransı, kategori ve özellik filtreleri ile semantik yakınlığı birlikte gerektirir. POC aşamasında ayrı bir arama kümesi kurmak operasyonel yük oluşturacaktır.

## Karar

İlk arama altyapısı PostgreSQL üzerinde kurulacaktır:

- Full-text search
- `pg_trgm`
- Yapılandırılmış kategori ve özellik indeksleri
- `pgvector`
- Alias ve taksonomi tabloları

Arama modülü uygulama içinde açık bir port üzerinden erişilen bağımsız domain modülü olacaktır. Böylece ileride OpenSearch, Elasticsearch veya ayrı bir arama servisine geçiş mümkün olur.

## Gerekçe

- POC ve ilk üretim için düşük operasyon maliyeti
- Ana katalog verisiyle güçlü transaction ve tutarlılık
- Tek veritabanında yeniden indeksleme kolaylığı
- Türkçe sorgu sözlükleri ve yapılandırılmış filtrelerin birlikte uygulanabilmesi

## Sonuçlar

PostgreSQL sorgu planları, indeks boyutları ve gecikmeler izlenecektir. Ayrı arama altyapısına geçiş kararı ancak ölçülen hacim ve gecikme sınırlarıyla alınacaktır.

---
