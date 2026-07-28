# ADR-0005 — PostgreSQL Tabanlı Hibrit Ürün Araması

**Durum:** Kabul edildi
**Tarih:** 2026-07-28

## Bağlam

Ürün araması; tam metin, yazım toleransı, kategori ve özellik filtreleri ile semantik yakınlığı birlikte gerektirir. POC aşamasında ayrı bir arama kümesi kurmak operasyonel yük oluşturacaktır.

## Karar

İlk arama altyapısı PostgreSQL üzerinde kurulacaktır:

- Full-text search
- `pg_trgm`
- Yapılandırılmış kategori ve özellik indeksleri
- `pgvector`
- Alias ve taksonomi tabloları

Arama modülü uygulama içinde açık bir port üzerinden erişilen bağımsız domain modülü olacaktır. Böylece ileride OpenSearch, Elasticsearch veya ayrı bir arama servisine geçiş mümkün olur.

## Gerekçe

- POC ve ilk üretim için düşük operasyon maliyeti
- Ana katalog verisiyle güçlü transaction ve tutarlılık
- Tek veritabanında yeniden indeksleme kolaylığı
- Türkçe sorgu sözlükleri ve yapılandırılmış filtrelerin birlikte uygulanabilmesi

## Sonuçlar

PostgreSQL sorgu planları, indeks boyutları ve gecikmeler izlenecektir. Ayrı arama altyapısına geçiş kararı ancak ölçülen hacim ve gecikme sınırlarıyla alınacaktır.
