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
