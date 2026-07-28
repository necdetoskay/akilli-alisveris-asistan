# Cilt 05 — Sistem Mimarisi

**Akıllı Alışveriş Asistanı Engineering Handbook**
**Sürüm:** 1.0


---

<!-- SOURCE: docs/03-architecture/README.md -->

# Sistem Mimarisi Temeli

**Belge Kodu:** ARCH-000
**Sürüm:** 1.0
**Durum:** Onaylandı

Bu bölüm, Akıllı Alışveriş Asistanı'nın ilk uygulanabilir mimarisini tanımlar. Amaç, mağaza sayfalarından alınan ham verinin güvenilir, tekrar işlenebilir ve gözlemlenebilir bir hat üzerinden kanonik ürün, teklif, fiyat geçmişi ve kullanıcıya sunulan öneriye dönüşmesini sağlamaktır.

## Belgeler

1. [Sistem bağlamı](system-context.md)
2. [Bileşenler ve sorumluluklar](components-and-responsibilities.md)
3. [Uçtan uca veri akışı](end-to-end-data-flow.md)
4. [Servis sınırları ve modüler monolit](service-boundaries-and-modular-monolith.md)
5. [Scraping, normalizasyon ve eşleştirme hattı](scraping-normalization-matching-pipeline.md)
6. [Veri sahipliği ve depolama ilkeleri](data-ownership-and-storage.md)
7. [Güvenilirlik, idempotency ve yeniden işleme](reliability-idempotency-and-reprocessing.md)
8. [Gözlemlenebilirlik ve operasyon](observability-and-operations.md)
9. [ADR-0003: Modüler monolit yaklaşımı](adr/ADR-0003-modular-monolith.md)
10. [ADR-0004: Asenkron iş hattı ve outbox](adr/ADR-0004-async-pipeline-and-outbox.md)

## Mimari hedefler

- Ham veriyi kaybetmeden işleyebilmek.
- Aynı gözlemi güvenle tekrar işleyebilmek.
- Ürün kimliği ile mağaza teklifini birbirinden ayırmak.
- Belirsiz eşleşmeleri sessizce kesinleştirmemek.
- Her fiyatın kaynağını ve zamanını izleyebilmek.
- POC ile üretim mimarisi arasında gereksiz yeniden yazımı azaltmak.
- İlk aşamada operasyonel karmaşıklığı düşük tutmak.

## Mimari olmayan hedefler

Bu paket; kesin bulut sağlayıcısı, kesin mesaj kuyruğu ürünü, tam fiziksel PostgreSQL şeması, kullanıcı arayüzü bileşenleri ve ölçekleme eşiklerini belirlemez. Bunlar sonraki paketlerde, ölçülen POC sonuçlarına göre kesinleştirilecektir.

---

<!-- SOURCE: docs/03-architecture/system-context.md -->

# Sistem Bağlamı

**Belge Kodu:** ARCH-001
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Sistem amacı

Akıllı Alışveriş Asistanı; farklı mağazalardaki ürünleri ve kampanyaları gözlemler, ham veriyi normalize eder, aynı gerçek ürüne ait teklifleri ilişkilendirir, fiyat geçmişini tutar ve kullanıcıya açıklanabilir karşılaştırmalar sunar.

Sistem bir arama motorunun kopyası değildir. Temel sorumluluğu, dağınık ve tutarsız ticari veriyi güvenilir bir karar desteğine dönüştürmektir.

## 2. Dış aktörler

### Kullanıcı

- Ürün arar veya takip listesi oluşturur.
- Fiyat, satıcı, kampanya ve ürün özelliklerini karşılaştırır.
- Belirli koşullar gerçekleştiğinde bildirim alır.
- Sistemin neden belirli teklifleri aynı ürün altında topladığını görebilir.

### Yönetici / veri operatörü

