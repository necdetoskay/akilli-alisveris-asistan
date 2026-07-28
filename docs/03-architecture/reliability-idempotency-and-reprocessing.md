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
