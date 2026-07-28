# POC Çıkış Kararı

| Alan | Değer |
|---|---|
| Document ID | POC-007 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | POC-001..POC-006 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

POC tamamlandığında sezgisel değil, kanıta dayalı karar verilmesini sağlar.

## 2. Karar Seçenekleri

### PROCEED

MVP discovery ve mimari planlamasına geçilir.

### REVISE

POC yaklaşımı belirli sorunlar çözülerek tekrar edilir.

### STOP

Temel yaklaşımın hedef kullanım için sürdürülebilir olmadığı kabul edilir.

## 3. PROCEED Koşulları

Aşağıdakilerin birlikte karşılanması beklenir:

- ürün kartı tespiti hedefe ulaşmış,
- fiyat doğruluğu hedefe ulaşmış,
- kritik ürün-fiyat ilişkilendirme hataları kabul edilebilir seviyede,
- provenance eksiksiz,
- idempotency testi başarılı,
- review yükü uygulanabilir,
- en az iki kaynak tipinde sonuç alınmış,
- maliyet ve süre ölçülmüş,
- kritik riskler için net çözüm yolu bulunmuş.

## 4. REVISE Koşulları

- hedeflere yakın ancak belirli kaynaklarda zayıf sonuç,
- confidence kalibrasyonu yetersiz,
- review akışı fazla zaman alıyor,
- tarih kapsamı veya miktar parsing problemi çözülebilir görünüyor,
- mimari değil model/prompt/kural düzeyinde iyileştirme yeterli olabilir.

REVISE kararı süre, kapsam ve hedef değişiklikleriyle birlikte kaydedilir.

## 5. STOP Koşulları

- kritik fiyat hataları sürdürülebilir biçimde azaltılamıyor,
- kaynak düzeni çeşitliliği çözümü ekonomik olmaktan çıkarıyor,
- manuel emek otomasyon değerini ortadan kaldırıyor,
- provenance güvenilir şekilde korunamıyor,
- kaynak erişimi hukuki veya operasyonel olarak sürdürülemiyor.

## 6. Çıkış Raporu

POC sonunda şu başlıklar zorunludur:

1. kullanılan veri seti
2. pipeline sürümü
3. metrikler
4. kritik hata örnekleri
5. review süresi
6. maliyet
7. kaynak bazlı performans
8. risklerin son durumu
9. önerilen karar
10. MVP'ye taşınacak ve taşınmayacak yetenekler

## 7. Onay

Çıkış kararı:

- Decision Log'a eklenir,
- gerekirse yeni ADR oluşturulur,
- POC dokümanları `Frozen` veya `Superseded` durumuna alınır,
- MVP kapsamı POC sonucuna göre hazırlanır.

## 8. Yasak

POC başarısız veya belirsizken yalnızca ilerleme hissi oluşturmak için MVP kodlamasına geçilmez.
