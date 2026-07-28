# Campaign Offer Model

| Alan | Değer |
|---|---|
| Document ID | DOM-004 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-002, DOM-003 |
| Son Güncelleme | 2026-07-28 |

## 1. Offer Nedir?

Offer, bir ürünün belirli satıcıda, belirli zaman aralığında ve belirli koşullarla satın alınabilen fiyat kaydıdır.

Ürün kalıcıdır; offer geçicidir.

## 2. Offer Alanları

- merchant
- store_scope
- product_variant veya unresolved observation
- regular_price
- campaign_price
- currency
- validity_period
- campaign_conditions
- membership_requirement
- stock_limit
- channel
- provenance
- confidence
- status

## 3. Kampanya Türleri

İlk domain sözlüğü:

- DIRECT_PRICE
- PERCENT_DISCOUNT
- FIXED_AMOUNT_DISCOUNT
- MULTI_BUY
- BUY_X_GET_Y
- MEMBER_PRICE
- COUPON_PRICE
- BUNDLE_PRICE
- LOYALTY_POINTS
- UNKNOWN

POC, bütün türleri hesaplamak zorunda değildir; ancak raw condition kaybolmamalıdır.

## 4. Fiyat Ayrımı

### Regular Price

Kaynakta açıkça belirtilmiş referans fiyat.

### Campaign Price

Koşullar sağlandığında geçerli fiyat.

### Effective Unit Price

Kampanya koşulları normalize edilebiliyorsa temel birim başına hesaplanan değer.

### Displayed Price

Kaynakta görsel olarak öne çıkarılan fiyat. Her zaman gerçek ödenecek tutar olmayabilir.

## 5. Geçerlilik

ValidityPeriod kesinlik seviyesi taşır:

- EXACT
- DATE_ONLY
- INFERRED_FROM_PAGE
- INFERRED_FROM_CATALOG
- UNKNOWN

Tarih kaynağı belirtilmeden türetilmez.

## 6. Koşullar

Koşullar yapılandırılmış ve ham biçimde birlikte tutulur.

Örnek:

```text
Raw: Money Kart ile 2 adet alımda
Type: MEMBER_PRICE + MIN_QUANTITY
Parameters:
  membership: Money Kart
  minimum_quantity: 2
```

## 7. Çözümlenmemiş Offer

Ürün kimliği henüz belirlenemese bile offer kaybolmaz.

Bu durumda:

- `product_variant_id` boş,
- `observation_id` dolu,
- status `UNRESOLVED_PRODUCT`

olarak saklanabilir.

## 8. Karşılaştırılabilirlik

İki offer ancak:

- aynı canonical ürün,
- uyumlu paket,
- uyumlu kanal ve koşullar,
- örtüşen veya açıkça belirtilen zaman bağlamı

varsa doğrudan karşılaştırılır.

Üyelik gerektiren fiyat ile koşulsuz fiyat aynı etikette gösterilmez.
