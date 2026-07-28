# Ürün Sınırları ve Kapsam İlkeleri

| Alan | Değer |
|---|---|
| Document ID | PRD-004 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | PRD-001, PRD-002 |
| Son Güncelleme | 2026-07-28 |

## 1. Üç Ayrı Kapsam

Proje boyunca aşağıdaki kavramlar karıştırılmayacaktır.

### Ürün Vizyonu

Uzun vadede ulaşılmak istenen bütün yetenekler.

### POC

En yüksek riskli veri toplama ve normalizasyon varsayımını doğrulayan sınırlı çalışma.

### MVP

POC sonucuna göre tanımlanacak, son kullanıcıya anlamlı uçtan uca değer sunan ilk ürün.

## 2. POC Kapsam Kuralı

Bir özellik POC'a ancak şu soruya olumlu cevap veriyorsa alınır:

> Bu özellik kampanya verisini güvenilir biçimde çıkarma, normalize etme, doğrulama veya karşılaştırma riskini doğrudan test ediyor mu?

Olumsuzsa özellik backlog'a taşınır.

## 3. POC İçinde

- PDF katalog alma
- katalog görsellerini işleme
- seçili kampanya web sayfalarını işleme
- ürün kartı tespiti
- ürün adı, marka, miktar, birim ve fiyat çıkarımı
- kampanya tarihlerini ilişkilendirme
- ham kaynak kaydı
- confidence üretimi
- normalizasyon
- doğrulama ve manuel düzeltme
- idempotent yeniden işleme
- temel karşılaştırılabilir çıktı

## 4. POC Dışında

- aile alışveriş listeleri
- kişisel öneri motoru
- sağlık ve içerik analizi
- resmî risk kayıtları entegrasyonu
- ev envanteri
- mobil uygulama
- gelişmiş fiyat tahmini
- tam çok ajanlı sistem
- satıcı puanlama
- bildirim ve alarm ürünü
- raf veya koridor konumu

## 5. Kalıcı Kapsam Dışı

Aşağıdaki özellik, veri güvenilirliği nedeniyle ürün vizyonunda da kapsam dışıdır:

- market içi raf veya koridor konumu

Yeni kalıcı kapsam dışı kararlar ADR ile kaydedilir.

## 6. Backlog Kuralı

Yeni fikirler reddedilmiş sayılmaz.

Her fikir:

- başlık,
- kullanıcı değeri,
- POC ile ilişkisi,
- bağımlılıklar,
- değerlendirme zamanı

ile backlog'a kaydedilir.

Ancak backlog kaydı aktif kapsam anlamına gelmez.

## 7. Kapsam Değişikliği

Design Freeze sonrasında kapsam değişikliği için:

1. gerekçe,
2. kullanıcı veya teknik değer,
3. maliyet ve risk,
4. mevcut başarı ölçütlerine etkisi,
5. kabul veya ret kararı

belgelenir.

## Kararlar

- POC, MVP değildir.
- Ürün vizyonu POC kapsamını otomatik olarak genişletmez.
- POC dışı fikirler uygulamaya değil backlog'a gider.
