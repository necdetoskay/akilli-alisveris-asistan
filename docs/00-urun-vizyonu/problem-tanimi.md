# Problem Tanımı

| Alan | Değer |
|---|---|
| Document ID | PRD-001 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Son Güncelleme | 2026-07-28 |

## 1. Ana Problem

Tüketiciler bir ürünü satın almadan önce fiyat, kampanya, gramaj, kalite, kişisel tercih, satıcı güvenilirliği ve kampanya süresi gibi dağınık bilgileri farklı kaynaklardan elle bir araya getirmek zorundadır.

Bu süreç:

- zaman alır,
- karşılaştırılması güç veriler üretir,
- birim ve paket farklılıkları nedeniyle yanıltıcı olabilir,
- kampanya geçerlilik tarihlerini gözden kaçırabilir,
- aynı ürünün farklı adlarla sunulması nedeniyle hatalı karşılaştırmalara yol açabilir,
- kullanıcının önceki tercihlerini ve deneyimlerini çoğunlukla hesaba katmaz.

## 2. POC Seviyesindeki Kök Problem

İlk aşamadaki en kritik belirsizlik şudur:

> Market katalogları, görselleri ve seçili web sayfalarındaki dağınık kampanya verileri güvenilir, izlenebilir ve karşılaştırılabilir yapılandırılmış kayıtlara dönüştürülebilir mi?

Bu problem çözülmeden fiyat karşılaştırması, öneri, alarm veya kişisel alışveriş asistanı güvenilir biçimde geliştirilemez.

## 3. Kullanıcı Açısından Problemler

### 3.1. Bilgi dağınıklığı

Kampanyalar PDF, görsel, web sayfası, mobil uygulama ve mağaza içi etiketlerde dağınık halde bulunur.

### 3.2. Karşılaştırma zorluğu

Aynı ürün farklı kaynaklarda farklı ad, paket ve birimlerle gösterilebilir.

Örnek:

- 1 litre
- 1000 ml
- 4 × 250 ml
- aile paketi

Bu kayıtların doğrudan fiyat karşılaştırması yanıltıcı olabilir.

### 3.3. Geçerlilik belirsizliği

Fiyatın hangi tarihlerde, hangi mağazada, hangi üyelik veya kart koşuluyla geçerli olduğu çoğu zaman ürün adından ayrı sunulur.

### 3.4. Kanıt eksikliği

Bir fiyat veya ürün bilgisinin hangi kaynaktan geldiği kaybolursa kullanıcı sonucu doğrulayamaz.

### 3.5. Karar yorgunluğu

Kullanıcının amacı yüzlerce kampanyayı incelemek değil, belirli bir ihtiyacı için güvenilir karar verebilmektir.

## 4. Sistem Açısından Problemler

- ürün kartlarının görsel olarak doğru ayrıştırılması,
- fiyatın doğru ürünle eşleştirilmesi,
- marka, varyant, miktar ve birim çıkarımı,
- kampanya tarihlerinin kaynak içindeki doğru kapsama bağlanması,
- tekrar işlenen kaynaklarda mükerrer kayıt oluşmaması,
- ham veri ile normalize edilmiş verinin bağlantısının korunması,
- belirsiz kayıtların insan incelemesine yönlendirilmesi.

## 5. Çözülmeyecek Yanlış Problem

İlk aşamada amaç bütün alışveriş kararlarını yapay zekâya bırakmak değildir.

Amaç:

> Güvenilir karar sistemlerinin üzerinde çalışabileceği doğrulanabilir veri temelini kurmak ve bunun uygulanabilirliğini kanıtlamaktır.

## 6. Problem Başarıyla Çözülürse

Sistem:

- kampanya kaynaklarını düzenli biçimde işleyebilir,
- ürün ve fiyat alanlarını çıkarabilir,
- kayıtları standartlaştırabilir,
- belirsizliği görünür kılabilir,
- kaynağa geri bağlantı sağlayabilir,
- aynı veya karşılaştırılabilir ürünleri eşleştirmeye hazır veri üretebilir.

## Açık Sorular

- Hangi market ve kaynak tipleri ilk POC veri setine alınacaktır?
- Aynı ürünün kimliği barkod bulunmadığında nasıl kurulacaktır?
- Kabul edilebilir manuel inceleme oranı nedir?
