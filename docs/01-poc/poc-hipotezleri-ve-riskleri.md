# POC Hipotezleri ve Riskleri

| Alan | Değer |
|---|---|
| Document ID | POC-001 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | PRD-001, ADR-0002 |
| Son Güncelleme | 2026-07-28 |

## 1. Ana Hipotez

Market katalogları, görselleri ve seçili kampanya web sayfaları; yeterli doğruluk, izlenebilirlik ve kabul edilebilir manuel düzeltme maliyetiyle yapılandırılmış kampanya kayıtlarına dönüştürülebilir.

## 2. Alt Hipotezler

### H1 — Kaynak Alımı

Kaynaklar güvenilir biçimde indirilebilir, sürümlenebilir ve tekrar işlenebilir.

### H2 — Ürün Kartı Tespiti

Bir sayfa veya görsel içindeki ürün kartları yeterli doğrulukla ayrıştırılabilir.

### H3 — Alan Çıkarımı

Ürün adı, marka, miktar, birim, fiyat ve tarih alanları doğru çıkarılabilir.

### H4 — Alan İlişkilendirme

Bir fiyatın ve kampanya koşulunun doğru ürün kartına ait olduğu belirlenebilir.

### H5 — Normalizasyon

Farklı yazım ve birimler karşılaştırılabilir ortak biçime dönüştürülebilir.

### H6 — Provenance

Her normalize kayıt ham kaynağa, sayfaya ve extraction çıktısına geri bağlanabilir.

### H7 — İnsan Review

Düşük güvenli veya hatalı sonuçlar makul sürede incelenip düzeltilebilir.

### H8 — Idempotency

Aynı kaynak aynı sürümle tekrar işlendiğinde mükerrer kayıt oluşmaz.

## 3. En Yüksek Riskler

| Risk | Etki | Olasılık | POC Kontrolü |
|---|---|---:|---|
| Fiyatın yanlış ürünle eşleşmesi | Kritik | Orta | alan ilişkilendirme testi |
| Kampanya tarihinin yanlış kapsama bağlanması | Yüksek | Orta | tarih kapsam testi |
| Çok farklı katalog düzenleri | Yüksek | Yüksek | kaynak çeşitliliği |
| Görsel kalite düşüklüğü | Orta | Yüksek | zorlu örnek seti |
| Her market için özel kod ihtiyacı | Yüksek | Orta | yeni kaynak uyarlama ölçümü |
| Manuel review yükünün aşırı olması | Yüksek | Orta | kayıt başına review süresi |
| AI çıktılarının tekrar üretilememesi | Orta | Orta | model/prompt sürüm kaydı |
| Aynı kaynağın mükerrer kayıt üretmesi | Orta | Orta | idempotency testi |

## 4. Kritik Başarısızlıklar

Aşağıdakiler POC yaklaşımının yeniden değerlendirilmesini gerektirir:

- fiyat alanında sistematik ve açıklanamayan yanlışlık,
- kaynak bağlantısının kaybolması,
- ürün kartlarının çoğunun manuel ayrıştırılması,
- katalog başına kabul edilemeyecek özel entegrasyon maliyeti,
- review süresinin otomasyon kazancını ortadan kaldırması.

## 5. Risk Azaltma Sırası

1. Fiyat ve ürün ilişkilendirmesi
2. Provenance
3. Miktar ve birim
4. Kampanya tarihleri
5. Idempotency
6. Operasyonel maliyet
7. Kaynak çeşitliliği
