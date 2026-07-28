# Hata Sınıflandırması

| Alan | Değer |
|---|---|
| Document ID | POC-005 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | POC-003, POC-004 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Hataların aynı dil ve önem seviyesiyle raporlanmasını sağlar.

## 2. Önem Seviyeleri

### SEV-1 — Kritik

Yanlış satın alma kararına doğrudan yol açabilir.

Örnek:

- yanlış fiyat,
- yanlış ürün-fiyat eşleşmesi,
- yanlış kampanya bitiş tarihi,
- yanlış para birimi,
- kaynaksız kayıt.

### SEV-2 — Yüksek

Karşılaştırmayı anlamlı biçimde bozar.

Örnek:

- yanlış miktar,
- yanlış paket adedi,
- kampanya koşulunun kaybolması,
- yanlış birim normalizasyonu.

### SEV-3 — Orta

Kayıt kullanılabilir ancak eksik veya düşük kaliteli hale gelir.

Örnek:

- marka eksik,
- varyant eksik,
- kategori yanlış,
- normal fiyat eksik.

### SEV-4 — Düşük

Sunum veya küçük biçim farklarıdır.

Örnek:

- büyük/küçük harf,
- noktalama,
- boşluk,
- eşdeğer yazım biçimi.

## 3. Hata Aileleri

- SOURCE_ERROR
- CARD_DETECTION_ERROR
- OCR_ERROR
- FIELD_EXTRACTION_ERROR
- FIELD_ASSOCIATION_ERROR
- DATE_SCOPE_ERROR
- QUANTITY_NORMALIZATION_ERROR
- PRICE_NORMALIZATION_ERROR
- DUPLICATION_ERROR
- PROVENANCE_ERROR
- REVIEW_ERROR
- PIPELINE_ERROR

## 4. Sonuç Durumları

Her alan için:

- CORRECT
- INCORRECT
- MISSING
- AMBIGUOUS
- NOT_APPLICABLE

kullanılır.

## 5. Hata Kaydı

Her hata en az şunları taşır:

- error_id
- run_id
- source_id
- record_id
- field_name
- error_family
- severity
- expected
- actual
- evidence_reference
- reviewer_note

## 6. Kök Neden

Hata yalnızca görünen sonuca göre değil, mümkün olduğunda kök nedene göre etiketlenir.

Örnek:

Fiyat yanlışsa ama neden yanlış bounding box ise:

- ana aile: FIELD_ASSOCIATION_ERROR
- ikincil belirti: PRICE_NORMALIZATION_ERROR değil

## 7. Kullanım

Hata sınıfları:

- kalite raporlarında,
- review kuyruğunda,
- regression testlerinde,
- kaynak adaptasyon kararlarında

aynı kodlarla kullanılır.
