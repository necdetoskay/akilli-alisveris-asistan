# Sprint 00 — Gerçek Broşür Ingestion Vertical Slice

## 1. Amaç

Bu sprint, POC çalışmalarından gerçek ürün geliştirme aşamasına geçiş sprintidir.

Hedef; BİM ve A101 için gerçek broşürlerin web üzerinden keşfedilmesi, bütün katalog sayfalarının indirilmesi, orijinal görsellerin değiştirilemez kaynak olarak saklanması, GPT-4.1 Mini ile ürün çıkarımı yapılması ve dashboard üzerinde gerçek kayıtların gösterilmesidir.

Bu sprintte seed veya sabit demo verisi kullanılmayacaktır.

Sprint sonunda çalışan zincir:

`web kaynağı -> katalog keşfi -> katalog sayfaları -> immutable storage -> GPT-4.1 Mini extraction -> PostgreSQL -> dashboard`

## 2. Temel ürün kararları

### 2.1 İlk marketler

- BİM
- A101

Veri modeli yeni marketlerin daha sonra eklenmesine açık tutulur. İlk sürümde yalnızca bu iki market aktif edilir.

### 2.2 İlk keşif kaynağı

İlk web adaptörü:

- `https://aktuel-urunler.com/`

Bu site ilk sürümde katalog keşif ve içerik kaynağıdır. Marketlerin resmi kaynağı olduğu varsayılmaz.

Her katalog ve ürün kaydında şu ayrım tutulur:

- `discovery_source`: kataloğun bulunduğu üçüncü taraf kaynak
- `content_source`: katalog yazısı ve görsel URL'leri
- `retailer`: BİM veya A101
- `verification_status`: extracted, reviewed, retailer_verified

İlk sürümde otomatik çıkarılan kayıtlar `extracted` seviyesinde yayınlanabilir. Resmî market kanallarından doğrulama daha sonraki sprintte eklenir.

### 2.3 Broşür ve broşür sayfası ayrımı

Bir katalog tek `brochure` kaydıdır.

Katalog altında bulunan her görsel veya sayfa ayrı `brochure_page` kaydıdır.

Örnek:

`A101 30 Temmuz 2026 -> brochure`
`1, 2, 3 ... 11 -> brochure_page`

Her görsel ayrı broşür olarak kaydedilmez.

### 2.4 Source of Truth

Orijinal katalog sayfası görseli değiştirilemez kaynak kanıttır.

Model çıktısı kaynak değildir; kaynaktan türetilmiş yapılandırılmış kayıttır.

Bu sprintte kullanıcı broşürün tamamını veya ilgili sayfasını açabilir. Ürün alanına kesin otomatik odaklama zorunlu değildir.

### 2.5 Dashboard bölümleri

- Bu Haftanın Fırsatları
- Yakında Başlayacak İndirimler
- Süresi Dolmak Üzere Olanlar
- Son Eklenen Broşürler

“Süresi Dolmak Üzere Olanlar” varsayılan olarak bitişine 48 saat veya daha az kalan teklifleri gösterir. Eşik yapılandırılabilir olmalıdır.

## 3. Sprint kabul demosu

Sprint kapanışında en az şu gerçek senaryo çalışmalıdır:

### A101

- şu anda devam eden en güncel katalog keşfedilir,
- başlayacak en yakın katalog keşfedilir,
- her iki katalogdaki bütün sayfalar bulunur,
- bütün görseller indirilir,
- bütün görseller SOT olarak saklanır,
- ürünler GPT-4.1 Mini ile çıkarılır,
- kayıtlar PostgreSQL'e yazılır,
- dashboard üzerinde aktif ve yaklaşan bölümlerde görünür.

### BİM

- aynı dönemdeki aktif ve yaklaşan BİM katalogları keşfedilir,
- her katalog bağımsız kampanya olarak kaydedilir,
- katalogların bütün sayfaları işlenir,
- ürünler dashboard üzerinde doğru zaman bölümünde gösterilir.

## 4. Kapsam

### 4.1 Web kaynak adaptörü

`aktuel-urunler.com` için adaptör şu katmanlara sahip olmalıdır:

1. market kategori sayfası keşfi
2. katalog kartı ve bağlantı keşfi
3. katalog detay sayfası ayrıştırma
4. sayfalama bağlantılarının keşfi
5. katalog görsel URL'lerinin keşfi
6. tarih ve başlık çıkarımı
7. duplicate ve eksik sayfa kontrolü

Adaptör yalnızca tek bir CSS selector'a bağımlı olmamalıdır.

Kullanılacak sinyaller:

- bağlantı URL yapısı
- başlık metni
- market adı
- katalog tarihi
- içerik alanı
- pagination bağlantıları
- yüksek çözünürlüklü görsel URL'leri

### 4.2 Gerçek katalog seçimi

İlk çalışmada her market için:

- halen geçerli en güncel katalog
- başlayacak en yakın katalog

işlenir.

