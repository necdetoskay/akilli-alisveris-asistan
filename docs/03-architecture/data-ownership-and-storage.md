# Veri Sahipliği ve Depolama İlkeleri

**Belge Kodu:** ARCH-006
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Ana veri deposu

İlişkisel ve denetlenebilir domain verisi için PostgreSQL varsayılan ana depodur. Kanonik ürün, varyant, teklif, fiyat noktası, eşleşme kararı, kullanıcı takip kuralı ve operasyon kaydı burada tutulur.

## 2. Ham gözlem deposu

Büyük HTML/JSON gövdeleri nesne depolama veya sıkıştırılmış dosya deposunda tutulabilir. PostgreSQL içinde kaynak, hash, zaman, parser sürümü ve nesne adresi saklanır.

## 3. Arama indeksi

Arama motoru veya vektör indeksi, kanonik gerçeğin sahibi değildir. Yeniden üretilebilir bir okuma modelidir. İndeks kaybı domain verisi kaybı sayılmaz.

## 4. Cache

Cache yalnızca performans optimizasyonudur. Fiyatın, kampanyanın veya kimlik kararının tek kalıcı kaynağı olamaz.

## 5. Modül sahipliği

- Observation modülü ham ve parse edilmiş gözlemlerin sahibidir.
- Catalog modülü kanonik ürün ve varyantların sahibidir.
- Offer modülü satıcı ve teklif durumunun sahibidir.
- Pricing modülü fiyat noktaları ve fiyat analizinin sahibidir.
- Watchlist modülü kullanıcı koşullarının sahibidir.

## 6. Veri yaşam döngüsü

Ham gözlemler yeniden işleme ve denetim ihtiyacına göre saklanır. Kişisel veriler minimum düzeyde tutulur ve ayrı yaşam döngüsü politikasına tabi olur. Teknik loglar domain kayıtlarının yerine geçmez.

## 7. Şema değişiklikleri

Şema değişiklikleri migration ile yapılır. Geriye dönük uyumluluk gerektiren olay ve DTO değişiklikleri sürümlenir. Büyük veri dönüşümleri tek migration içinde uzun kilit oluşturmamalı; kontrollü backfill görevleriyle yürütülmelidir.
