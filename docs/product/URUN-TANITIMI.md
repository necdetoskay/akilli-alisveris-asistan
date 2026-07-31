# Akıllı Alışveriş Asistanı

## Ürün nedir?

Akıllı Alışveriş Asistanı, marketlerin yayımladığı indirim broşürlerini tek yerde toplamayı ve bu broşürlerdeki ürün tekliflerini aranabilir, filtrelenebilir ve tarih bilgisiyle birlikte görüntülenebilir hale getirmeyi amaçlayan bir yazılım sistemidir.

İlk sürüm BİM ve A101 kataloglarına odaklanır.

Sistem, belirlenmiş web kaynaklarında yayımlanan katalogları keşfeder, katalog sayfalarını indirir, görselleri kalıcı olarak saklar ve yapay zekâ destekli görsel analiz ile ürün adı, miktar ve fiyat gibi bilgileri yapılandırılmış kayıtlara dönüştürür.

## Kullanıcı ne görür?

Dashboard üzerinde:

- bu hafta geçerli fırsatlar,
- yakında başlayacak indirimler,
- süresi dolmak üzere olan teklifler,
- son eklenen broşürler,
- BİM ve A101 filtreleri,
- ürün ve fiyat bilgileri

görüntülenir.

Kullanıcı, bir kaydın dayandığı broşür veya broşür sayfasını açarak bilgiyi kaynağından kontrol edebilir.

İlk sürümde sistem ürünün bulunduğu alana otomatik olarak yakınlaştırmak zorunda değildir; ilgili broşür sayfasını gösterir.

## Broşürler nasıl alınır?

Sistem üç yoldan broşür alabilir:

1. Tanımlanmış web kaynaklarından otomatik keşif ve indirme
2. Yönetici tarafından manuel yükleme
3. Kullanıcı tarafından gönderilen broşür görseli veya PDF

Kullanıcı yüklemeleri gerektiğinde yönetici incelemesine alınır.

## Yapay zekâ ne yapar?

Yapay zekâ modeli broşür görsellerini inceler ve ürün kayıtları üretmeye çalışır.

Çıkarılabilecek alanlar:

- ürün adı
- marka
- ürün türü veya kategori
- miktar
- güncel fiyat
- varsa önceki fiyat
- geçerlilik tarihleri
- güven ve inceleme durumu

Model çıktıları hatasız kabul edilmez. Okunamayan, eksik veya şüpheli kayıtlar inceleme gerektirebilir.

## Kaynak ve doğrulama yaklaşımı

Orijinal broşür görseli sistemde değiştirilemez kaynak kanıt olarak saklanır.

Yapılandırılmış ürün kaydı, bu görselden türetilmiş veridir.

İlk sürümde üçüncü taraf katalog kaynaklarından alınan ve model tarafından çıkarılan kayıtlar `extracted` seviyesinde gösterilir.

Daha sonraki sürümlerde:

- yönetici incelemesi,
- kullanıcı bildirimi,
- marketlerin resmî kanallarından doğrulama

eklenebilir.

Sistem, yalnızca üçüncü taraf bir kaynaktan alınmış veriyi “market tarafından doğrulandı” olarak göstermez.

## Hedef kullanıcılar

- haftalık market indirimlerini takip eden tüketiciler,
- farklı katalogları tek tek incelemek istemeyen kullanıcılar,
- yaklaşan kampanyaları önceden görmek isteyenler,
- fırsat içerikleri hazırlayan yayıncılar,
- katalog ve fiyat verisini düzenli takip etmek isteyen işletmeler

için kullanılabilir.

## Yönetici özellikleri

Yönetici:

- broşür yükleyebilir,
- otomatik katalog kaynaklarını yönetebilir,
- ingestion işlemlerini izleyebilir,
- başarısız işleri tekrar çalıştırabilir,
- inceleme gerektiren ürünleri görebilir,
- kaynak broşürü açabilir,
- gerekli kayıt düzeltmelerini yapabilir.

## Sistem neyi garanti etmez?

Akıllı Alışveriş Asistanı:

- ürünün her mağazada stokta olduğunu garanti etmez,
- fiyatın bütün şubelerde aynı olduğunu garanti etmez,
- broşürdeki bilginin sonradan değişmeyeceğini garanti etmez,
- yapay zekâ çıkarımının her zaman hatasız olduğunu iddia etmez,
- üçüncü taraf kaynak verisini resmî market doğrulaması gibi sunmaz,
- kullanıcı adına satın alma yapmaz.

Fiyat, stok, tarih ve kampanya koşulları gerektiğinde ilgili marketin resmî kanallarından kontrol edilmelidir.

## Sağladığı değer

Sistem şu işleri kolaylaştırmayı hedefler:

- dağınık katalogları tek yerde toplamak,
- broşür sayfalarını tek tek arama ihtiyacını azaltmak,
- aktif ve yaklaşan indirimleri zamanına göre ayırmak,
- süresi bitmek üzere olan fırsatları görünür kılmak,
- ürün tekliflerini aranabilir veri haline getirmek,
- kaydın dayandığı broşüre geri dönmeyi sağlamak.

## İlk sürüm kapsamı

İlk sürümde:

- BİM ve A101,
- gerçek katalog keşfi,
- katalog sayfalarının saklanması,
- GPT-4.1 Mini ile ürün çıkarımı,
- gerçek PostgreSQL kayıtları,
- dashboard,
- kaynak broşür görüntüleme,
- yönetici ve kullanıcı yüklemesi

yer alır.

## Sonraki geliştirme alanları

- resmî kaynak doğrulaması,
- ürün alanına hassas odaklama,
- favoriler,
- fiyat alarmı,
- fiyat geçmişi,
- marketler arası karşılaştırma,
- alışveriş listesi,
- daha fazla market,
- mobil uygulama

gelecek sürümlerde değerlendirilebilir.

## Ticari kullanım için konumlandırma

Ürün, katalog toplama ve yapılandırılmış fırsat verisi üretme altyapısı olarak sunulabilir.

Dağıtım veya satış sırasında müşteriye açıkça belirtilmesi gerekenler:

- desteklenen marketler,
- katalogların hangi kaynaklardan alındığı,
- otomatik çıkarımın doğruluk sınırları,
- hangi özelliklerin mevcut olduğu,
- hangi özelliklerin planlandığı,
- storage ve barındırma sorumlulukları,
- üçüncü taraf kaynaklara bağlı çalışma riskleri,
- resmî market doğrulamasının bulunup bulunmadığı.

Tanıtım metinleri yalnızca çalışan ve doğrulanmış özellikleri anlatmalıdır.
