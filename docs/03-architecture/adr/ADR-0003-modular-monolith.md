# ADR-0003 — Başlangıçta Modüler Monolit Kullanılması

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Sistem ingestion, normalizasyon, kimlik çözümleme, katalog, teklif, fiyat ve bildirim gibi farklı iş alanlarına sahiptir. Buna rağmen POC sonrasında gerçek trafik, ekip büyüklüğü ve bağımsız ölçekleme ihtiyacı henüz ölçülmemiştir.

## Karar

İlk üretim mimarisi, açık modül sınırlarına sahip modüler monolit olacaktır. Asenkron worker süreçleri aynı kod tabanından ayrı çalıştırılabilir; ancak her domain için baştan mikroservis kurulmayacaktır.

## Gerekçe

- Daha düşük operasyon maliyeti.
- Daha kolay yerel geliştirme ve transaction yönetimi.
- Domain sınırlarını öğrenirken hızlı değişim.
- Gereksiz ağ sözleşmeleri ve dağıtık hata modlarından kaçınma.

## Sonuçlar

Modül bağımlılıkları mimari testlerle korunmalıdır. Başka modülün veri tablolarına doğrudan yazmak yasaktır. Ölçülen ihtiyaç oluştuğunda ingestion, arama veya bildirim gibi modüller ayrıştırılabilir.
