# Sistem Mimarisi Temeli

**Belge Kodu:** ARCH-000
**Sürüm:** 1.0
**Durum:** Onaylandı

Bu bölüm, Akıllı Alışveriş Asistanı'nın ilk uygulanabilir mimarisini tanımlar. Amaç, mağaza sayfalarından alınan ham verinin güvenilir, tekrar işlenebilir ve gözlemlenebilir bir hat üzerinden kanonik ürün, teklif, fiyat geçmişi ve kullanıcıya sunulan öneriye dönüşmesini sağlamaktır.

## Belgeler

1. [Sistem bağlamı](system-context.md)
2. [Bileşenler ve sorumluluklar](components-and-responsibilities.md)
3. [Uçtan uca veri akışı](end-to-end-data-flow.md)
4. [Servis sınırları ve modüler monolit](service-boundaries-and-modular-monolith.md)
5. [Scraping, normalizasyon ve eşleştirme hattı](scraping-normalization-matching-pipeline.md)
6. [Veri sahipliği ve depolama ilkeleri](data-ownership-and-storage.md)
7. [Güvenilirlik, idempotency ve yeniden işleme](reliability-idempotency-and-reprocessing.md)
8. [Gözlemlenebilirlik ve operasyon](observability-and-operations.md)
9. [ADR-0003: Modüler monolit yaklaşımı](adr/ADR-0003-modular-monolith.md)
10. [ADR-0004: Asenkron iş hattı ve outbox](adr/ADR-0004-async-pipeline-and-outbox.md)

## Mimari hedefler

- Ham veriyi kaybetmeden işleyebilmek.
- Aynı gözlemi güvenle tekrar işleyebilmek.
- Ürün kimliği ile mağaza teklifini birbirinden ayırmak.
- Belirsiz eşleşmeleri sessizce kesinleştirmemek.
- Her fiyatın kaynağını ve zamanını izleyebilmek.
- POC ile üretim mimarisi arasında gereksiz yeniden yazımı azaltmak.
- İlk aşamada operasyonel karmaşıklığı düşük tutmak.

## Mimari olmayan hedefler

Bu paket; kesin bulut sağlayıcısı, kesin mesaj kuyruğu ürünü, tam fiziksel PostgreSQL şeması, kullanıcı arayüzü bileşenleri ve ölçekleme eşiklerini belirlemez. Bunlar sonraki paketlerde, ölçülen POC sonuçlarına göre kesinleştirilecektir.
