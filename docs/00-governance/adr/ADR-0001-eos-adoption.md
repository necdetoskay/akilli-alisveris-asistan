# ADR-0001 — EOS Benimseme Modeli

| Alan | Değer |
|---|---|
| Tür | Process ADR |
| Durum | Accepted |
| Tarih | 2026-07-28 |
| Karar Sahibi | Project Team |
| İlgili Doküman | GOV-001 |

## Bağlam

Projeler için oluşturulan EOS mühendislik sistemi daha önce LUMI projesinde kullanıldı. Aynı genel dokümanların her yeni projede yeniden hazırlanması veya kopyalanması tekrar, sürüm ayrışması ve bakım maliyeti oluşturur.

## Karar

EOS, merkezi ve proje bağımsız mühendislik sistemi olarak kullanılacaktır.

Bu proje:

- EOS v1.0'ı referans alır,
- EOS dosyalarını topluca kopyalamaz,
- yalnızca benimseme sürümünü, proje bağlamını ve sapmaları kaydeder,
- genel iyileştirmeleri EOS backlog'una geri besler.

## Değerlendirilen Seçenekler

### A. EOS dokümanlarını her projeye kopyalamak

Reddedildi. Kopyalar zamanla ayrışır ve hangi sürümün geçerli olduğu belirsizleşir.

### B. Her proje için yeni mühendislik kitabı yazmak

Reddedildi. Gereksiz tekrar ve tutarsızlık üretir.

### C. Merkezi EOS + proje adoption belgesi

Kabul edildi. Genel standart ile proje bağlamını ayırır.

## Sonuçlar

### Olumlu

- tekrar azalır,
- standartlar merkezileşir,
- sürüm takibi kolaylaşır,
- projeler arası tutarlılık artar.

### Olumsuz

- EOS kaynağına erişim gerektirir,
- sürüm yükseltmeleri ayrıca yönetilmelidir.

## Riskler

- EOS sürümünün sabit referansla kaydedilmemesi.
- Proje kuralı ile EOS kuralının karıştırılması.

## Değiştirme Koşulu

Merkezi EOS yaklaşımının erişilebilirlik veya sürüm yönetimi açısından sürdürülemez olduğu kanıtlanırsa yeni ADR ile değiştirilir.