- Veri kaynaklarının sağlık durumunu izler.
- Düşük güvenli eşleşmeleri inceler.
- Hatalı normalizasyon kurallarını düzeltir.
- Yeniden işleme veya karantina işlemleri başlatır.

### Mağaza ve pazar yerleri

- Ürün sayfası, listeleme, fiyat, kampanya, stok ve satıcı verisinin dış kaynağıdır.
- Veri biçimleri güvenilir veya kararlı kabul edilmez.

### Bildirim sağlayıcıları

- E-posta, mobil bildirim veya ileride eklenebilecek mesaj kanallarıdır.
- Ana iş kurallarının sahibi değildir.

### LLM / AI sağlayıcıları

- Belirsiz metinleri yorumlama, özellik çıkarma veya kullanıcı açıklaması üretme amacıyla yardımcı olabilir.
- Kanonik ürün kimliği için tek ve nihai karar mercii değildir.

## 3. Sistem sınırı

Sistem sınırının içinde şu yetenekler bulunur:

- kaynak konfigürasyonu,
- sayfa edinme ve parsing,
- ham gözlem arşivi,
- normalizasyon,
- ürün kimliği çözümleme,
- teklif ve kampanya yönetimi,
- fiyat geçmişi,
- arama ve karşılaştırma,
- takip kuralları,
- bildirim kararı,
- operasyon ve inceleme araçları.

Ödeme, sipariş tamamlama, mağaza adına stok yönetme ve finansal işlem yürütme sistem sınırının dışındadır.

## 4. Temel güven sınırları

Dış kaynak verisi doğrulanmamış kabul edilir. Bir mağaza sayfasındaki başlık, stok, indirim oranı veya eski fiyat alanı doğrudan gerçek kabul edilmez. Her değer kaynak, gözlem zamanı, parser sürümü ve mümkünse kanıt alanıyla birlikte saklanır.

AI çıktısı da doğrulanmamış öneri kabul edilir. Deterministik kurallar, domain invariants ve güven skoru ile kontrol edilmeden kalıcı kanonik veriye dönüştürülmez.

---

<!-- SOURCE: docs/03-architecture/components-and-responsibilities.md -->

# Bileşenler ve Sorumluluklar

**Belge Kodu:** ARCH-002
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Kaynak kataloğu

Mağaza, alan adı, tarama politikası, desteklenen sayfa türleri, hız sınırı, parser sürümü ve kaynak güven seviyesini yönetir.

## 2. Ingestion orchestrator

Tarama görevlerini planlar, tekrarları engeller, kaynak limitlerini uygular ve görev durumunu izler. Parser mantığını içermez.

## 3. Fetcher / scraper adapter

HTTP veya tarayıcı tabanlı edinmeyi gerçekleştirir. Çıktısı ham sayfa, yanıt metadatası ve edinme kanıtıdır. Domain ürünü üretmez.

## 4. Parser

Kaynağa özgü HTML veya JSON yapısından gözlemlenen ürün alanlarını çıkarır. Çıktı `Observed Product` ve `Observed Offer` adaylarıdır.

## 5. Raw observation store

Ham içerik, hash, edinme zamanı, kaynak URL, parser sürümü ve hata bilgisini değiştirilemez gözlem olarak saklar. Yeniden işleme için ana kanıttır.

## 6. Normalization engine

Başlık, marka, model, kapasite, renk, ölçü, para birimi, satıcı ve kampanya ifadelerini standart biçime dönüştürür. Kaynak değerini silmez; normalize edilmiş değer ayrı tutulur.

## 7. Identity resolution engine

Gözlemlenen ürünü mevcut kanonik ürün ve varyantlarla karşılaştırır. Kesin eşleşme, olası eşleşme, yeni ürün adayı veya inceleme gerekli sonucu üretir.

## 8. Offer service

Mağaza, satıcı, ürün varyantı, fiyat, stok, kargo ve kampanya koşullarını bir teklif olarak yönetir. Teklifin zaman içindeki gözlemlerini korur.

