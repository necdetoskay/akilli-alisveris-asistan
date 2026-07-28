# ADR-0004 — Asenkron Pipeline ve Transactional Outbox

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Scraping dış sistemlere bağlı, yavaş ve hata üretebilen bir süreçtir. Parsing, normalizasyon, eşleştirme ve indeksleme adımlarının kullanıcı isteklerine bağlı çalışması gecikme ve güvenilirlik sorunları oluşturur.

Ayrıca veritabanına yazılan bir değişiklik ile sonraki adıma gönderilecek olayın birlikte güvence altına alınması gerekir.

## Karar

Ingestion pipeline asenkron işler halinde yürütülecek ve teslimat modeli en az bir kez olarak kabul edilecektir. Domain değişiklikleriyle yayımlanacak olaylar aynı transaction içinde outbox tablosuna yazılacaktır.

## Sonuçlar

Tüm tüketiciler idempotent tasarlanmalıdır. Outbox publisher ve başarısız iş yönetimi gerekir. Okuma modellerinde kısa süreli eventual consistency kabul edilir.
