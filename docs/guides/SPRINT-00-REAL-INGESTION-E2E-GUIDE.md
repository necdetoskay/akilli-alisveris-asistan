# Sprint 00 — Gerçek Broşür Ingestion Uçtan Uca Uygulama Guide

Bu belge kod içermez. Sprint 00'ın hangi sırayla uygulanacağını, her aşamanın hangi çıktıyı üretmesi gerektiğini ve gerçek sistemin nasıl doğrulanacağını anlatır.

## 1. Başlangıç durumu

Kaydedilecekler:

- repository ve branch
- base commit SHA
- çalışma ağacı durumu
- Node.js ve pnpm sürümü
- Docker erişimi
- PostgreSQL erişimi
- storage modu
- mevcut POC testleri
- OpenRouter anahtarının yalnızca environment üzerinden okunması

Sprint başlamadan mevcut POC testleri çalıştırılır ve sonuç kaydedilir.

## 2. Gerçek kaynak analizi

`aktuel-urunler.com` yapısı elle ve otomatik olarak incelenir.

A101 ve BİM için şu öğeler belgelenir:

- kategori URL'si
- katalog kartlarının bulunduğu bölüm
- katalog detay bağlantıları
- detay sayfasındaki içerik alanı
- pagination bağlantıları
- yüksek çözünürlüklü katalog görseli
- başlık ve tarih bilgisi
- aynı katalogdaki toplam sayfa sayısı

Çıktı:

- kaynak yapı raporu
- parser kararları
- fallback sinyalleri
- örnek HTML fixture'ları

## 3. Katalog keşfi

Her market kategori sayfası açılır.

Sistem:

1. katalog adaylarını toplar,
2. market adıyla doğrular,
3. tarihleri çıkarır,
4. aktif ve en yakın yaklaşan katalogları seçer,
5. aynı URL veya aynı başlıktaki tekrarları temizler,
6. brochure kayıtlarını oluşturur.

Başarı kanıtı:

- A101 için seçilen kataloglar
- BİM için seçilen kataloglar
- normalized URL'ler
- tarih kararları

## 4. Katalog sayfası keşfi

Her katalog detay sayfası işlenir.

Sistem:

1. ana içerik alanını bulur,
2. sayfalama bağlantılarını toplar,
3. 1, 2, 3 ... şeklinde sıralar,
4. her sayfadaki katalog görselini bulur,
5. görsel URL'sini normalize eder,
6. page_count_discovered değerini yazar.

Katalog sayfaları arasında atlama varsa ingestion `incomplete` olmalıdır.

Başarı kanıtı:

- her katalog için bulunan sayfa sayısı
- her sayfanın source page URL'si
- her sayfanın source image URL'si
- eksik sayfa kontrolü

## 5. Görsel indirme ve SOT

Her katalog görseli stream ile indirilir.

İşlem:

1. HTTP durum doğrulaması
2. content-type doğrulaması
3. boyut limiti
4. SHA-256
5. image metadata
6. duplicate lookup
7. immutable storage write
8. brochure_page ve asset transaction
9. hash read-back doğrulaması

Kaynak site daha sonra görseli silse bile sistemdeki original korunur.

Başarı kanıtı:

- storage object listesi
- page -> asset ilişkileri
- ilk ve son hash eşitliği
- duplicate yazılmadığına dair test

## 6. GPT-4.1 Mini extraction

Her brochure page için 2x2 region üretilir.

Her region:

- kaynak sayfa kimliği
- koordinatlar
- pipeline version
- model
- input/output token
- maliyet
- durum

ile kaydedilir.

Bütün region sonuçları tamamlandığında:

1. JSON schema doğrulanır,
2. boş veya anlamsız ürün adları reddedilir,
3. fiyatı olmayan kayıt review'a gider,
4. duplicate adaylar merge edilir,
5. product_offer kayıtları brochure_page'e bağlanır,
6. extraction run kapanır.

Başarı kanıtı:

- sayfa başına ürün sayısı
- katalog toplam ürün sayısı
- token kullanımı
- USD ve TRY maliyet
- review sayısı
- başarısız region listesi

## 7. PostgreSQL yazımı

Transaction sınırları:

- brochure + discovery metadata
- brochure_page + original asset
- extraction_run + regions
- product_offers
- fetch run summary

