# ADR-0002 — POC-First Ürün Stratejisi

| Alan | Değer |
|---|---|
| Tür | Product ADR |
| Durum | Accepted |
| Tarih | 2026-07-28 |
| Karar Sahibi | Project Team |
| İlgili Doküman | docs/01-poc/poc-vizyonu-ve-kapsami.md |

## Bağlam

Tam Akıllı Alışveriş Asistanı; ürün kimliği, fiyat takibi, öneriler, listeler, sağlık değerlendirmesi ve farklı veri kaynakları gibi geniş bir kapsama sahiptir.

En temel belirsizlik, kampanya katalogları ve seçili web kaynaklarından ürün verisinin güvenilir biçimde çıkarılıp normalize edilip edilemeyeceğidir.

Bu risk doğrulanmadan tam ürün geliştirmek yüksek yeniden çalışma maliyeti oluşturur.

## Karar

İlk uygulama tam ürün veya MVP olmayacaktır.

Önce aşağıdaki sınırlı POC geliştirilecektir:

1. kampanya kaynağını alma,
2. ürün verisini çıkarma,
3. normalize etme,
4. doğrulama,
5. saklama,
6. kaynaklar arasında karşılaştırma.

## POC Dışında Kalanlar

- sağlık ve güvenlik analizi
- aile alışveriş listeleri
- öneri motoru
- ev envanteri
- mobil uygulama
- genel alışveriş ajanı
- fiyat tahmini

Bu fikirler silinmez; backlog'a alınır.

## Değerlendirilen Seçenekler

### A. Tam ürünü doğrudan geliştirmek

Reddedildi. En riskli veri problemi çözülmeden kapsamı büyütür.

### B. Önce kullanıcı arayüzü prototipi yapmak

Kısmen faydalı olsa da ana teknik riski doğrulamaz.

### C. Veri toplama ve normalizasyon POC'u

Kabul edildi. Projenin temel uygulanabilirliğini doğrudan test eder.

## Başarı Yönü

POC başarı ölçütleri ayrı dokümanda sayısallaştırılacaktır. En azından:

- ürün alanlarının çıkarılabilmesi,
- kaynak bağlantısının korunması,
- belirsiz sonuçların işaretlenmesi,
- normalize edilmiş kayıtların karşılaştırılabilmesi

kanıtlanmalıdır.

## Sonuçlar

- İlk teslim son kullanıcı ürünü olmayacaktır.
- POC boyunca kapsam sıkı şekilde korunacaktır.
- POC sonucuna göre MVP mimarisi yeniden değerlendirilecektir.

## Değiştirme Koşulu

POC'un ana teknik riski temsil etmediği kanıtlanırsa veya veri kaynaklarına erişim modeli değişirse yeni ADR hazırlanır.