Aynı tarihte birden fazla bağımsız kampanya varsa bunlar ayrı brochure kayıtlarıdır.

### 4.3 Veri modeli

#### retailers

- id
- slug
- name
- is_active
- created_at
- updated_at

İlk kayıtlar migration veya sistem bootstrap işlemiyle oluşturulur; demo seed verisi kullanılmaz.

#### brochure_sources

- id
- retailer_id
- source_type
- name
- base_url
- category_url
- is_enabled
- parser_version
- last_success_at
- last_error_at
- created_at
- updated_at

#### brochures

- id
- retailer_id
- source_id
- discovery_source_url
- content_source_url
- title
- campaign_name
- publication_date
- valid_from
- valid_until
- verification_status
- ingestion_status
- page_count_discovered
- page_count_downloaded
- extraction_status
- created_at
- updated_at
- archived_at

#### brochure_pages

- id
- brochure_id
- page_number
- source_page_url
- source_image_url
- original_asset_id
- sha256
- width
- height
- download_status
- extraction_status
- created_at
- updated_at

#### brochure_assets

- id
- brochure_id
- brochure_page_id
- asset_type
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

#### extraction_runs

- id
- brochure_id
- model_provider
- model_name
- pipeline_version
- status
- input_tokens
- output_tokens
- cost_usd
- cost_try
- started_at
- finished_at
- error_code
- error_message

#### extraction_regions

- id
- extraction_run_id
- brochure_page_id
- region_key
- left_px
- top_px
- width_px
- height_px
- result_asset_id
- created_at

#### product_offers

- id
- retailer_id
- brochure_id
- brochure_page_id
- extraction_run_id
- source_region_id
- product_name
- brand
- category
- variant
- quantity_value
- quantity_unit
- current_price
- previous_price
- currency
- valid_from
- valid_until
- confidence
- needs_review
- verification_status
- created_at
- updated_at
- archived_at

#### ingestion_jobs

- id
- source_id
- brochure_id
- brochure_page_id
- job_type
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
- status
- started_at
- finished_at
- discovered_brochure_count
- discovered_page_count
- downloaded_page_count
- duplicate_page_count
- extracted_product_count
- total_cost_usd
- total_cost_try
- error_message

### 4.4 Storage

Yerel geliştirme:

- local filesystem veya MinIO

Üretim:

- S3 uyumlu object storage

Önerilen anahtar:

`brochures/{retailer_slug}/{year}/{month}/{brochure_id}/pages/{page_number}/{asset_id}.{ext}`

Kurallar:

- original üzerine yazılmaz,
- SHA-256 eşleşen binary tekrar saklanmaz,
- duplicate olay yine kaydedilir,
- storage başarısızsa extraction başlamaz,
- kaynak görsel sonradan erişilemez olsa bile SOT sistemde kalır.

### 4.5 GPT-4.1 Mini extraction

Varsayılan model:

- `openai/gpt-4.1-mini`
- OpenRouter üzerinden

Yöntem:

- her broşür sayfası 2x2 bölgesel olarak işlenir,
- region sonuçları birleştirilir,
- duplicate ürün adayları temizlenir,
- fiyatı veya ürün adı okunamayan kayıtlar review durumuna alınır,
- maliyet ve token kullanımı extraction run üzerinde saklanır.

Detection-first bounding-box yaklaşımı kullanılmaz.

### 4.6 Dashboard

Ürün kartında:

- ürün adı
- marka
- miktar
- güncel fiyat
- eski fiyat varsa eski fiyat
- market
- geçerlilik tarihi
- verification status
- broşürü görüntüle

bulunur.

İlk sürümde “Broşürü Görüntüle” ilgili brochure veya brochure page kaynağını açar; ürüne kesin focus yapmaz.

### 4.7 Manuel yükleme

Admin ve kullanıcı:

- PNG
- JPEG
- WEBP
- PDF

yükleyebilir.

Admin yüklemesi doğrudan ingestion kuyruğuna alınabilir.

Kullanıcı yüklemesi review gerektiren submission olarak kaydedilir; admin onayı sonrası extraction çalıştırılır.

### 4.8 Otomatik çalışma

Kaynak kontrolü:

- zamanlanabilir
- manuel “Şimdi Kontrol Et” ile başlatılabilir
- idempotent olmalıdır

Her çalışmada:

- bulunan katalog sayısı
- bulunan sayfa sayısı
- indirilen sayfa sayısı
- duplicate sayfa sayısı
- çıkarılan ürün sayısı
- toplam maliyet
- hata listesi

kaydedilir.

## 5. Dashboard iş kuralları

### Bu hafta aktif

- verification_status en az extracted
- valid_from boş veya şimdi başlamış
- valid_until boş veya henüz bitmemiş

### Yakında başlayacak

- valid_from şimdi sonrasında
- varsayılan 7 günlük pencere içinde

### Süresi dolmak üzere

- valid_until şimdi sonrasında
- valid_until şimdi + 48 saatten önce

### Son eklenen