## 9. Price history service

Geçerli fiyat gözlemlerini zaman serisine dönüştürür. Anormal sıçrama, eski fiyat manipülasyonu ve para birimi uyumsuzluğu gibi kontrolleri uygular.

## 10. Catalog query service

Kanonik ürünleri, varyantları, teklifleri ve fiyat geçmişini kullanıcı sorgularına uygun okuma modellerinde sunar.

## 11. Watch and notification service

Kullanıcının fiyat, stok, satıcı veya kampanya koşullarını değerlendirir. Bildirim gönderimini sağlayıcı adaptörlerinden ayırır.

## 12. Review console

Düşük güvenli eşleşmeleri, parser hatalarını ve karantinaya alınan gözlemleri insan incelemesine sunar. Operatör kararları denetlenebilir biçimde kaydedilir.

---

<!-- SOURCE: docs/03-architecture/end-to-end-data-flow.md -->

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

---

<!-- SOURCE: docs/03-architecture/service-boundaries-and-modular-monolith.md -->

# Servis Sınırları ve Modüler Monolit

**Belge Kodu:** ARCH-004
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Başlangıç yaklaşımı

İlk üretim sürümü modüler monolit olarak geliştirilir. Modüller tek deploy edilebilir uygulama içinde bulunabilir; ancak kod, veri sahipliği ve olay sözleşmeleri açısından açık sınırlar taşır.

Bu karar, POC aşamasında mikroservis operasyon maliyetinden kaçınırken ileride ölçülen ihtiyaçlara göre bağımsızlaştırma imkânını korur.

## 2. Önerilen modüller

- `source-catalog`
- `ingestion`
- `observation`
- `normalization`
- `identity-resolution`
- `catalog`
- `offer`
- `pricing`
- `search`
- `watchlist`
- `notification`
- `review-operations`

## 3. Sınır kuralları

Bir modül başka modülün tablolarına doğrudan yazamaz. Değişiklikler modülün uygulama servisi veya tanımlı domain olayı üzerinden yapılır.

Ortak klasör, domain nesnelerinin kontrolsüz paylaşım alanı olamaz. Ortak kod yalnızca gerçekten teknik ve kararlı yapı taşlarını içerir.

Modüller arası sözleşmeler sürümlenebilir DTO veya olay şemalarıyla ifade edilir. İç domain modeli dışarı sızdırılmaz.

## 4. Ayrıştırma adayları

Aşağıdaki koşullar oluşursa bir modül bağımsız servise dönüştürülebilir:

- farklı ölçekleme profili,
- ayrı hata izolasyonu ihtiyacı,
- bağımsız yayın gereksinimi,
- farklı güvenlik sınırı,
- yoğun hesaplama veya tarayıcı iş yükü,
- farklı ekip sahipliği.

İlk güçlü adaylar ingestion workers, browser pool, arama indeksi ve bildirim gönderimidir.

## 5. Monorepo sınırı

Kod deposu monorepo olabilir. Monorepo, modül sınırlarının olmadığı anlamına gelmez. Paket bağımlılıkları lint ve architecture tests ile denetlenmelidir.

---

<!-- SOURCE: docs/03-architecture/scraping-normalization-matching-pipeline.md -->

# Scraping, Normalizasyon ve Eşleştirme Hattı

**Belge Kodu:** ARCH-005
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Aşama 1 — Keşif ve edinme

URL keşfi kaynak haritaları, kategori sayfaları, arama sonuçları veya önceden bilinen ürün URL'lerinden yapılabilir. Her URL normalize edilerek aynı hedefin gereksiz tekrarları azaltılır.

Fetcher; zaman aşımı, yönlendirme, robots/politika kararı, yanıt kodu, içerik türü ve içerik hash'ini kaydeder.

## 2. Aşama 2 — Parsing

Parser kaynağa özgüdür. Çıktısı en az şu alanları taşımalıdır:

