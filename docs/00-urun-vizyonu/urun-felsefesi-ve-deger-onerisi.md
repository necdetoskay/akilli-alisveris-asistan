# Ürün Felsefesi ve Değer Önerisi

| Alan | Değer |
|---|---|
| Document ID | PRD-002 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Bağımlılıklar | PRD-001 |
| Son Güncelleme | 2026-07-28 |

## 1. Ürün Felsefesi

Akıllı Alışveriş Asistanı'nın amacı kullanıcıya daha fazla veri göstermek değil, satın alma kararını daha güvenilir ve daha kolay hale getirmektir.

Temel yaklaşım:

> En ucuz görünen ürünü değil, koşullarıyla birlikte en uygun ve kanıtlanabilir satın alma seçeneğini bulmak.

## 2. Değer Önerisi

Ürün uzun vadede kullanıcıya şu değeri sunmalıdır:

- dağınık kampanya bilgisini tek yapıda toplamak,
- paket ve birim farklarını görünür kılmak,
- fiyatın geçerlilik koşullarını kaybetmemek,
- sonucu kaynağıyla göstermek,
- kullanıcının tercihlerini zaman içinde hatırlamak,
- önerinin nedenini açıklamak,
- belirsiz bilgiyi kesin sonuç gibi sunmamak.

## 3. POC Değer Önerisi

POC son kullanıcıya tam alışveriş asistanı sunmaz.

POC'un değeri:

> Kampanya verisinin otomatik veya yarı otomatik biçimde güvenilir, normalize edilmiş ve incelenebilir kayıtlara dönüştürülebildiğini kanıtlamak.

## 4. Ürün Davranış İlkeleri

### 4.1. Kanıt sonuçtan ayrılmaz

Her fiyat ve kampanya kaydı kaynak, tarih ve extraction bilgisine bağlı olmalıdır.

### 4.2. Belirsizlik gizlenmez

Güven seviyesi düşük alanlar işaretlenir ve gerektiğinde review kuyruğuna gönderilir.

### 4.3. Ham veri korunur

Normalize edilmiş kayıt, kaynağın yerine geçmez.

### 4.4. Otomasyon insanı dışlamaz

Sistem mümkün olanı otomatikleştirir; belirsiz olanı insanın kolayca düzeltebileceği şekilde sunar.

### 4.5. Sadelik özellik sayısından önemlidir

Kullanıcı ürünün iç işleyişini öğrenmek zorunda kalmadan güvenilir sonuç almalıdır.

### 4.6. Kişiselleştirme daha sonra gelir

Önce güvenilir ortak veri tabanı, sonra kullanıcıya özel karar katmanı geliştirilir.

## 5. Ürünün Yapmayacağı Şeyler

- Kaynaksız fiyat iddiası üretmek
- Belirsiz extraction sonucunu kesinmiş gibi göstermek
- Sırf düşük fiyat nedeniyle güvenilmez sonucu önermek
- Aynı olmayan paketleri yanıltıcı şekilde karşılaştırmak
- POC aşamasında tam ürün kapsamını taklit etmek

## Kararlar

- Veri güvenilirliği, özellik sayısından önce gelir.
- Açıklanabilirlik ve provenance temel ürün kabiliyetidir.
- İnsan review akışı geçici kusur değil, tasarımın parçasıdır.
