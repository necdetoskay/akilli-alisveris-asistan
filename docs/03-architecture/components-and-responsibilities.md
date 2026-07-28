# Bileşenler ve Sorumluluklar

**Belge Kodu:** ARCH-002
**Sürüm:** 1.0
**Durum:** Onaylandı

## 1. Kaynak kataloğu

Mağaza, alan adı, tarama politikası, desteklenen sayfa türleri, hız sınırı, parser sürümü ve kaynak güven seviyesini yönetir.

## 2. Ingestion orchestrator

Tarama görevlerini planlar, tekrarları engeller, kaynak limitlerini uygular ve görev durumunu izler. Parser mantığını içermez.

## 3. Fetcher / scraper adapter

HTTP veya tarayıcı tabanlı edinmeyi gerçekleştirir. Çıktısı ham sayfa, yanıt metadatası ve edinme kanıtıdır. Domain ürünü üretmez.

## 4. Parser

Kaynağa özgü HTML veya JSON yapısından gözlemlenen ürün alanlarını çıkarır. Çıktı `Observed Product` ve `Observed Offer` adaylarıdır.

## 5. Raw observation store

Ham içerik, hash, edinme zamanı, kaynak URL, parser sürümü ve hata bilgisini değiştirilemez gözlem olarak saklar. Yeniden işleme için ana kanıttır.

## 6. Normalization engine

Başlık, marka, model, kapasite, renk, ölçü, para birimi, satıcı ve kampanya ifadelerini standart biçime dönüştürür. Kaynak değerini silmez; normalize edilmiş değer ayrı tutulur.

## 7. Identity resolution engine

Gözlemlenen ürünü mevcut kanonik ürün ve varyantlarla karşılaştırır. Kesin eşleşme, olası eşleşme, yeni ürün adayı veya inceleme gerekli sonucu üretir.

## 8. Offer service

Mağaza, satıcı, ürün varyantı, fiyat, stok, kargo ve kampanya koşullarını bir teklif olarak yönetir. Teklifin zaman içindeki gözlemlerini korur.

## 9. Price history service

Geçerli fiyat gözlemlerini zaman serisine dönüştürür. Anormal sıçrama, eski fiyat manipülasyonu ve para birimi uyumsuzluğu gibi kontrolleri uygular.

## 10. Catalog query service

Kanonik ürünleri, varyantları, teklifleri ve fiyat geçmişini kullanıcı sorgularına uygun okuma modellerinde sunar.

## 11. Watch and notification service

Kullanıcının fiyat, stok, satıcı veya kampanya koşullarını değerlendirir. Bildirim gönderimini sağlayıcı adaptörlerinden ayırır.

## 12. Review console

Düşük güvenli eşleşmeleri, parser hatalarını ve karantinaya alınan gözlemleri insan incelemesine sunar. Operatör kararları denetlenebilir biçimde kaydedilir.
