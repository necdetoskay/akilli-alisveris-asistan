# Başarı Ölçüm Standardı

| Alan | Değer |
|---|---|
| Document ID | POC-004 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | POC-002, POC-003 |
| Son Güncelleme | 2026-07-28 |

## 1. Ölçüm Birimleri

Başarı tek bir toplam puanla değerlendirilmez.

Ayrı ölçümler:

- ürün kartı tespiti,
- alan extraction doğruluğu,
- alan ilişkilendirme doğruluğu,
- normalizasyon doğruluğu,
- provenance bütünlüğü,
- review yükü,
- idempotency,
- işlem süresi ve maliyet.

## 2. Ürün Kartı Tespiti

Önerilen metrikler:

- precision
- recall
- F1
- kaçırılan kart sayısı
- yanlış pozitif kart sayısı

Başlangıç hedefi:

- F1 en az `%85`

## 3. Alan Bazlı Doğruluk

Her alan ayrı raporlanır:

- product_name
- brand
- quantity_value
- quantity_unit
- regular_price
- campaign_price
- campaign_start
- campaign_end
- campaign_condition

Başlangıç hedefleri:

- fiyat doğruluğu en az `%95`
- gramaj/adet doğruluğu en az `%85`
- tarih ilişkilendirmesi kritik hata içermemeli

## 4. Kritik ve Kritik Olmayan Hata

### Kritik

- yanlış fiyat,
- fiyatın yanlış ürüne bağlanması,
- yanlış kampanya tarihi,
- kaynağın kaybolması,
- yanlış para birimi.

### Kritik Olmayan

- marka yazım varyasyonu,
- eksik varyant,
- biçimsel normalizasyon farkı,
- opsiyonel açıklama eksikliği.

Kritik hatalar toplam doğruluk içinde gizlenmez; ayrı raporlanır.

## 5. Confidence Kalibrasyonu

Confidence yalnızca gösterim amacıyla kullanılmaz.

Ölçülecek sorular:

- düşük confidence gerçekten daha çok hata içeriyor mu,
- yüksek confidence kayıtlarında kritik hata var mı,
- review eşiği hangi noktada en iyi dengeyi sağlıyor.

## 6. Review Metrikleri

- review'e giden kayıt oranı
- corrected oranı
- rejected oranı
- ortalama review süresi
- 100 ürün başına toplam manuel dakika

## 7. Idempotency Metrikleri

Aynı kaynak ve pipeline sürümüyle tekrar işlemde:

- yeni mükerrer kayıt sayısı: `0`
- değişen sonuç sayısı: `0` veya açıklanmış nondeterminism
- aynı source fingerprint korunmalı

## 8. Operasyonel Metrikler

- kaynak başına işlem süresi
- sayfa başına işlem süresi
- ürün başına maliyet
- hata nedeniyle yeniden deneme sayısı
- kaynak adaptasyon süresi

Maliyet Türk lirası cinsinden raporlanabilir; kullanılan model ve servis fiyatı ayrıca kaydedilir.

## 9. Raporlama

Her test koşusu aşağıdakileri üretir:

- run_id
- dataset_version
- pipeline_version
- model ve prompt sürümleri
- alan bazlı metrikler
- kritik hata listesi
- review metrikleri
- maliyet ve süre
- önceki koşuyla fark

## 10. Kabul Kuralı

POC yalnızca toplam ortalama hedefi geçtiği için başarılı sayılmaz.

Aşağıdakilerin birlikte sağlanması gerekir:

- kritik fiyat doğruluğu,
- provenance bütünlüğü,
- idempotency,
- kabul edilebilir review yükü,
- gerçek kaynak çeşitliliğinde tutarlı sonuç.
