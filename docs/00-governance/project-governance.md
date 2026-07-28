# Proje Yönetişimi

| Alan | Değer |
|---|---|
| Document ID | GOV-002 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | GOV-001 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Bu doküman projenin fikirden teslimata kadar nasıl yönetileceğini tanımlar.

## 2. Yaşam Döngüsü

Proje aşağıdaki aşamalardan geçer:

1. Idea
2. Discovery
3. Design
4. Planning
5. Design Freeze
6. Execution
7. Stabilization
8. Release
9. Maintenance

Bir aşamanın çıktıları yeterli değilse sonraki aşamaya geçilmez.

## 3. Mevcut Aşama

Proje şu anda **Discovery / POC Design** aşamasındadır.

Kodlama, POC tasarımı ve başarı ölçütleri yeterince olgunlaşmadan başlamaz.

## 4. Doküman Durumları

- **Draft:** çalışma sürümü
- **In Review:** incelemede
- **Approved:** kabul edildi
- **Frozen:** uygulama için sabitlendi
- **Superseded:** yeni belgeyle değiştirildi
- **Archived:** tarihsel kayıt

## 5. Karar Sınıfları

### Process ADR

Çalışma yöntemi ve yönetişim kararları.

### Product ADR

Ürün kapsamı, kullanıcı davranışı ve ürün stratejisi kararları.

### Architecture ADR

Teknik mimari, veri, entegrasyon ve altyapı kararları.

## 6. Karar Süreci

Önemli bir karar için:

1. problem tanımlanır,
2. seçenekler yazılır,
3. ölçütler belirlenir,
4. karar ve gerekçe kaydedilir,
5. etkiler listelenir,
6. ADR oluşturulur,
7. Decision Log güncellenir.

## 7. Design Freeze

Design Freeze öncesinde en az aşağıdakiler tamamlanır:

- POC amacı ve kapsamı
- başarı ve başarısızlık ölçütleri
- temel domain modeli
- veri kaynakları
- extraction ve validation akışı
- ana riskler
- test stratejisi
- kabul edilen ADR'ler

Freeze sonrasında kapsam değişikliği change request gerektirir.

## 8. Kapsam Yönetimi

POC tamamlanana kadar POC başarısını doğrudan desteklemeyen özellikler backlog'a alınır.

Yeni fikirler kaybolmaz; ancak aktif kapsamı genişletmez.

## 9. Review

Her paket:

- içerik tutarlılığı,
- EOS uyumu,
- gereksiz tekrar,
- izlenebilirlik,
- uygulanabilirlik,
- açık riskler

açısından gözden geçirilir.

## 10. Teslim Standardı

Her dokümantasyon paketi şunları içerir:

- Markdown dosyaları
- uygulanabilir git patch
- `git apply --check` doğrulaması
- commit mesajı
- paket özeti
- sonraki adım

## Kararlar

- Koddan önce tasarım yapılacaktır.
- POC kapsamı korunacaktır.
- Önemli kararlar ADR ile kayıt altına alınacaktır.
- Her paket tek ve anlamlı commit olarak uygulanacaktır.

## Riskler

- Tasarımın gereğinden fazla uzaması.
- POC'a ait olmayan fikirlerin aktif kapsama girmesi.
- Dokümanların koddan kopması.

## Kontroller

- Her faz sonunda kapsam kontrolü.
- Her patch öncesinde `git apply --check`.
- Her önemli değişiklikte Decision Log güncellemesi.
