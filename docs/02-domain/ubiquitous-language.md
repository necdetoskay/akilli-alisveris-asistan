# Ubiquitous Language

| Alan | Değer |
|---|---|
| Document ID | DOM-001 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Son Güncelleme | 2026-07-28 |

## Temel Terimler

**Source:** PDF, görsel, web sayfası veya diğer kampanya kaynağı.

**Source Snapshot:** Kaynağın belirli zamanda alınmış, içerik hash'iyle tanımlanan değişmez kopyası.

**Observation:** Bir source snapshot içinden çıkarılan ham ürün ve teklif gözlemi.

**Observed Product:** Kaynakta görüldüğü biçimiyle ürün açıklaması. Kesin canonical ürün değildir.

**Observed Offer:** Kaynakta görülen fiyat, kampanya, tarih ve koşulların ham kaydı.

**Product Family:** Marka ve temel ürün niteliği bakımından aynı aileye ait ürünlerin üst kimliği.

**Product Variant:** Aroma, yağ oranı, içerik, model, renk veya benzeri seçim özelliğiyle ayrılan canonical ürün biçimi.

**Package Configuration:** Tekli, çoklu paket, toplam miktar veya adet bilgisini ifade eden yapı.

**Canonical Product:** Normalize edilmiş, kalıcı kimliğe sahip Product Variant kaydı.

**Offer:** Belirli satıcı, zaman aralığı, fiyat ve koşullara sahip satın alma teklifi.

**Product Identity:** Bir gözlemin hangi canonical ürünü temsil ettiğini belirleme problemi.

**Candidate Match:** Observed Product ile canonical ürün arasında henüz kesinleşmemiş eşleşme adayı.

**Match Decision:** Eşleşmenin kabul, ret veya review sonucudur.

**Identity Confidence:** Ürün kimliği eşleşmesine duyulan güven.

**Field Confidence:** Tek bir çıkarılan alana duyulan güven.

**Provenance:** Domain kaydının hangi source snapshot, sayfa, bölge ve extraction sürümünden üretildiğini gösteren bağ.

**Normalization:** Ham metin ve değerleri standart forma dönüştürme işlemi.

**Deduplication:** Aynı gözlem veya teklifin tekrar kaydedilmesini önleme işlemi.

**Equivalent Quantity:** Farklı paket biçimlerinin ortak temel birime çevrilmiş toplam miktarı.

**Comparable Offer:** Aynı canonical ürün veya açıkça karşılaştırılabilir eşdeğer ürün için normalize edilmiş teklif.

## Yasaklı Eş Anlamlı Kullanım

- `Product` kelimesi hem ham gözlem hem canonical kayıt için kullanılmaz.
- `Campaign` ile `Offer` eş anlamlı kabul edilmez.
- `Variant` ile `Package Configuration` birbirine karıştırılmaz.
- `Confidence` tek sayı olarak kullanılmaz; alan ve kimlik güveni ayrılır.
