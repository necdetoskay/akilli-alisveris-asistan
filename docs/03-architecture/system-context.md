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
