# Uçtan Uca Veri Akışı

**Belge Kodu:** ARCH-003
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Ana akış

1. Kaynak kataloğu taranacak hedefi tanımlar.
2. Orchestrator benzersiz bir ingestion görevi oluşturur.
3. Fetcher sayfayı veya veri uç noktasını edinir.
4. Ham içerik ve edinme metadatası gözlem deposuna yazılır.
5. Parser, kaynak biçimini gözlemlenen alanlara dönüştürür.
6. Şema ve temel kalite kontrolleri çalışır.
7. Normalization engine standart değerleri üretir.
8. Identity resolution mevcut kanonik kayıtlarla eşleşme arar.
9. Sonuç güven seviyesine göre otomatik kabul, yeni aday veya inceleme kuyruğuna gider.
10. Offer service teklif durumunu günceller.
11. Price history service yeni fiyat gözlemini değerlendirir.
12. Okuma modeli ve arama indeksi güncellenir.
13. Takip kuralları değerlendirilir.
14. Gerekliyse bildirim olayı üretilir.

## 2. Veri akışındaki kayıt türleri

- `FetchAttempt`: edinme denemesi ve teknik sonucu.
- `RawObservation`: değiştirilemez ham kanıt.
- `ParsedObservation`: parser çıktısı.
- `NormalizedObservation`: standartlaştırılmış alanlar.
- `IdentityDecision`: eşleşme kararı ve gerekçesi.
- `OfferObservation`: belirli zamandaki teklif görünümü.
- `PricePoint`: doğrulanmış fiyat zaman noktası.
- `DomainEvent`: sonraki modüllere duyurulan iş olayı.

## 3. Başarısızlık akışları

Parser hatası ham gözlemi silmez. Hatalı kayıt parser sürümü ve hata sınıfıyla karantinaya alınır. Yeni parser sürümü yayımlandığında aynı ham gözlem tekrar işlenebilir.

Kimlik çözümleme belirsizse sistem rastgele ürün seçmez. `review_required` kararı oluşturur ve teklif, kanonik kataloğu kirletmeden geçici gözlem durumunda tutulur.

Fiyat doğrulaması başarısızsa değer geçmişe eklenmez; ancak kanıt ve hata nedeni saklanır.

## 4. Senkron ve asenkron sınır

Kullanıcı sorguları senkron okuma akışıdır. Scraping, parsing, normalizasyon, eşleştirme, indeks güncelleme ve bildirim değerlendirmesi asenkron iş hattı olarak tasarlanır. Böylece dış kaynak yavaşlığı kullanıcı isteklerine taşınmaz.
