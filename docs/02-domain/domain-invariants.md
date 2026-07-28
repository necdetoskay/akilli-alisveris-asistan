# Domain Invariants

| Alan | Değer |
|---|---|
| Document ID | DOM-007 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-002..DOM-006 |
| Son Güncelleme | 2026-07-28 |

## 1. Kimlik Kuralları

1. Observation canonical ürün değildir.
2. Product Family doğrudan fiyat taşımaz.
3. Offer bir Product Variant'a veya unresolved observation'a bağlı olmalıdır.
4. Farklı doğrulanmış GTIN kayıtları otomatik birleştirilemez.
5. Hard conflict bulunan aday auto match olamaz.
6. Match kararı gerekçe ve skor bileşenleri olmadan kaydedilemez.

## 2. Provenance Kuralları

1. Her Observation bir SourceSnapshot'a geri bağlanır.
2. Her Offer evidence reference taşır.
3. Normalize değer ham değerin yerini almaz.
4. Kaynak bölgesi bilinmiyorsa bu açıkça belirtilir.
5. Manuel düzeltme audit trail olmadan uygulanamaz.

## 3. Para ve Fiyat Kuralları

1. Money floating-point ile temsil edilmez.
2. Para birimi zorunludur.
3. Kampanya fiyatı koşullarından ayrılmaz.
4. Üyelik fiyatı koşulsuz fiyat gibi gösterilemez.
5. Birim fiyat yalnızca miktar güvenilir olduğunda hesaplanır.

## 4. Miktar Kuralları

1. Miktar sıfırdan büyük olmalıdır.
2. Pack count sıfırdan büyük tam sayıdır.
3. Total quantity, unit quantity ve pack count ile tutarlı olmalıdır.
4. Parçalı ve toplam paket bilgisi birlikte korunur.
5. Bilinmeyen birim tahmin edilerek canonical birime çevrilmez.

## 5. Tarih Kuralları

1. Bitiş tarihi başlangıçtan önce olamaz.
2. Inferred tarih inference reason taşır.
3. Tarihin ürün, sayfa veya katalog kapsamı belirtilir.
4. Süresi dolmuş offer aktif gösterilemez.

## 6. Sürümleme Kuralları

1. Raw source immutable'dır.
2. Pipeline ve normalization sürümü kayıtla birlikte saklanır.
3. Reprocess eski sonucu silmez.
4. Merge ve split işlemleri geri izlenebilir olmalıdır.
5. Aynı idempotency key aynı aktif sonucu üretmelidir.

## 7. POC Kabul Kuralları

Bir kayıt karşılaştırılabilir kabul edilmek için:

- ürün kimliği yeterli güvene sahip,
- miktar ve birim çözümlenmiş,
- fiyat ve para birimi doğrulanmış,
- geçerlilik bağlamı biliniyor,
- provenance eksiksiz

olmalıdır.
