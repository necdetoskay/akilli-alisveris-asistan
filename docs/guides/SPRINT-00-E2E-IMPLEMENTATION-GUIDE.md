# Sprint 00 — Uçtan Uca Uygulama ve Çıktı Alma Guide

Bu belge kod içermez. Sprintin hangi sırada uygulanacağını, her aşamanın beklenen çıktısını ve doğrulama kanıtlarını tarif eder.

## 1. Başlangıç kontrolü

Kaydedilecekler:

- repository ve branch
- clean/dirty çalışma ağacı
- Node.js ve pnpm sürümü
- Docker erişimi
- PostgreSQL erişimi
- storage modu
- işletim sistemi ve portlar
- mevcut POC komutlarının durumu

Çıktı: ortam kontrol raporu.

## 2. Mevcut repo analizi

Önce var olan migration, DB tabloları, package scripts, POC dosyaları ve test düzeni incelenir. Çalışan yapılar silinmez; sprint mevcut konvansiyonları genişletir.

Çıktı:

- mevcut mimari özeti
- gap listesi
- korunacak dosyalar
- migration stratejisi

## 3. Mimari sınırlar

Sorumluluklar:

- web/dashboard
- API
- application/domain services
- persistence
- object storage
- queue/jobs
- source adapters
- observability

Dashboard doğrudan dosya sistemine veya bucket’a erişmez. Kaynak dosya yetkili uygulama katmanından sunulur.

Çıktı: modül sınırları ve bağımlılık yönleri.

## 4. PostgreSQL hazırlığı

- ileri yönlü migration
- foreign key ve unique constraint
- timezone-aware timestamps
- retailer slug unique
- asset SHA-256 index
- job idempotency unique
- soft archive
- kontrollü status değerleri

Doğrulama:

1. sıfır DB’de migration
2. mevcut DB üzerinde upgrade
3. BİM/A101 seed
4. schema inspection

## 5. Storage hazırlığı

1. örnek PNG yazılır,
2. metadata okunur,
3. original overwrite engellenir,
4. dosya uygulama üzerinden okunur,
5. hash tekrar hesaplanır,
6. hash eşitliği doğrulanır.

Çıktı: storage health, object key ve hash kanıtı.

## 6. Roller ve erişim

Admin, user ve system izin matrisi hazırlanır.

Olumsuz testler:

- user admin source yönetimine giremez,
- user başka kullanıcının private submission’ını göremez,
- anonim kullanıcı upload yapamaz (ürün kararına göre),
- storage URL’si yazma yetkisi vermez.

## 7. Upload ingestion

İşlem sırası:

1. form validation
2. submission
3. temp/stream receive
4. hash
5. media/size validation
6. duplicate lookup
7. immutable original write
8. brochure+asset transaction
9. preview/normalize job
10. accepted response ve tracking id

Hatalar:

- unsupported media
- oversized file
- storage unavailable
- DB transaction failure
- duplicate
- unreadable image metadata
- encrypted/corrupt PDF

Her hata anlaşılır kullanıcı mesajı ve izlenebilir error code üretir.

## 8. Broşür detail ve SOT

Detail ekranı:

- market
- kampanya
- tarihler
- source type
- submitter
- ingestion status
- original metadata
- preview
- original açma
- job timeline

Original değişmez; preview ayrı asset’tir. Bu sprintte ürün focus yoktur.

## 9. Dashboard sorguları

Aktif, upcoming, expiring-soon ve recent sorguları ayrı servisler/kurallar olarak uygulanır.

UTC hesaplanır; Türkiye saat diliminde gösterilir.

Test fixture’ları:

- aktif
- yarın başlayan
- 30 saat sonra biten
- bugün biten
- bitmiş
- tarihsiz
- unpublished

Çıktı: DB-backed dashboard ve sınır zamanı testleri.

## 10. Otomatik source temeli

BİM ve A101 source kayıtları oluşturulur.

“Şimdi Kontrol Et”:

1. source enabled kontrolü
2. fetch run
3. queue job
4. adapter registry
5. adapter yoksa not_implemented
6. run kapanışı
7. admin görünümü

Scraper bu sprintte tamamlanmak zorunda değildir.

## 11. Queue davranışı

Her iş:

- id
- idempotency key
- attempt/max attempts
- scheduled time
- timeout
- result/error

Başarılı, retry ve permanent-failure senaryoları test edilir.

## 12. Dashboard kullanıcı deneyimi

Masaüstü sırası:

1. başlık, filtreler, upload
2. Bu Haftanın Fırsatları
3. Yakında Başlayacak
4. Süresi Dolmak Üzere
5. Son Eklenen Broşürler

Kartlar gerçek DB’den gelir. Mobil görünüm tek kolon veya yatay scroll olabilir.

Çıktı:

- desktop screenshot
- mobile screenshot
- BİM filtresi
- A101 filtresi
- empty state
- upload action

## 13. E2E doğrulama sırası

1. altyapı başlat
2. health
3. readiness
4. migration
5. seed
6. admin BİM upload
7. user A101 upload
8. duplicate BİM upload
9. dashboard
10. market filtreleri
11. expiring fixture
12. brochure detail/SOT
13. source oluştur
14. source check run
15. job sonucu
16. uygulamayı yeniden başlat
17. persistence kontrolü

## 14. Çıktı alma standardı

Sprint kanıtları:

- commit SHA
- migration listesi
- test sonucu
- health/readiness
- BİM/A101 seed sorgusu
- storage object listesi
- SHA-256 doğrulaması
- admin upload sonucu
- user upload sonucu
- duplicate sonucu
- dashboard ekran görüntüsü
- detail ekran görüntüsü
- source fetch run sonucu
- bilinen eksikler

Secret içeren çıktı alınmaz.

## 15. Hata ve geri dönüş

Migration hatasında readiness false olur; veri silinmez.

Storage hatasında brochure publish edilmez; orphan asset bırakılmaz; job retry olur.

Dashboard sorgu hatasında tüm sayfa çökmez; kontrollü hata ve correlation id gösterilir.

## 16. Sprint kapanış demosu

Sprint ancak şu demo tamamlanırsa kapanır:

- admin BİM yükler,
- user A101 yükler,
- original dosyalar kalıcıdır,
- duplicate tespit edilir,
- dashboard gerçek kayıt gösterir,
- expiring soon çalışır,
- kaynak broşür açılır,
- source run oluşturulur,
- restart sonrası veri kaybolmaz.
