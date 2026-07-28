# Hedef Kullanıcılar ve Kullanım Bağlamları

| Alan | Değer |
|---|---|
| Document ID | PRD-003 |
| Sürüm | 1.0 |
| Durum | Taslak |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | PRD-001, PRD-002 |
| Son Güncelleme | 2026-07-28 |

## 1. Birincil Kullanıcı

Birincil kullanıcı, düzenli ev alışverişi yapan ve fiyat ile ürün uygunluğunu değerlendirmek için farklı kampanya kaynaklarını inceleyen kişidir.

Temel ihtiyaçları:

- araştırmaya daha az zaman ayırmak,
- kampanya süresini kaçırmamak,
- paket farklarını anlayabilmek,
- güvenilir sonucu kaynağıyla görebilmek,
- tekrar eden tercihlerini yeniden girmemek.

## 2. İkincil Kullanıcılar

### 2.1. Aile alışverişini birlikte yöneten kişiler

Ortak ihtiyaç listesi, tercih ve satın alma kararlarını paylaşırlar.

### 2.2. Belirli ürünü fırsat oluştuğunda almak isteyen kullanıcı

Elektronik, beyaz eşya veya dayanıklı tüketim ürünü için hedef fiyat bekler.

### 2.3. Ürün içeriğine veya markaya dikkat eden kullanıcı

Belirli marka, içerik, kalite veya güvenlik kurallarına göre seçim yapar.

### 2.4. Sistem yöneticisi veya veri inceleyicisi

POC ve sonraki sürümlerde düşük güvenli extraction sonuçlarını inceler, düzeltir ve doğrular.

## 3. POC Kullanıcısı

POC'un doğrudan kullanıcısı son tüketiciden önce **veri inceleyicisi / proje sahibi** olacaktır.

POC kullanıcısı:

- kaynak ekler,
- extraction sonuçlarını görür,
- ham görsel veya sayfayla karşılaştırır,
- yanlış alanları düzeltir,
- normalize edilmiş kayıtları inceler,
- aynı kaynağın tekrar işlenmesini test eder.

## 4. Temel Kullanım Bağlamları

### 4.1. Haftalık alışveriş öncesi

Kullanıcı ihtiyaçlarını uygun kampanyalarla eşleştirmek ister.

### 4.2. Mağazada anlık karar

Kullanıcı gördüğü ürünün fiyat ve uygunluğunu hızlıca değerlendirmek ister.

### 4.3. Kampanya takibi

Kullanıcı belirli ürün veya kategori için kampanya bekler.

### 4.4. Uzun vadeli fiyat kararı

Kullanıcı acil olmayan ürünü geçmiş fiyat ve hedef fiyat bilgisiyle değerlendirir.

### 4.5. Veri doğrulama

İnceleyici, otomatik çıkarılan kayıtların doğruluğunu kontrol eder.

## 5. POC Önceliği

POC yalnızca `Veri doğrulama` bağlamını uçtan uca desteklemek zorundadır.

Diğer kullanım bağlamları uzun vadeli ürün vizyonunda kalır ve POC başarısından sonra ayrıntılandırılır.

## Açık Sorular

- İlk gerçek kullanıcı yalnızca proje sahibi mi olacaktır?
- POC review ekranında birden fazla kullanıcı ve rol gerekli midir?
- Son kullanıcı araştırmasında hangi alışveriş sıklıkları önceliklidir?