- kaynak ürün kimliği,
- başlık,
- marka ve model adayları,
- varyant özellikleri,
- güncel fiyat,
- eski fiyat iddiası,
- para birimi,
- stok durumu,
- satıcı,
- kampanya metni,
- canonical URL,
- alan bazlı kanıt veya selector bilgisi.

## 3. Aşama 3 — Kalite kapısı

Eksik fiyat, anlamsız para birimi, geçersiz URL veya boş ürün başlığı gibi sorunlar sınıflandırılır. Her hata kalıcı başarısızlık değildir; bazıları yeniden deneme, bazıları parser güncellemesi, bazıları insan incelemesi gerektirir.

## 4. Aşama 4 — Normalizasyon

Normalizasyon deterministik kurallarla başlar:

- Unicode ve boşluk temizliği,
- marka sözlüğü,
- birim dönüşümleri,
- model token ayrıştırma,
- renk ve kapasite eş anlamlıları,
- satıcı adı standardizasyonu,
- fiyat ve para biçimi çözümleme.

AI destekli çıkarım kullanılırsa kaynak metin, model sürümü, prompt sürümü ve güven skoru saklanır.

## 5. Aşama 5 — Aday üretimi

Tüm katalogla pahalı karşılaştırma yapmak yerine marka, kategori, model tokenları, GTIN/EAN, üretici kodu ve belirleyici özelliklerle aday kümesi üretilir.

## 6. Aşama 6 — Skorlama ve karar

Eşleştirme skoru tek sayıdan ibaret olmamalıdır. Marka, model, varyant, kapasite, renk, GTIN ve kategori uyumları ayrı özellikler olarak kaydedilir. Nihai karar gerekçesi denetlenebilir olmalıdır.

Örnek kararlar:

- `exact_match`
- `probable_match`
- `new_variant_candidate`
- `new_product_candidate`
- `review_required`
- `rejected`

## 7. Aşama 7 — Teklif ve fiyat güncelleme

Kanonik kimlik kararı oluştuktan sonra teklif güncellenir. Aynı gözlem tekrar geldiğinde yeni kopya üretmek yerine idempotent güncelleme yapılır. Fiyat noktası yalnızca anlamlı değişiklik veya yeni gözlem politikası gerektiriyorsa eklenir.

---

<!-- SOURCE: docs/03-architecture/data-ownership-and-storage.md -->

# Veri Sahipliği ve Depolama İlkeleri

**Belge Kodu:** ARCH-006
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Ana veri deposu

İlişkisel ve denetlenebilir domain verisi için PostgreSQL varsayılan ana depodur. Kanonik ürün, varyant, teklif, fiyat noktası, eşleşme kararı, kullanıcı takip kuralı ve operasyon kaydı burada tutulur.

## 2. Ham gözlem deposu

Büyük HTML/JSON gövdeleri nesne depolama veya sıkıştırılmış dosya deposunda tutulabilir. PostgreSQL içinde kaynak, hash, zaman, parser sürümü ve nesne adresi saklanır.

## 3. Arama indeksi

Arama motoru veya vektör indeksi, kanonik gerçeğin sahibi değildir. Yeniden üretilebilir bir okuma modelidir. İndeks kaybı domain verisi kaybı sayılmaz.

## 4. Cache

Cache yalnızca performans optimizasyonudur. Fiyatın, kampanyanın veya kimlik kararının tek kalıcı kaynağı olamaz.

## 5. Modül sahipliği

- Observation modülü ham ve parse edilmiş gözlemlerin sahibidir.
- Catalog modülü kanonik ürün ve varyantların sahibidir.
- Offer modülü satıcı ve teklif durumunun sahibidir.
- Pricing modülü fiyat noktaları ve fiyat analizinin sahibidir.
- Watchlist modülü kullanıcı koşullarının sahibidir.

## 6. Veri yaşam döngüsü

