# Domain Entities and Value Objects

| Alan | Değer |
|---|---|
| Document ID | DOM-003 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-001, DOM-002 |
| Son Güncelleme | 2026-07-28 |

## 1. Entity'ler

### Source

Kampanya bilgisinin mantıksal kaynağı.

Örnek alanlar:

- source_id
- source_type
- provider
- canonical_uri
- market_id
- status

### SourceSnapshot

Kaynağın belirli içerik sürümü.

- snapshot_id
- source_id
- content_hash
- retrieved_at
- media_type
- storage_reference
- metadata

### ExtractionRun

Bir source snapshot üzerinde çalışan pipeline örneği.

- run_id
- snapshot_id
- pipeline_version
- model_version
- prompt_version
- status
- started_at
- completed_at

### Observation

Kaynak bölgesinden çıkarılan ham kayıt.

- observation_id
- run_id
- page_or_region
- raw_text
- raw_fields
- field_confidences
- evidence_reference

### ProductFamily

Ürün ailesinin kalıcı kimliği.

- product_family_id
- brand_id
- base_product_type
- category_id
- canonical_name

### ProductVariant

Canonical satın alma ürünü.

- product_variant_id
- product_family_id
- attributes
- package_configuration
- gtins
- status

### Offer

Belirli satıcı ve zaman koşulundaki fiyat teklifi.

- offer_id
- product_variant_id veya unresolved_observation_id
- merchant_id
- price
- validity_period
- conditions
- provenance
- status

### MatchDecision

Observation ile ProductVariant arasındaki kimlik kararı.

- match_decision_id
- observation_id
- candidate_product_variant_id
- decision
- score
- reasons
- reviewer_id
- decided_at

## 2. Value Object'ler

### Money

- amount
- currency

Para miktarı floating-point olarak tutulmaz.

### Quantity

- value
- unit
- normalized_value
- normalized_unit

### PackageConfiguration

- unit_quantity
- pack_count
- total_quantity
- container_type

### ValidityPeriod

- starts_at
- ends_at
- timezone
- precision

### Confidence

- value
- method
- calibration_version

### EvidenceReference

- snapshot_id
- page_number
- bounding_box veya selector
- extracted_text

### CampaignCondition

- condition_type
- parameters
- raw_text

## 3. Aggregate Sınırları

POC için önerilen aggregate'ler:

### Source Processing Aggregate

- SourceSnapshot
- ExtractionRun
- Observation

### Product Identity Aggregate

- ProductFamily
- ProductVariant
- aliases
- MatchDecision

### Offer Aggregate

- Offer
- validity
- price
- conditions
- provenance

Bu aggregate'ler ayrı sürümlenebilir ve ayrı hatalara sahip olabilir.
