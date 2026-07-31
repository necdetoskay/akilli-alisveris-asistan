# Sprint 00 — MVP Vertical Slice Foundation

## Amaç

Bu sprint, POC çalışmalarından ürün geliştirme aşamasına geçiş sprintidir. Hedef; BİM ve A101 için broşür edinme, değiştirilemez kaynak saklama, gerçek veritabanı ile çalışan sade dashboard ve rol bazlı yükleme akışını uçtan uca kurmaktır.

Sprint sonunda:

1. BİM ve A101 sistemde etkin marketlerdir.
2. Yönetici broşür yükleyebilir.
3. Son kullanıcı bulduğu indirim broşürünü yükleyebilir.
4. Belirlenmiş web kaynaklarından otomatik indirme için kaynak ve görev altyapısı hazırdır.
5. Orijinal broşür değişmeden saklanır ve SHA-256 ile doğrulanır.
6. Aynı dosyanın tekrar yüklenmesi tespit edilir.
7. Dashboard gerçek PostgreSQL kayıtlarını gösterir.
8. Kullanıcı kaynak broşürün tamamını görüntüleyebilir.
9. Ürüne otomatik focus ve kesin bounding box sonraki sprintlere bırakılır.

## Ürün kararları

### İlk marketler

- BİM
- A101

Veri modeli yeni market eklenmesine açık olur; ilk arayüzde yalnızca bu ikisi etkin görünür.

### Dashboard bölümleri

- Bu Haftanın Fırsatları
- Yakında Başlayacak İndirimler
- Süresi Dolmak Üzere Olanlar
- Son Eklenen Broşürler

“Süresi Dolmak Üzere Olanlar” varsayılan olarak bitişine 48 saat veya daha az kalan yayınlanmış kayıtları gösterir. Eşik yapılandırılabilir olur.

### Source of Truth

- Orijinal broşür değiştirilemez kaynak kanıttır.
- Model çıktısı ileride broşürden türetilmiş veri olacaktır; kaynak broşürün yerini almaz.
- Orijinal ve işleme için üretilen dosyalar ayrı asset olarak tutulur.
- Bu sprintte kullanıcı broşürün tamamını açar; ürün alanına otomatik yakınlaştırma zorunlu değildir.

### Broşür edinme kanalları

1. Admin upload
2. User upload
3. Web source auto-download

Üç kanal aynı ingestion yaşam döngüsüne bağlanır ve acquisition type metadata olarak saklanır.

## Kapsam

### Uygulama omurgası

- Web uygulaması ve dashboard
- API katmanı
- PostgreSQL
- Storage abstraction
- Job/queue persistence contract
- Environment yönetimi
- Health ve readiness uçları
- Test altyapısı

### Roller

- `admin`: yükleme, source yönetimi, job takibi, yayınlama
- `user`: dashboard, broşür yükleme, kendi submission durumunu görme
- `system`: otomatik source taraması ve indirme işleri

### Çekirdek veri modeli

#### retailers

- id
- slug
- name
- is_active
- created_at
- updated_at

Seed: `bim`, `a101`.

#### brochure_sources

- id
- retailer_id
- source_type: admin_upload | user_upload | web_source
- name
- source_url
- is_enabled
- schedule_hint
- last_success_at
- last_error_at
- created_at
- updated_at

#### brochures

- id
- retailer_id
- source_id
- acquisition_type
- title
- campaign_name
- publication_date
- valid_from
- valid_until
- status
- uploaded_by_user_id
- source_url
- original_asset_id
- created_at
- updated_at
- archived_at

Durumlar:

- received
- duplicate
- stored
- queued
- processing
- extracted
- review_required
- published
- failed
- archived

#### brochure_assets

- id
- brochure_id
- asset_type: original | normalized | page | preview
- storage_provider
- storage_key
- original_filename
- media_type
- byte_size
- sha256
- width
- height
- created_at

`original` asset immutable olmalıdır.

#### upload_submissions

- id
- submitted_by_user_id
- submitted_role
- retailer_hint
- original_filename
- status
- brochure_id
- rejection_reason
- created_at
- updated_at

#### ingestion_jobs

- id
- brochure_id
- job_type: download | store_original | normalize | extract | publish
- status
- idempotency_key
- attempt_count
- queued_at
- started_at
- finished_at
- error_code
- error_message
- created_at
- updated_at

#### source_fetch_runs

- id
- source_id
- started_at
- finished_at
- status
- discovered_count
- downloaded_count
- duplicate_count
- error_message

### Storage standardı

Yerel geliştirme: local filesystem veya MinIO.

Üretim: S3 uyumlu object storage.

Önerilen anahtar:

`brochures/{retailer_slug}/{year}/{month}/{brochure_id}/original/{asset_id}.{ext}`

Kurallar:

- original üzerine yazılmaz,
- hash eşleşirse binary tekrar saklanmaz,
- duplicate submission olayı yine kaydedilir,
- public writable bucket kullanılmaz,
- erişim uygulama katmanından yapılır.

### Dashboard

Üst alanda:

- uygulama adı
- BİM/A101 filtresi
- arama alanı için yer
- Broşür Yükle butonu

Kartlar ilk sprintte broşür düzeyinde olabilir. Ürün extraction bağlandığında aynı bölümler ürün tekliflerini gösterecek şekilde genişletilir.

Broşür kartı:

- market
- kampanya adı
- geçerlilik tarihleri
- kaynak türü
- preview
- durum
- Broşürü Görüntüle

### Dashboard iş kuralları

#### Bu hafta aktif

- status = published
- valid_from boş veya now’dan önce
- valid_until boş veya now’dan sonra

#### Yakında başlayacak