Ham gözlemler yeniden işleme ve denetim ihtiyacına göre saklanır. Kişisel veriler minimum düzeyde tutulur ve ayrı yaşam döngüsü politikasına tabi olur. Teknik loglar domain kayıtlarının yerine geçmez.

## 7. Şema değişiklikleri

Şema değişiklikleri migration ile yapılır. Geriye dönük uyumluluk gerektiren olay ve DTO değişiklikleri sürümlenir. Büyük veri dönüşümleri tek migration içinde uzun kilit oluşturmamalı; kontrollü backfill görevleriyle yürütülmelidir.

---

<!-- SOURCE: docs/03-architecture/reliability-idempotency-and-reprocessing.md -->

# Güvenilirlik, Idempotency ve Yeniden İşleme

**Belge Kodu:** ARCH-007
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Teslimat varsayımı

Asenkron işlerin en az bir kez teslim edilebileceği varsayılır. Bu nedenle tüketiciler aynı mesajı birden fazla kez güvenle işleyebilmelidir.

## 2. Idempotency anahtarları

Örnek anahtarlar:

- fetch: `source + normalized_url + schedule_window`
- observation: `source + content_hash`
- parse: `observation_id + parser_version`
- normalize: `parsed_observation_id + rule_set_version`
- identity decision: `normalized_observation_id + matcher_version`
- price point: `offer_id + observed_at + amount + currency`
- notification: `watch_rule_id + triggering_fact_id`

## 3. Retry politikası

Geçici ağ hataları sınırlı exponential backoff ile tekrar edilir. Parser şema hatası körlemesine tekrar edilmez. Yetki, robots veya kalıcı 404 gibi durumlar ayrı sınıfa alınır.

## 4. Dead-letter ve karantina

Maksimum denemeyi aşan teknik işler dead-letter kuyruğuna; veri kalitesi veya kimlik belirsizliği taşıyan kayıtlar inceleme karantinasına gider. Bu iki kavram birbirine karıştırılmaz.

## 5. Yeniden işleme

Ham gözlemler immutable olduğu için yeni parser, normalizasyon kuralı veya matcher sürümüyle tekrar işlenebilir. Yeniden işleme, mevcut doğru veriyi kontrolsüz biçimde ezmemeli; karar sürümleri karşılaştırılmalıdır.

## 6. Outbox

Domain verisi ile yayımlanacak olay aynı veritabanı işlemi içinde kaydedilir. Ayrı publisher, outbox kayıtlarını olay altyapısına taşır. Böylece veri commit olup olayın kaybolması riski azaltılır.

## 7. Tutarlılık modeli

Katalog ve teklif güncellemeleri bazı okuma modellerine gecikmeli yansıyabilir. Kullanıcı arayüzü kritik yerlerde gözlem zamanı ve son güncelleme zamanını göstermelidir.

---

<!-- SOURCE: docs/03-architecture/observability-and-operations.md -->

# Gözlemlenebilirlik ve Operasyon

**Belge Kodu:** ARCH-008
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Temel sinyaller

Sistem log, metric ve trace üretmelidir. Her ingestion akışı correlation ID ile fetch, parse, normalize, match ve persistence adımlarında izlenebilmelidir.

## 2. Önerilen metrikler

- kaynak bazında fetch başarı oranı,
- HTTP durum dağılımı,
- parser başarı oranı,
- boş veya geçersiz alan oranı,
- otomatik eşleşme oranı,
- review_required oranı,
- yanlış pozitif eşleşme oranı,
- pipeline gecikmesi,
- kuyruk derinliği ve en eski mesaj yaşı,
- fiyat anomali oranı,
- bildirim teslim başarı oranı.

## 3. Sağlık seviyeleri

- **Healthy:** normal eşikler içinde.
- **Degraded:** veri akışı sürüyor ancak kalite veya gecikme bozulmuş.
- **Paused:** kaynak politikası veya koruma mekanizması nedeniyle durdurulmuş.
- **Broken:** parser veya edinme tamamen başarısız.