Bir sayfanın extraction'ı başarısızsa diğer başarılı sayfalar kaybolmaz; katalog `partial` veya `review_required` olabilir.

## 8. Dashboard

Dashboard gerçek product_offer kayıtlarından beslenir.

Bölümler:

1. Bu Haftanın Fırsatları
2. Yakında Başlayacak İndirimler
3. Süresi Dolmak Üzere Olanlar
4. Son Eklenen Broşürler

Her ürün kartında:

- market
- ürün
- miktar
- fiyat
- tarih
- verification durumu
- broşürü görüntüle

görünür.

Ürüne kesin focus yapılmaz. Bağlantı ilgili brochure veya brochure_page kaynağını açar.

## 9. Manuel yükleme

### Admin

- market seçer,
- dosyayı yükler,
- tarihleri girer veya extraction'a bırakır,
- ingestion doğrudan kuyruğa alınır.

### User

- market tahmini veya seçimi yapar,
- dosyayı yükler,
- submission review_required olur,
- admin onayı sonrası ingestion başlar.

PDF yüklenirse bütün sayfalar ayrıştırılıp ayrı brochure_page olarak saklanır.

## 10. Otomatik kaynak çalışması

“Şimdi Kontrol Et” veya scheduler:

1. source_fetch_run oluşturur,
2. kategori sayfasını indirir,
3. katalogları keşfeder,
4. yeni katalogları seçer,
5. sayfaları keşfeder,
6. görselleri indirir,
7. extraction job'larını kuyruğa alır,
8. sonuç özetini yazar.

Aynı katalog yeniden bulunursa yeni binary veya yeni extraction oluşturulmaz; pipeline version değişmişse yeniden extraction yapılabilir.

## 11. Hata yönetimi

### Retry edilebilir

- timeout
- geçici DNS veya ağ sorunu
- 429 rate limit
- geçici storage hatası
- geçici DB bağlantısı

### Retry edilmez

- unsupported media
- bozuk HTML kuralı
- kalıcı 404
- geçersiz yapılandırma
- şema doğrulama hatası

Parser yapısı değişmişse hata `source_structure_changed` olarak görünür olmalıdır.

## 12. E2E doğrulama sırası

1. altyapıyı başlat
2. health
3. readiness
4. migration
5. source kayıtlarını oluştur
6. A101 category fetch
7. A101 aktif katalog ingestion
8. A101 yaklaşan katalog ingestion
9. BİM category fetch
10. BİM aktif katalog ingestion
11. BİM yaklaşan katalog ingestion
12. page completeness kontrolü
13. extraction
14. ürün DB sorgusu
15. dashboard
16. expiring-soon kontrolü
17. SOT açma
18. aynı source'u tekrar çalıştır
19. duplicate/idempotency kontrolü
20. admin manuel upload
21. user manuel upload
22. uygulamayı yeniden başlat
23. persistence kontrolü

## 13. Çıktı alma standardı

Sprint kanıtları:

- base ve final commit SHA
- migration listesi
- A101 katalog keşif çıktısı
- BİM katalog keşif çıktısı
- katalog başına sayfa sayısı
- storage object listesi
- hash doğrulaması
- extraction run listesi
- ürün sayıları
- review sayıları
- maliyet
- dashboard masaüstü ekran görüntüsü
- dashboard mobil ekran görüntüsü
- SOT ekran görüntüsü
- admin upload sonucu
- user upload sonucu
- duplicate run sonucu
- test sonuçları
- bilinen eksikler

Secret ve API anahtarı kanıtlara alınmaz.

## 14. Sprint kapanış demosu

Sprint ancak şu gerçek demo tamamlandığında kapanır:

- A101 aktif ve yaklaşan katalogları web kaynağından alınır,
- BİM aktif ve yaklaşan katalogları web kaynağından alınır,
- bütün katalog sayfaları saklanır,
- GPT-4.1 Mini ürün çıkarımı tamamlanır,
- ürünler PostgreSQL'e yazılır,
- dashboard gerçek fırsatları gösterir,
- süresi dolmak üzere bölümü gerçek tarihle çalışır,
- kullanıcı kaynak broşürü açar,
- aynı kaynak tekrar çalıştırıldığında kopya oluşmaz,
- admin ve user yükleme akışları çalışır,
- yeniden başlatma sonrası veriler korunur.