- status = published
- valid_from now’dan sonra
- valid_from varsayılan 7 günlük pencere içinde

#### Süresi dolmak üzere

- status = published
- valid_until now’dan sonra
- valid_until now + 48 saatten önce

#### Son eklenen

- acquisition/created time azalan sıralama

Tarihler DB’de timezone-aware tutulur, kullanıcıya Türkiye saat diliminde gösterilir.

### Upload akışı

1. Dosya ve form doğrulanır.
2. Submission oluşturulur.
3. Dosya stream üzerinden alınır.
4. SHA-256 hesaplanır.
5. Media type ve boyut doğrulanır.
6. Duplicate aranır.
7. Unique ise immutable original asset yazılır.
8. Brochure ve asset ilişkisi transaction ile tamamlanır.
9. Preview/normalize işi kuyruğa eklenir.
10. Takip kimliği ve durum döndürülür.

İlk dosya türleri:

- PNG
- JPEG
- WEBP
- PDF

PDF çok sayfalıysa orijinali mutlaka saklanır; sayfa ayrıştırma sonraki sprintte tamamlanabilir.

### Otomatik web source temeli

Admin BİM ve A101 için web source kaydı oluşturabilir ve “Şimdi Kontrol Et” diyebilir.

Bu sprintte tam scraper zorunlu değildir. Adaptör yoksa kontrollü `not_implemented` sonucu üretilir; run ve job kayıtları görünür kalır.

Standart keşif çıktısı gelecekte şunları üretir:

- discovered_url
- media_url
- retailer
- title
- publication_date
- valid_from
- valid_until
- fingerprint_hint

### Idempotency ve retry

Idempotency anahtarları:

- binary: SHA-256
- web keşfi: source_id + discovered_url
- iş: brochure_id + job_type + pipeline_version

Retry edilebilir: timeout, rate limit, geçici storage/DB kesintisi.

Retry edilmez: desteklenmeyen dosya, kalıcı yetki hatası, bozuk yapılandırma.

### Gözlemlenebilirlik

Her işte loglanır:

- correlation id
- brochure id
- job id
- source type
- start/end
- result
- error code
- byte size
- hash
- storage key

Secret, API anahtarı ve binary içerik loglanmaz.

## Sprint dışında

- GPT-4.1 Mini production extraction entegrasyonu
- ürün tablolarının final tasarımı
- ürün kartlarının final dashboard’u
- ürün bounding box/focus
- fiyat karşılaştırma ve geçmiş
- favoriler, bildirimler, mobil uygulama
- tamamlanmış BİM/A101 scraper’ları

## E2E başarı senaryoları

### Admin BİM upload

Admin BİM PNG yükler; hash alınır, original saklanır, brochure `stored` olur, dashboard Son Eklenenler’de görünür ve kaynak açılır.

### User A101 upload

User A101 görseli yükler; submission oluşur, original saklanır, kayıt `review_required` olur, user kendi durumunu görür, admin daha sonra yayınlayabilir.

### Duplicate

Aynı binary tekrar yüklenir; yeni binary yazılmaz, duplicate submission kaydedilir ve mevcut broşüre yönlendirilir.

### Expiring soon

Bitişine 30 saat kalan yayınlanmış kayıt “Süresi Dolmak Üzere Olanlar” bölümünde kalan süre etiketiyle görünür; süre dolunca çıkar.

### Web source run

Admin source üzerinde “Şimdi Kontrol Et” der; fetch run ve job oluşur, durum yönetim ekranında görünür, adaptör yoksa kontrollü sonuç döner.

## Kabul kriterleri

- BİM ve A101 seed kayıtları mevcut.
- Admin ve user upload çalışıyor.
- PNG/JPEG/WEBP/PDF kabul kuralları uygulanıyor.
- Original kalıcı ve immutable saklanıyor.
- SHA-256 duplicate detection çalışıyor.
- Dashboard PostgreSQL’den besleniyor.
- Dört dashboard bölümü çalışıyor.
- Expiring soon gerçek tarih hesabı kullanıyor.
- Broşür kartından original SOT açılıyor.
- Web source ve fetch run kaydı oluşturulabiliyor.
- Health/readiness DB ve storage durumunu raporluyor.
- Hatalı ingestion görünür ve izlenebilir.
- Arşivleme kaynak binary’yi silmiyor.

## Test planı

Birim:

- hash
- media validation
- storage key
- duplicate kararları
- tarih bölümleri
- remaining-time etiketi
- rol izinleri
- status transitions

Entegrasyon:

- migration
- storage write/read
- upload submission
- brochure+asset transaction
- duplicate upload
- queue job
- dashboard queries
- source fetch run

E2E:

- admin BİM upload
- user A101 upload
- duplicate
- dashboard
- SOT görüntüleme
- expiring soon
- yetkisiz admin erişimi
- DB/storage failure

## Sprint çıktıları

1. Çalışan uygulama iskeleti
2. Migration’lar
3. Storage adapter
4. BİM/A101 seed
5. Upload API ve ekranı
6. Broşür liste/detail ekranı
7. Dashboard V1
8. Queue/job persistence
9. Web source management temeli
10. Testler
11. E2E guide
12. Sprint doğrulama raporu

## Definition of Done

- temiz ortam kurulumu yapılabiliyor,
- sıfır DB migration geçiyor,
- BİM/A101 seed geliyor,
- admin BİM ve user A101 yüklemeleri çalışıyor,
- original asset açılabiliyor,
- duplicate binary üretilmiyor,
- dashboard gerçek DB verisi gösteriyor,
- expiring soon çalışıyor,
- yeniden başlatma sonrası veri kaybolmuyor,
- guide başka biri tarafından uygulanabiliyor,
- bilinen eksikler belgeleniyor.
