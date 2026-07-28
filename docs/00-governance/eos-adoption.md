# EOS Benimseme Standardı

| Alan | Değer |
|---|---|
| Document ID | GOV-001 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | GOV-000 |
| İlgili ADR | ADR-0001 |
| Son Güncelleme | 2026-07-28 |

## 1. Karar

Akıllı Alışveriş Asistanı projesi, mühendislik ve proje yönetimi için EOS v1.0 standardını kullanır.

EOS dosyaları bu repository içine topluca kopyalanmaz. Proje, EOS'u merkezi ve proje bağımsız bir kaynak olarak referans alır.

## 2. Ayrım

### EOS'un sorumluluğu

- yaşam döngüsü
- dokümantasyon standardı
- karar yönetimi
- kalite kapıları
- değişiklik yönetimi
- sürümleme
- review ve onay süreçleri
- test ve teslim ilkeleri

### Projenin sorumluluğu

- ürün vizyonu
- POC ve MVP kapsamı
- domain modeli
- veri kaynakları
- mimari kararlar
- ürün davranışları
- proje riskleri
- sprint planları
- EOS'tan sapmalar

## 3. Benimseme Modeli

Her yeni projede aşağıdaki minimum kayıtlar bulunur:

1. EOS sürümü
2. EOS benimseme kararı
3. projeye özgü sapmalar
4. proje governance dokümanı
5. Decision Log
6. ADR dizini

## 4. Sapma Yönetimi

EOS'tan sapma gerekiyorsa:

1. Sapmanın gerekçesi yazılır.
2. Etkilenen EOS kuralı belirtilir.
3. Riskler ve geri dönüş planı tanımlanır.
4. ADR oluşturulur.
5. Decision Log güncellenir.
6. Sapma geçici ise sona erme koşulu yazılır.

Sessiz veya belgelenmemiş sapma kabul edilmez.

## 5. EOS'a Geri Besleme

Projede ortaya çıkan genel ve tekrar kullanılabilir iyileştirmeler doğrudan proje standardı haline getirilmez.

Önce:

1. proje içinde aday iyileştirme olarak kaydedilir,
2. proje bağımsızlığı değerlendirilir,
3. uygun görülürse EOS backlog'una taşınır,
4. EOS sürümünde kabul edildikten sonra projeler tarafından kullanılabilir.

## 6. Güncelleme Politikası

Proje, EOS'un yeni sürümüne otomatik geçmez. Yeni sürüm için etki analizi ve ayrı bir benimseme kararı gerekir.

## Kararlar

- EOS merkezi kalacaktır.
- EOS ile proje dokümanları ayrılacaktır.
- Projeler yalnızca kullandıkları EOS sürümünü ve sapmaları kaydedecektir.

## Riskler

- EOS sürümünün belirsiz kalması.
- Projeye özgü kuralların yanlışlıkla EOS kuralı gibi uygulanması.
- EOS güncellemesinin etki analizi yapılmadan benimsenmesi.

## Backlog

- EOS repository URL'sini ve immutable sürüm etiketini eklemek.
- EOS proje başlangıç şablonunu standartlaştırmak.
