# Product Identity Model

| Alan | Değer |
|---|---|
| Document ID | DOM-002 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | DOM-001 |
| Son Güncelleme | 2026-07-28 |

## 1. Problem

Aşağıdaki kayıtlar aynı ürünü ifade edebilir:

- `Sütaş Süt 1 L`
- `Sütaş Tam Yağlı Süt 1000 ml`
- `SÜTAŞ UHT SÜT TAM YAĞLI 1LT`

Ancak aşağıdakiler aynı ürün sayılmamalıdır:

- Sütaş Tam Yağlı Süt 1 L
- Sütaş Yarım Yağlı Süt 1 L
- Sütaş Laktozsuz Süt 1 L
- Sütaş Süt 4 × 250 ml

Benzer metin eşit kimlik anlamına gelmez.

## 2. Kimlik Katmanları

### 2.1. Product Family

Temel tüketici ürün ailesi.

Örnek:

```text
Brand: Sütaş
Base Product: İçme Sütü
```

### 2.2. Product Variant

Satın alma seçimini değiştiren nitelikler.

Örnek:

```text
Fat Level: Tam Yağlı
Processing: UHT
Lactose: Normal
Flavor: Sade
```

### 2.3. Package Configuration

Satılan fiziksel paket.

Örnek:

```text
Unit Size: 1 L
Pack Count: 1
Total Quantity: 1 L
Container: Karton
```

Canonical karşılaştırmada varyant ve paket birlikte dikkate alınır.

## 3. Kimlik Sinyalleri

Öncelik sırası bağlama göre değişebilir, ancak tipik sinyaller:

1. GTIN / barkod
2. marka
3. normalize ürün türü
4. varyant özellikleri
5. toplam miktar
6. paket adedi
7. üretici ürün kodu
8. kaynak görsel benzerliği
9. metinsel benzerlik
10. kategori bağlamı

Barkod güçlü sinyaldir ancak tek başına her zaman mevcut değildir.

## 4. Kimlik Kararı

Bir gözlem için olası sonuçlar:

- `EXACT_MATCH`
- `PROBABLE_MATCH`
- `AMBIGUOUS`
- `NO_MATCH`
- `NEW_CANONICAL_CANDIDATE`

## 5. Kesin Eşleşme

Aşağıdakilerden biri yeterli kanıt sağlayabilir:

- aynı doğrulanmış GTIN,
- aynı üretici kodu ve uyumlu varyant/paket,
- daha önce insan tarafından onaylanmış source-specific alias.

Çelişkili varyant veya miktar bilgisi varsa otomatik exact match yapılmaz.

## 6. Benzerlik Eşleşmesi

Barkod yoksa eşleşme bileşik skorla yapılır.

Önerilen özellik grupları:

- brand similarity
- base product similarity
- variant compatibility
- quantity compatibility
- package compatibility
- category compatibility
- text similarity

Skor tek başına karar değildir; hard conflict kuralları önce uygulanır.

## 7. Hard Conflicts

Aşağıdakiler eşleşmeyi engelleyebilir:

- farklı doğrulanmış barkod,
- uyumsuz varyant,
- farklı ürün türü,
- anlamlı miktar farkı,
- farklı paket sayısı,
- farklı model veya seri,
- karşılıklı dışlayan özellikler.

## 8. Kimlik Geçmişi

Canonical ürünler birleştirilebilir veya ayrılabilir.

Her işlem:

- önceki kimlikleri,
- yeni kimliği,
- gerekçeyi,
- reviewer'ı,
- tarihi,
- etkilenen teklifleri

audit trail ile saklar.

## 9. POC Sınırı

POC'ta amaç evrensel ürün kataloğu kurmak değildir.

Amaç:

- gözlem ile canonical kayıt ayrımını kanıtlamak,
- basit kimlik adayları üretmek,
- belirsiz eşleşmeleri review'e göndermek,
- yanlış kesin eşleşmeyi önlemektir.