## 4. Operasyon ekranları

Operatör; kaynak sağlığı, son başarılı gözlem, parser sürümü, hata örnekleri, karantina kayıtları ve yeniden işleme durumunu görebilmelidir.

## 5. Alarm ilkeleri

Tekil hata için alarm üretmek yerine oran, süre ve etki alanı dikkate alınır. Örneğin bir mağazada parser başarı oranının belirli süre boyunca anlamlı biçimde düşmesi alarm nedenidir.

## 6. Denetim izi

İnsan tarafından yapılan eşleştirme, ayırma, marka düzeltme veya yeniden işleme kararları kullanıcı, zaman, önceki değer, yeni değer ve gerekçeyle saklanır.

## 7. Veri kalite raporu

Her kaynak için günlük veya çalıştırma bazlı kalite özeti üretilebilir. Bu rapor POC başarı ölçütleriyle aynı kavramları kullanmalı ve zaman içinde karşılaştırılabilir olmalıdır.

---

<!-- SOURCE: docs/03-architecture/adr/README.md -->

# Mimari Karar Kayıtları

Bu klasör sistem mimarisine ilişkin kalıcı kararları içerir.

- [ADR-0003 — Modüler monolit](ADR-0003-modular-monolith.md)
- [ADR-0004 — Asenkron pipeline ve transactional outbox](ADR-0004-async-pipeline-and-outbox.md)

---

<!-- SOURCE: docs/03-architecture/adr/ADR-0003-modular-monolith.md -->

# ADR-0003 — Başlangıçta Modüler Monolit Kullanılması

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Sistem ingestion, normalizasyon, kimlik çözümleme, katalog, teklif, fiyat ve bildirim gibi farklı iş alanlarına sahiptir. Buna rağmen POC sonrasında gerçek trafik, ekip büyüklüğü ve bağımsız ölçekleme ihtiyacı henüz ölçülmemiştir.

## Karar

İlk üretim mimarisi, açık modül sınırlarına sahip modüler monolit olacaktır. Asenkron worker süreçleri aynı kod tabanından ayrı çalıştırılabilir; ancak her domain için baştan mikroservis kurulmayacaktır.

## Gerekçe

- Daha düşük operasyon maliyeti.
- Daha kolay yerel geliştirme ve transaction yönetimi.
- Domain sınırlarını öğrenirken hızlı değişim.
- Gereksiz ağ sözleşmeleri ve dağıtık hata modlarından kaçınma.

## Sonuçlar

Modül bağımlılıkları mimari testlerle korunmalıdır. Başka modülün veri tablolarına doğrudan yazmak yasaktır. Ölçülen ihtiyaç oluştuğunda ingestion, arama veya bildirim gibi modüller ayrıştırılabilir.

---

<!-- SOURCE: docs/03-architecture/adr/ADR-0004-async-pipeline-and-outbox.md -->

# ADR-0004 — Asenkron Pipeline ve Transactional Outbox

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Scraping dış sistemlere bağlı, yavaş ve hata üretebilen bir süreçtir. Parsing, normalizasyon, eşleştirme ve indeksleme adımlarının kullanıcı isteklerine bağlı çalışması gecikme ve güvenilirlik sorunları oluşturur.

Ayrıca veritabanına yazılan bir değişiklik ile sonraki adıma gönderilecek olayın birlikte güvence altına alınması gerekir.

## Karar

Ingestion pipeline asenkron işler halinde yürütülecek ve teslimat modeli en az bir kez olarak kabul edilecektir. Domain değişiklikleriyle yayımlanacak olaylar aynı transaction içinde outbox tablosuna yazılacaktır.

## Sonuçlar

Tüm tüketiciler idempotent tasarlanmalıdır. Outbox publisher ve başarısız iş yönetimi gerekir. Okuma modellerinde kısa süreli eventual consistency kabul edilir.
