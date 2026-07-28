# Normalization Model

| Alan | Değer |
|---|---|
| Document ID | DOM-005 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-002, DOM-004 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Kaynaklardaki farklı yazım ve gösterimleri karşılaştırılabilir hale getirirken ham kanıtı korumak.

## 2. Katmanlar

### Raw

Kaynakta görülen değer.

```text
"4x250 ml"
```

### Parsed

Yapısal olarak ayrıştırılmış değer.

```text
pack_count = 4
unit_quantity = 250
unit = ml
```

### Normalized

Standart temel birime dönüştürülmüş değer.

```text
total_quantity = 1000
normalized_unit = ml
```

### Canonical

Domain sözlüğündeki standart temsil.

```text
PackageConfiguration(4 × 250 ml, total 1 L)
```

## 3. Normalize Edilen Alanlar

- marka
- ürün türü
- varyant özellikleri
- miktar
- birim
- paket adedi
- fiyat
- para birimi
- tarih
- kampanya koşulu
- satıcı adı
- kategori

## 4. Birim Politikası

İlk desteklenen temel birimler:

- kütle: g
- hacim: ml
- adet: piece
- uzunluk: m

Gösterimde kullanıcı dostu birim kullanılabilir; hesaplama canonical temel birimde yapılır.

## 5. Marka Normalizasyonu

Aşağıdakiler korunur:

- raw_brand
- normalized_brand
- brand_id
- normalization_rule_id

Marka bilinmiyorsa tahmin zorunlu değildir.

## 6. Ürün Adı Normalizasyonu

Ürün adı tek metin olarak ezilmez.

Mümkün olduğunda ayrılır:

- brand
- base product
- variant attributes
- package text
- marketing text

“Avantajlı paket”, “ekonomik boy” gibi pazarlama metinleri kimlik sinyali olarak düşük ağırlık taşır.

## 7. Tarih Normalizasyonu

Tarih için:

- raw_text
- parsed_date
- timezone
- precision
- scope
- inference_reason

saklanır.

## 8. Kural Sürümleme

Her normalize sonuç:

- normalization_rules_version
- normalized_at
- source_field
- warnings

taşır.

Kural değiştiğinde eski sonuç sessizce güncellenmez; yeni sürüm oluşturulur.

## 9. Kayıplı Dönüşüm Yasağı

Normalization işlemi:

- raw text'i silmez,
- bilinmeyen alanı uydurmaz,
- varyant bilgisini genel ürün adına indirgemez,
- çoklu paket bilgisini yalnızca toplam miktara düşürmez.
