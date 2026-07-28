# Matching Lifecycle

| Alan | Değer |
|---|---|
| Document ID | DOM-006 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-002, DOM-005 |
| Son Güncelleme | 2026-07-28 |

## 1. Yaşam Döngüsü

```text
Observed
  → Parsed
  → Normalized
  → Candidate Generated
  → Conflict Checked
  → Scored
  → Auto Matched / Review Required / No Match
  → Confirmed
```

## 2. Candidate Generation

Aday havuzu şu yollarla daraltılır:

1. GTIN
2. marka
3. kategori
4. temel ürün türü
5. miktar aralığı
6. varyant anahtarları
7. metin benzerliği

Tüm ürün kataloğuyla kör benzerlik karşılaştırması yapılmaz.

## 3. Conflict Check

Skor hesaplanmadan önce hard conflict kuralları uygulanır.

Örnek:

- farklı doğrulanmış GTIN,
- tam yağlı ve yağsız çelişkisi,
- 1 L ile 200 ml farkı,
- farklı ürün kategorisi.

## 4. Scoring

Önerilen skor bileşenleri:

- brand_score
- product_type_score
- variant_score
- quantity_score
- package_score
- text_score
- evidence_score

Toplam skorun yanında bileşenler saklanır.

## 5. Karar Eşikleri

Başlangıç modeli:

- yüksek eşik üzeri ve conflict yok: auto match
- orta aralık: review
- düşük eşik: no match veya new candidate

Kesin eşikler test veri setiyle kalibre edilir.

## 6. İnsan Kararları

Reviewer:

- adayı kabul eder,
- adayı reddeder,
- başka canonical ürün seçer,
- yeni canonical ürün oluşturur,
- gözlemi çözümsüz bırakır.

## 7. Alias Öğrenimi

Onaylanmış kaynak yazımları alias olarak tutulabilir.

Alias:

- source-specific olabilir,
- global olmayabilir,
- güven ve kullanım sayısı taşır,
- yanlış onay halinde geri alınabilir.

## 8. Merge ve Split

### Merge

İki canonical ürünün aslında aynı olduğu anlaşılırsa kimlikler birleştirilir.

### Split

Tek canonical ürün içinde yanlışlıkla farklı varyantlar birleştirilmişse ayrılır.

Offer geçmişi kaybolmaz; yeni kimliklere yeniden bağlanır ve audit edilir.

## 9. Regression

Her onaylanmış veya düzeltilmiş eşleşme, uygun olduğunda regression örneğine dönüşür.

Yeni matching sürümü eski kritik kararları yeniden test eder.
