# Doğrulama ve Review Planı

| Alan | Değer |
|---|---|
| Document ID | POC-003 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | POC-001, POC-002 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Extraction ve normalizasyon sonuçlarının nasıl doğrulanacağını ve insan review akışının nasıl işleyeceğini tanımlar.

## 2. Doğrulama Katmanları

### 2.1. Şema Doğrulama

- zorunlu alanlar,
- veri tipleri,
- tarih biçimleri,
- para birimi,
- birim sözlüğü.

### 2.2. İş Kuralı Doğrulama

- campaign_price negatif olamaz,
- campaign_end başlangıçtan önce olamaz,
- miktar sıfırdan büyük olmalıdır,
- birim fiyat hesaplanabiliyorsa tutarlı olmalıdır,
- normal fiyat varsa kampanya fiyatı ilişki kontrolünden geçmelidir.

### 2.3. Kaynak Doğrulama

- kayıt doğru sayfaya bağlı mı,
- bounding box veya bölge doğru mu,
- ham metin korunmuş mu,
- fiyat doğru ürün kartına mı ait.

### 2.4. Çapraz Alan Doğrulama

- “4 × 250 ml” toplam miktarıyla uyumlu mu,
- “2 al 1 öde” düz fiyat gibi yorumlanmış mı,
- üyelik koşulu kaybolmuş mu,
- tarih sayfa geneline mi ürün kartına mı ait.

## 3. Review Kuyruğu Tetikleyicileri

Bir kayıt review kuyruğuna alınırsa en az bir reason code taşımalıdır:

- LOW_CONFIDENCE
- PRICE_PRODUCT_AMBIGUITY
- DATE_SCOPE_AMBIGUITY
- QUANTITY_PARSE_ERROR
- UNKNOWN_UNIT
- SCHEMA_VIOLATION
- DUPLICATE_CANDIDATE
- NORMALIZATION_CONFLICT
- SOURCE_UNREADABLE

## 4. Review Ekranı İçin Minimum İhtiyaçlar

- kaynak sayfa veya görsel
- ürün kartı bölgesi
- ham extraction
- normalize sonuç
- alan bazlı confidence
- reason code
- düzenlenebilir alanlar
- kabul, düzelt, reddet eylemleri
- reviewer notu
- işlem geçmişi

## 5. Review Sonuçları

### Accepted

Kayıt değişmeden onaylandı.

### Corrected

Bir veya daha fazla alan değiştirildi.

### Rejected

Ürün kartı veya kayıt geçersiz.

### Deferred

Karar için ek kaynak veya uzmanlık gerekiyor.

## 6. Audit Trail

Her manuel işlem için:

- reviewer_id
- timestamp
- önceki değer
- yeni değer
- reason
- pipeline_version

saklanır.

## 7. Review Süresi Ölçümü

Aşağıdakiler raporlanır:

- kayıt başına ortalama review süresi,
- yalnızca kabul edilen kayıtların süresi,
- düzeltilen kayıtların süresi,
- en sık hata reason code'ları,
- kaynak bazlı review oranı.

## 8. İnsan Review Başarı Kriteri

POC sonunda otomasyon doğruluğu kadar, review ile güvenilir sonuca ulaşma maliyeti de değerlendirilir.

Sistem, otomatik sonucu mükemmel üretmek zorunda değildir; ancak yanlışları görünür ve düzeltilebilir üretmek zorundadır.
