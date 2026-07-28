# Mühendislik İlkeleri

| Alan | Değer |
|---|---|
| Document ID | GOV-003 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | GOV-001, GOV-002 |
| Son Güncelleme | 2026-07-28 |

## İlkeler

### 1. Documentation First

Kod, önemli davranış ve sınırlar belgelenmeden başlamaz.

### 2. POC Before MVP

Önce en yüksek teknik ve veri riskleri doğrulanır. POC ürünün tamamı değildir.

### 3. Single Source of Truth

Bir kural veya tanım tek bir ana dokümanda yaşar. Diğer belgeler tekrar etmek yerine referans verir.

### 4. Evidence Over Assumption

Kararlar varsayıma değil, örnek veri, test ve ölçümlere dayanır.

### 5. Source Provenance

Her kampanya ve ürün verisinin kaynağı, zamanı ve extraction yöntemi izlenebilir olmalıdır.

### 6. Explainable Automation

Otomatik extraction, eşleştirme ve öneriler; confidence, gerekçe ve kaynak bilgisi taşımalıdır.

### 7. Human Review by Design

Belirsiz veya kritik sonuçlar insan incelemesine yönlendirilebilir olmalıdır.

### 8. Immutable Raw Data

Ham kaynak ve extraction çıktısı sonradan sessizce değiştirilmez. Düzeltmeler yeni sürüm veya kayıt olarak tutulur.

### 9. Normalize Without Losing Evidence

Normalize edilmiş veri, ham verinin yerini almaz; ham kanıta geri bağlanır.

### 10. Modular by Default

Crawler, OCR, extraction, normalization, matching ve validation bağımsız sorumluluklar olarak tasarlanır.

### 11. Deterministic Where Possible

Aynı girdi için tekrar üretilebilir sonuç tercih edilir. AI kullanılan adımlarda model, prompt ve parametreler kaydedilir.

### 12. Fail Explicitly

Belirsizlik, eksik veri ve doğrulama hataları gizlenmez; açık durum ve hata kodlarıyla temsil edilir.

### 13. Measure Before Optimize

Performans ve maliyet sorunları ölçülmeden optimizasyon yapılmaz.

### 14. Security and Privacy by Default

Gizli anahtarlar repository'ye yazılmaz; kişisel veri yalnızca gerekli olduğunda toplanır.

### 15. Evolutionary Architecture

POC için gereksiz karmaşıklık kurulmaz; ancak kanıtlanan ihtiyaçların büyümesine engel olacak kısa yollar da kalıcılaştırılmaz.

### 16. EOS Compliance

Süreç ve teslimler EOS v1.0'a uyar. Sapmalar belgelenir.

## Uygulama Kuralı

Bir karar bu ilkelerden biriyle çelişiyorsa gerekçesi ADR içinde açıkça belirtilmelidir.

## Backlog

- İlkeler için otomatik dokümantasyon kontrol listesi.
- Kod review şablonuna ilke referansları eklemek.
