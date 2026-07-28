# Başarı Çerçevesi

| Alan | Değer |
|---|---|
| Document ID | PRD-005 |
| Sürüm | 1.0 |
| Durum | Taslak |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | PRD-001, PRD-004 |
| İlgili Doküman | docs/01-poc/poc-vizyonu-ve-kapsami.md |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Bu belge ürünün ve POC'un başarısını farklı seviyelerde değerlendirmek için ortak çerçeve oluşturur.

Kesin POC test protokolü ve veri seti ayrı dokümanda tanımlanacaktır.

## 2. Başarı Seviyeleri

### 2.1. Veri Başarısı

- ürün kartı doğru tespit ediliyor mu?
- fiyat doğru ürünle ilişkilendiriliyor mu?
- miktar ve birim doğru çıkarılıyor mu?
- kampanya tarihleri doğru kapsama bağlanıyor mu?
- kaynak ve sayfa bilgisi korunuyor mu?

### 2.2. Sistem Başarısı

- aynı kaynak tekrar işlendiğinde mükerrer kayıt oluşuyor mu?
- hatalar görünür ve incelenebilir mi?
- işlem yeniden üretilebilir mi?
- ham ve normalize edilmiş veri ayrılıyor mu?
- düşük güvenli alanlar review akışına gidiyor mu?

### 2.3. Operasyonel Başarı

- bir katalog için gereken manuel düzeltme miktarı kabul edilebilir mi?
- yeni kaynak eklemek aşırı özel kod gerektiriyor mu?
- işlem süresi ve maliyet ölçülebiliyor mu?
- başarısız kaynaklar sistemi tamamen durdurmadan ayrıştırılabiliyor mu?

### 2.4. Ürün Başarısı

MVP ve sonraki aşamalarda:

- kullanıcının araştırma süresi azalıyor mu?
- önerilerin gerekçesi anlaşılabiliyor mu?
- kullanıcı sonucu güvenilir buluyor mu?
- yanlış veya yanıltıcı karşılaştırma oranı kabul edilebilir mi?

## 3. Mevcut POC Eşikleri

POC vizyon belgesinde kabul edilen başlangıç eşikleri:

- ürün kartı tespiti: en az `%85`
- fiyat doğruluğu: en az `%95`
- gramaj veya adet doğruluğu: en az `%85`
- kampanya tarihleri doğru ilişkilendirilmeli
- manuel düzeltme desteklenmeli
- tekrar işlem mükerrer kayıt üretmemeli

Bu eşikler test veri seti tanımlandıktan sonra yeniden gözden geçirilebilir; değişiklik gerekçesi kayıt altına alınır.

## 4. Başarısızlık Sinyalleri

Aşağıdakiler POC'un yeniden tasarlanmasını gerektirebilir:

- kritik fiyat hatalarının kabul edilebilir seviyeye indirilememesi,
- kaynak ile ürün eşleşmesinin kaybolması,
- çoğu kaydın manuel girilmek zorunda kalması,
- her market için tamamen ayrı sistem gereksinimi,
- aynı girdide tutarsız ve açıklanamayan sonuçlar,
- işlem maliyetinin hedef kullanım için sürdürülemez olması.

## 5. Ölçüm İlkeleri

- Test seti gerçek kaynaklardan oluşur.
- Başarı yalnızca kolay örneklerle ölçülmez.
- Alan bazlı doğruluk ayrı raporlanır.
- `Eksik`, `yanlış` ve `belirsiz` sonuçlar ayrılır.
- Manuel düzeltme süresi ölçülür.
- Model, prompt ve pipeline sürümü sonuçla birlikte saklanır.

## 6. POC Çıkış Kararı

POC sonunda üç karardan biri verilir:

- **Proceed:** MVP planlamasına geç.
- **Revise:** Belirli riskleri çözmek için POC'u yeniden tasarla.
- **Stop:** Temel yaklaşımın sürdürülebilir olmadığına karar ver.

## Açık Sorular

- POC test seti kaç katalog ve kaç ürün içerecek?
- Manuel düzeltme için kabul edilebilir üst sınır nedir?
- İşlem başına hedef maliyet ve süre nedir?
- Farklı kaynak tipleri ayrı mı, birleşik mi puanlanacaktır?
