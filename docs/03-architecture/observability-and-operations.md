# Gözlemlenebilirlik ve Operasyon

**Belge Kodu:** ARCH-008
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Temel sinyaller

Sistem log, metric ve trace üretmelidir. Her ingestion akışı correlation ID ile fetch, parse, normalize, match ve persistence adımlarında izlenebilmelidir.

## 2. Önerilen metrikler

- kaynak bazında fetch başarı oranı,
- HTTP durum dağılımı,
- parser başarı oranı,
- boş veya geçersiz alan oranı,
- otomatik eşleşme oranı,
- review_required oranı,
- yanlış pozitif eşleşme oranı,
- pipeline gecikmesi,
- kuyruk derinliği ve en eski mesaj yaşı,
- fiyat anomali oranı,
- bildirim teslim başarı oranı.

## 3. Sağlık seviyeleri

- **Healthy:** normal eşikler içinde.
- **Degraded:** veri akışı sürüyor ancak kalite veya gecikme bozulmuş.
- **Paused:** kaynak politikası veya koruma mekanizması nedeniyle durdurulmuş.
- **Broken:** parser veya edinme tamamen başarısız.

## 4. Operasyon ekranları

Operatör; kaynak sağlığı, son başarılı gözlem, parser sürümü, hata örnekleri, karantina kayıtları ve yeniden işleme durumunu görebilmelidir.

## 5. Alarm ilkeleri

Tekil hata için alarm üretmek yerine oran, süre ve etki alanı dikkate alınır. Örneğin bir mağazada parser başarı oranının belirli süre boyunca anlamlı biçimde düşmesi alarm nedenidir.

## 6. Denetim izi

İnsan tarafından yapılan eşleştirme, ayırma, marka düzeltme veya yeniden işleme kararları kullanıcı, zaman, önceki değer, yeni değer ve gerekçeyle saklanır.

## 7. Veri kalite raporu

Her kaynak için günlük veya çalıştırma bazlı kalite özeti üretilebilir. Bu rapor POC başarı ölçütleriyle aynı kavramları kullanmalı ve zaman içinde karşılaştırılabilir olmalıdır.
