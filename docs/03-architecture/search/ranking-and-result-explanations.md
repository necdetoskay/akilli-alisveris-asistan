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
