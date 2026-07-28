# Test Veri Seti Standardı

| Alan | Değer |
|---|---|
| Document ID | POC-002 |
| Sürüm | 1.0 |
| Durum | Taslak |
| Bağımlılıklar | POC-001 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

POC sonuçlarının kolay örneklerle yanıltıcı biçimde yüksek görünmesini önlemek için test veri setinin kapsamını ve etiketleme kurallarını tanımlar.

## 2. Veri Seti Katmanları

### Katman A — Geliştirme Seti

Pipeline geliştirme sırasında kullanılabilir. Son başarı ölçümünde tek başına kullanılamaz.

### Katman B — Doğrulama Seti

Prompt, model ve kuralların ayarlanmasında kullanılır.

### Katman C — Kör Test Seti

Nihai POC değerlendirmesine kadar pipeline ayarlamak için kullanılmaz.

## 3. Kaynak Çeşitliliği

Test seti en az şu çeşitleri içermelidir:

- metin tabanlı PDF
- taranmış PDF
- tek sayfalık kampanya görseli
- çok ürünlü katalog sayfası
- seçili web kampanya sayfası
- düşük çözünürlüklü örnek
- yoğun ve karmaşık tasarım
- farklı kampanya tarih yerleşimleri

## 4. Zorluk Sınıfları

### Kolay

- ürün kartları belirgin,
- yüksek çözünürlük,
- fiyat ürünün yanında,
- metin net.

### Orta

- benzer ürünler yan yana,
- ortak kampanya metni,
- farklı yazı boyutları,
- karmaşık paket bilgisi.

### Zor

- fiyat ve ürün görseli uzak,
- ortak tarih veya dipnot,
- düşük kontrast,
- çapraz yerleşim,
- küçük yazı,
- birden fazla kampanya koşulu.

## 5. Minimum İlk POC Seti

İlk çalışma için önerilen minimum:

- en az 5 farklı kaynak şablonu,
- en az 20 sayfa veya eşdeğer görsel,
- en az 150 gerçek ürün kartı,
- kolay, orta ve zor örneklerin birlikte bulunması,
- en az 2 farklı kaynak tipi.

Bu sayı başlangıç standardıdır; uygulanabilirliğe göre Decision Log ile değiştirilebilir.

## 6. Ground Truth Alanları

Her ürün kartı için mümkün olduğunda:

- source_id
- page_number veya visual_region
- product_name_raw
- brand_raw
- variant_raw
- quantity_value
- quantity_unit
- package_count
- regular_price
- campaign_price
- currency
- campaign_start
- campaign_end
- campaign_condition
- expected_card_boundary
- annotator_note

## 7. Etiketleme Kuralları

- Görselde olmayan bilgi tahmin edilmez.
- Okunamayan alan `unknown` olarak işaretlenir.
- Birden fazla yorum mümkünse belirsizlik notu eklenir.
- Kampanya tarihi sayfa geneline aitse kapsam açıkça yazılır.
- Fiyatın hangi ürüne ait olduğu kesin değilse zorla eşleştirilmez.
- Ham metin ve normalize değer ayrı tutulur.

## 8. Veri Sızıntısı Kontrolü

Kör test setindeki örnekler:

- prompt örneği olarak kullanılmaz,
- normalization kuralı üretmek için incelenmez,
- model seçiminde doğrudan optimize edilmez.

## 9. Sürümleme

Her veri seti sürümü aşağıdakileri taşır:

- dataset_version
- oluşturma tarihi
- kaynak listesi
- etiketleyici
- değişiklik özeti
- lisans ve kullanım notu