- gerçek ingestion zamanına göre azalan

Tarihler DB'de UTC tutulur, kullanıcıya Türkiye saat diliminde gösterilir.

## 6. Idempotency

- brochure keşfi: source_id + normalized content URL
- page keşfi: brochure_id + page_number + normalized image URL
- binary: SHA-256
- extraction: brochure_page_id + pipeline_version + model
- publish: product_offer_id + revision

Aynı katalog tekrar bulunduğunda yeni kopya oluşturulmaz; yeni fetch run sonucu mevcut kayda bağlanır.

## 7. Kabul kriterleri

- Seed ürün veya katalog kullanılmaz.
- BİM ve A101 gerçek web kaynağından keşfedilir.
- Her market için aktif ve en yakın yaklaşan katalog bulunur.
- Katalogların bütün pagination sayfaları keşfedilir.
- Bütün katalog görselleri indirilir.
- Orijinal görseller immutable SOT olarak saklanır.
- Eksik sayfa varsa katalog tamamlanmış sayılmaz.
- GPT-4.1 Mini 2x2 extraction çalışır.
- Ürünler brochure ve brochure_page ile ilişkilidir.
- Extraction maliyeti kaydedilir.
- Dashboard gerçek PostgreSQL kayıtlarını gösterir.
- Active, upcoming, expiring-soon ve recent bölümleri çalışır.
- Kullanıcı kaynak broşürü açabilir.
- Admin ve user manuel upload yapabilir.
- Duplicate binary tekrar saklanmaz.
- Source fetch run ve ingestion job geçmişi görünürdür.
- Web kaynağındaki kontrollü parser hatası tüm sistemi çökertmez.
- Mevcut POC scriptleri ve fixture'ları bozulmaz.

## 8. Test planı

### Unit

- URL normalizasyonu
- market katalog bağlantısı tanıma
- tarih çıkarımı
- pagination sıralama
- image URL seçimi
- SHA-256
- duplicate kararları
- 2x2 region üretimi
- ürün merge ve dedupe
- dashboard zaman bölümleri
- verification status geçişleri

### Integration

- gerçek HTML fixture parsing
- katalog detay ve pagination keşfi
- image download
- immutable storage
- PostgreSQL migration
- brochure-page transaction
- extraction run persistence
- product offer persistence
- dashboard queries
- manuel upload

### E2E

- A101 aktif katalog ingestion
- A101 yaklaşan katalog ingestion
- BİM aktif katalog ingestion
- BİM yaklaşan katalog ingestion
- bütün sayfaların tamlık kontrolü
- duplicate fetch
- extraction
- dashboard
- source brochure görüntüleme
- user upload review
- admin upload
- restart sonrası persistence

### Edge

- pagination bağlantısı eksik
- aynı görsel iki sayfada
- bozuk image URL
- geçici network hatası
- katalog başlığı tarih içermiyor
- valid_until bulunamıyor
- HTML yapısı değişmiş
- extraction bir region'da başarısız
- OpenRouter rate limit
- storage kesintisi

### Regression

- mevcut POC benchmark komutları
- GPT-4.1 Mini schema
- mevcut migration'lar
- mevcut evaluator
- package scripts

## 9. Sprint çıktıları

1. Gerçek A101 adaptörü
2. Gerçek BİM adaptörü
3. Katalog ve sayfa keşfi
4. Tam sayfa indirme
5. Immutable storage
6. PostgreSQL migration'ları
7. GPT-4.1 Mini extraction entegrasyonu
8. Product offer persistence
9. Dashboard V1
10. Manuel admin ve user upload
11. Source ve job yönetim ekranı
12. Unit, integration ve E2E testleri
13. Uçtan uca uygulama guide'ı
14. Ürün tanıtım dokümanı
15. Test evidence çıktıları

## 10. Sprint dışında

- resmî market kanalı doğrulaması
- ürün alanına kesin focus/bounding box
- kullanıcı favorileri
- fiyat alarmı
- sepet optimizasyonu
- mobil uygulama
- tüm marketleri destekleme
- mağaza bazlı stok garantisi
- fiyatın bütün şubelerde geçerli olduğunu iddia etme

## 11. Definition of Done

- temiz ortam kurulumu tamamlanır,
- migration sıfır ve mevcut DB üzerinde geçer,
- A101 aktif ve yaklaşan katalogları gerçek kaynaktan alınır,
- BİM aktif ve yaklaşan katalogları gerçek kaynaktan alınır,
- bütün katalog sayfaları tam olarak saklanır,
- hash tekrar doğrulanır,
- extraction tamamlanır,
- ürünler dashboard'da gerçek veriden görünür,
- active/upcoming/expiring bölümleri doğru çalışır,
- SOT broşür sayfası açılır,
- manuel yükleme akışları çalışır,
- testler geçer,
- bilinen sınırlamalar belgelenir,
- ürün tanıtım dokümanındaki ifadeler gerçek sistem davranışıyla uyumludur.
