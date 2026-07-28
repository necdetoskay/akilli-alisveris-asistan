# Akıllı Alışveriş Asistanı — Uygulama İskeleti

## 1. Belgenin amacı

Bu belge, **Akıllı Alışveriş Asistanı** projesi için şimdiye kadar yapılan fikir alışverişlerinin ürün iskeletini kayda geçirir. Amaç henüz teknik uygulama ayrıntılarını veya nihai PRD'yi tanımlamak değil; uygulamanın ne olduğunu, hangi problemleri çözdüğünü, hangi modüllerden oluştuğunu ve kullanıcıya nasıl bir deneyim sunacağını ortak bir çerçeveye oturtmaktır.

Bu belge kodlama öncesi ürün olgunlaştırma sürecinin başlangıç kaydıdır. Uygulama fikir bakımından yeterince olgunlaştığında bu çerçeve kullanılarak ayrıntılı PRD, sistem mimarisi, veri modeli, sprint planı ve uygulama planı hazırlanacaktır.

---

## 2. Ürün tanımı

Akıllı Alışveriş Asistanı yalnızca fiyat karşılaştıran veya kampanya gösteren bir uygulama değildir.

Uygulama;

- kullanıcının ihtiyaçlarını,
- aile içi ortak alışveriş listelerini,
- ürün ve marka tercihlerini,
- kara listeleri,
- ürün içeriklerini,
- resmî güvenlik kayıtlarını,
- geçmiş fiyatları,
- kampanya geçerlilik sürelerini,
- kişisel ürün deneyimlerini,
- alışveriş sıklığını,
- hedef fiyatları,
- satıcı güvenilirliğini

birlikte değerlendirerek **ne alınmalı, ne zaman alınmalı, nereden alınmalı, hangi ürün tercih edilmeli ve neden** sorularına açıklanabilir cevaplar üretir.

Temel ürün yaklaşımı:

> En ucuz ürünü değil, kullanıcı ve ailesi için en uygun satın alma kararını bulmak.

---

## 3. Temel ürün ilkeleri

### 3.1. Pratiklik birinci önceliktir

Uygulamanın en önemli başarı ölçütü özellik sayısı değil, kullanıcının karar alma süresidir.

Hedef deneyim:

> Uygulamayı aç, ihtiyacını belirt, sonucu gör, kararını ver ve çık.

Kullanıcı ekranlar, filtreler ve uzun formlar arasında kaybolmamalıdır.

### 3.2. Bir bilgi kullanıcıdan ikinci kez istenmez

Kullanıcının daha önce belirttiği;

- marka tercihleri,
- kara listeleri,
- kaçındığı içerikler,
- aile bireylerinin tercihleri,
- hedef fiyatlar,
- favori ürünler,
- geçmiş ürün yorumları,
- market tercihleri

kalıcı hafızada tutulmalı ve sonraki kararlarda otomatik kullanılmalıdır.

### 3.3. Açıklanabilir karar

Uygulama yalnızca puan veya sonuç göstermemelidir. Her öneri veya ret kararı için kısa ve anlaşılır neden sunmalıdır.

Örnek:

- Son 90 günün en düşük fiyatına yakın.
- Kampanya yarın sona eriyor.
- Marka kara listenizde.
- Çocuğunuz bu ürünü daha önce beğenmedi.
- İçerik profilinizde kaçındığınız bir katkı maddesi içeriyor.
- Aynı ürün başka bir güvenilir satıcıda daha uygun.

### 3.4. Agent'lar önerir, araçlar hesaplar, harness denetler, kaynaklar kanıtlar

LLM veya agent çıktısı tek başına son karar olmamalıdır.

- Araştırma ve yorumlama uzman agent'lar tarafından yapılabilir.
- Fiyat, birim fiyat, tarih, eşik, sepet optimizasyonu ve kara liste kontrolü deterministik araçlarla yapılmalıdır.
- Merkezi harness görevleri yönetmeli, çıktıların doğrulanmasını sağlamalıdır.
- Her önemli karar kaynak ve kanıt kaydıyla saklanmalıdır.

### 3.5. Güvenlik ve uygunluk fiyatın önündedir

Öncelik sırası genel olarak şöyledir:

1. Resmî güvenlik ve risk kayıtları
2. Kullanıcının kara listeleri ve kesin yasakları
3. Kişisel içerik ve sağlık tercihleri
4. Ürün kalitesi ve geçmiş deneyimler
5. Fiyat ve kampanya avantajı

---

## 4. Kullanıcı deneyimi yaklaşımı

### 4.1. Ana ekran sade olmalıdır

Ana ekranda kullanıcıya en fazla birkaç güçlü giriş noktası gösterilmelidir:

- **Bugün Ne Almalıyım?**
- **Ürünü Tara**
- **Alışveriş Listelerim**
- **Hazır Raporlar**

İleri düzey ayarlar ana deneyimin önüne geçmemelidir.

### 4.2. Konuşma ve kamera öncelikli kullanım

Kullanıcı mümkün olduğunca doğal dille işlem yapabilmelidir.

Örnek komutlar:

- Bu akşam haftalık alışveriş yapacağım.
- Çocuğa süt alacağım.
- Bu ürün nasıl?
- Bu fişi kaydet.
- Televizyon fiyatı uygun olduğunda haber ver.
- Eşim listeye ne ekledi?

Kamera ile;

- ürün ön yüzü,
- barkod,
- içindekiler etiketi,
- besin değerleri,
- fiyat etiketi,
- fiş

taranabilmelidir.

### 4.3. Katmanlı sonuç gösterimi

İlk ekranda kısa sonuç gösterilmelidir:

- Uygun
- Dikkatle değerlendir
- Tercihlerinize uygun değil
- Resmî risk nedeniyle uzak dur

Detay isteyen kullanıcı gerekçeleri, kaynakları ve ayrıntılı puanları açabilmelidir.

### 4.4. Raf konumu kapsam dışıdır

Uygulama mağaza içi raf veya koridor konumu göstermeye çalışmayacaktır. Market içi yerleşimler güvenilir biçimde elde edilemediği ve sık değiştiği için bu özellik ürün kapsamına alınmayacaktır.

---

## 5. Ana modüller

## 5.1. Alışveriş Listelerim

Kullanıcı farklı amaçlarla listeler oluşturabilmelidir:

- günlük alışveriş,
- haftalık alışveriş,
- aylık ihtiyaçlar,
- ortak aile listesi,
- yalnızca uygun fiyat oluştuğunda alınacaklar,
- elektronik ürünler,
- beyaz eşya,
- okul ihtiyaçları,
- dayanıklı tüketim ürünleri.

Her liste öğesinde ihtiyaca göre şu bilgiler bulunabilir:

- ürün veya kategori,
- miktar,
- önem düzeyi,
- aciliyet,
- ihtiyaç tarihi,
- hedef fiyat,
- tercih edilen markalar,
- yasaklı markalar,
- kabul edilebilir alternatifler,
- teknik özellikler,
- atanmış aile üyesi,
- durum.

Önem ve aciliyet birbirinden ayrı değerlendirilmelidir.

Örnek:

- Bebek bezi: çok önemli, bugün gerekli.
- Peynir: önemli, bu hafta gerekli.
- Televizyon: düşük aciliyet, yalnızca iyi fırsatta alınacak.

### Ortak aile listesi

Bir aile üyesinin oluşturduğu liste diğer aile üyelerinin ekranına düşmelidir. Sistem gün içinde araştırma yapmalı ve alışveriş zamanına yakın sade bir rapor hazırlamalıdır.

Örnek rapor:

- 12 ürün araştırıldı.
- 8 ürün için uygun seçenek bulundu.
- 2 ürünün kampanyası yarın bitiyor.
- 1 ürün kara liste nedeniyle elendi.
- 1 ürün için fiyatın düşmesi beklenebilir.

---

## 5.2. Broşür ve kampanya toplama

Uygulama market broşürlerinden yapılandırılmış ürün ve kampanya verisi çıkarabilmelidir.

Toplanması gereken temel alanlar:

- market,
- ürün adı,
- marka,
- varyant,
- gramaj veya adet,
- normal fiyat,
- kampanya fiyatı,
- birim fiyat,
- kampanya türü,
- geçerlilik başlangıç tarihi,
- geçerlilik bitiş tarihi,
- üyelik veya kart şartı,
- stok sınırlaması,
- kaynak,
- güven seviyesi.

Fiyat geçerlilik süresi zorunlu veri olarak ele alınmalıdır. Kampanya bitiş tarihi yaklaşan ve kullanıcı için uygun olan ürünler alarm adayı olabilir.

Kaynak önceliği:

1. Resmî market kataloğu veya broşürü
2. Güvenilir broşür toplayıcı kaynak
3. Akakçe veya Cimri gibi doğrulama kaynakları
4. Kullanıcının raf etiketi veya fiş fotoğrafı

---

## 5.3. On-the-Fly Check — anlık ürün kontrolü

Kullanıcı alışveriş sırasında bir ürünün;

- ön yüzünü,
- barkodunu,
- içindekiler listesini,
- besin değerleri tablosunu,
- fiyat etiketini

fotoğraf olarak yükleyebilmelidir.

Sistem mümkün olduğunca tek akışta şu işlemleri yapmalıdır:

1. Ürünü tanıma
2. Barkod, marka, ürün adı ve gramaj çıkarımı
3. İçindekiler listesini okuma
4. Besin değerlerini çıkarma
5. Katkı maddelerini eşleştirme
6. Resmî ve bilimsel kaynaklarla açıklama
7. Kullanıcının tercihleriyle karşılaştırma
8. Genel ürün puanı üretme
9. Kişisel uyum puanı üretme
10. Fiyat ve birim fiyat çıkarma
11. Kullanıcıya nedenleriyle birlikte sonuç gösterme

Önerilen iki puan:

- **Genel ürün puanı:** Ürünün içerik, beslenme ve şeffaflık özellikleri.
- **Kişisel uyum puanı:** Ürünün kullanıcı ve ailesinin tercihleriyle uyumu.

Fotoğraftan çıkarılan veriler için güven oranı gösterilmeli; belirsiz bilgiler kesinmiş gibi sunulmamalıdır.

Ürün veritabanında yoksa geçici ürün kaydı oluşturulmalı, kullanıcıya hızlı sonuç verilmeli ve ürün daha sonra doğrulama kuyruğunda zenginleştirilmelidir.

---

## 5.4. Ürün bilgi ve içerik katmanı

Her ürün zaman içinde zenginleşen bir bilgi kaydına sahip olmalıdır.

Örnek veri başlıkları:

- ürün kimliği,
- barkod,
- marka,
- kategori,
- varyant,
- gramaj,
- içerik listesi,
- içerik sürümleri,
- besin değerleri,
- katkı maddeleri,
- alerjenler,
- işlenmişlik düzeyi,
- genel ürün puanı,
- kaynaklar,
- yapay zekâ özeti,
- fiyat geçmişi,
- kampanyalar,
- resmî güvenlik kayıtları,
- kişisel deneyimler.

Üreticilerin formülleri değiştirebileceği kabul edilmeli ve içerik sürüm geçmişi tutulmalıdır.

---

## 5.5. Resmî güvenlik ve taklit-tağşiş kontrolü

Tarım ve Orman Bakanlığı tarafından yayımlanan güvenilir gıda, taklit ve tağşiş kayıtları sistemin en önemli veri kaynaklarından biri olmalıdır.

Kontrol yalnızca marka adına göre yapılmamalıdır. Mümkün olduğunda;

- firma,
- marka,
- ürün adı,
- kategori,
- parti veya seri bilgisi,
- yayın tarihi

birlikte değerlendirilmelidir.

Resmî eşleşme varsa sistem normal fiyat önerisi üretmemeli, öncelikle güvenlik uyarısı vermelidir.

---

## 5.6. Marka ve ürün tercih sistemi

Markalar ve ürünler yalnızca seviliyor/sevilmiyor şeklinde tutulmamalıdır.

Önerilen tercih seviyeleri:

- tercih edilen,
- kabul edilebilir,
- nötr,
- kaçınılan,
- tamamen engellenen.

Tamamen engellenen marka veya ürün;

- önerilere,
- en ucuz sepete,
- fiyat alarmlarına,
- kampanya bildirimlerine

dâhil edilmemelidir.

Kullanıcı ayrıca içerik bazlı tercihler tanımlayabilmelidir:

- palm yağı istemiyorum,
- glikoz şurubu istemiyorum,
- yapay tatlandırıcı istemiyorum,
- koruyucu içerenleri mümkünse önerme,
- belirli alerjenleri tamamen engelle.

---

## 5.7. Kişisel ürün yorumları ve deneyim günlüğü

Her ürün için kullanıcıya ve aileye özel yorum eklenebilmelidir.

Örnekler:

- Kızım tadını sevmedi.
- Çok çabuk bozuldu.
- Normalden fazla acıydı.
- Fiyatına göre başarılıydı.
- Bir daha almak istemiyorum.
- Ailece çok beğendik.

Bu yorumlar klasik herkese açık yorum sisteminden farklıdır. Amaç sosyal puanlama değil, ailenin kendi satın alma hafızasını oluşturmaktır.

Yapay zekâ serbest metni otomatik etiketleyebilir:

- çocuk beğenmedi,
- tat memnuniyeti düşük,
- hızlı bozuldu,
- tekrar satın alma isteği düşük,
- aile favorisi,
- ambalaj sorunu,
- kalite tutarsızlığı.

Kişisel yorumlar öneri puanını etkilemelidir; ancak tek başına kesin hüküm oluşturmamalıdır. Yorumun tarihi, ürün formül değişikliği ve tekrar eden deneyimler dikkate alınmalıdır.

---

## 5.8. Fiyat araştırma ve fiyat geçmişi

Sistem gıda ile sınırlı olmamalıdır. Elektronik, beyaz eşya ve diğer dayanıklı tüketim ürünleri için büyük ve güvenilir alışveriş kaynaklarından fiyat araştırması yapılabilmelidir.

Dayanıklı tüketim ürünlerinde fiyat yanında şu unsurlar değerlendirilmelidir:

- model numarası,
- teknik özellikler,
- satıcı güvenilirliği,
- garanti,
- yetkili servis,
- kargo,
- kurulum,
- teslimat süresi,
- kuponlar,
- banka kampanyaları,
- ürünün fiyat geçmişi,
- benzer veya daha iyi alternatifler.

En ucuz satıcı otomatik olarak en iyi seçenek kabul edilmemelidir.

---

## 5.9. Fiyat ve kampanya alarm sistemi

Kullanıcı farklı alarm türleri tanımlayabilmelidir:

- hedef fiyatın altına düşünce,
- tarihsel olarak iyi fiyat oluşunca,
- güçlü indirim oluşunca,
- kampanyanın bitmesine az kalınca,
- düzenli alınan ürünün zamanı yaklaşınca,
- güvenilir satıcıda fiyat düşünce,
- daha iyi alternatif bulunduğunda.

Alarm üretmeden önce şu kontroller yapılmalıdır:

1. Ürün kara listede mi?
2. Resmî risk kaydı var mı?
3. İçerik kullanıcı tercihleriyle uyumlu mu?
4. İndirim gerçekten avantajlı mı?
5. Kampanya şartları doğrulandı mı?
6. Kampanyanın bitmesine ne kadar kaldı?
7. Kullanıcının ürüne yakın zamanda ihtiyacı var mı?

Amaç her fiyat değişimini bildirmek değil, kullanıcı açısından anlamlı olayları bildirmektir.

---

## 5.10. Sepet ve alışveriş planı optimizasyonu

Sistem yalnızca ürün bazında değil, bütün alışveriş listesi için plan üretmelidir.

Dikkate alınabilecek faktörler:

- toplam sepet tutarı,
- market sayısı,
- kullanıcının maksimum uğramak istediği mağaza sayısı,
- yol ve zaman maliyeti,
- kampanya bitiş tarihleri,
- minimum sepet şartı,
- teslimat ücreti,
- stok bilgisi,
- ürün önceliği,
- alternatif ürün kabulü.

Sistem kullanıcıya açık karşılaştırma sunmalıdır:

> Tek marketten alırsanız 24 TL daha fazla ödersiniz ancak ikinci bir mağazaya gitmeniz gerekmez.

Bu hesaplamalar deterministik optimizasyon araçlarıyla yapılmalıdır.

---

## 5.11. Fiş ve alışveriş sonrası öğrenme

Kullanıcı fiş fotoğrafı yükleyebilmelidir. Sistem;

- satın alınan ürünleri,
- miktarları,
- fiyatları,
- marketi,
- tarihi,
- uygulanan kampanyaları

çıkararak alışveriş geçmişine eklemelidir.

Bu veri;

- fiyat geçmişi,
- tüketim sıklığı,
- tekrar satın alma tahmini,
- tasarruf raporları,
- kişisel ürün yorumları,
- stok tahmini

için kullanılabilir.

Uygulama satın alma sonrası kullanıcıya uzun form göstermemeli; gerekirse yalnızca kısa sorular sormalıdır:

- Bu ürünü beğendiniz mi?
- Tekrar alınsın mı?
- Hızlı bozuldu mu?

---

## 6. Çok ajanlı harness mimarisi

Uygulama tek bir genel agent yerine merkezi bir harness ve uzman görev bileşenleriyle çalışmalıdır.

### 6.1. Merkezi Orchestrator / Harness

Sorumlulukları:

- kullanıcı isteğini anlamak,
- görevi alt görevlere ayırmak,
- gerekli agent ve araçları seçmek,
- görev sırasını yönetmek,
- başarısız işlemleri yeniden denemek,
- maliyet ve süre sınırlarını yönetmek,
- doğrulama gerektiren çıktıları işaretlemek,
- insan onayı gereken noktaları belirlemek,
- sonuçları birleştirmek,
- karar kaydını saklamak.

### 6.2. Uzman agent ve servis adayları

- Product Identity Agent
- Brochure Extraction Agent
- Price Research Agent
- Food Safety Agent
- Ingredient Analysis Agent
- Personal Preference Agent
- Campaign Agent
- Notification Agent
- Report Agent

### 6.3. Deterministik araçlar

- barkod ve ürün eşleştirme,
- fiyat ve birim fiyat hesaplama,
- tarih ve kampanya süresi kontrolü,
- kara liste filtresi,
- puan ağırlıklandırma,
- hedef fiyat kontrolü,
- sepet optimizasyonu,
- JSON ve şema doğrulama,
- tekrar kayıt önleme,
- bildirim zamanlama.

Her iş agent olmamalıdır. Hesaplanabilir ve doğrulanabilir işler mümkün olduğunca kod tabanlı araçlarla yapılmalıdır.

---

## 7. Hafıza katmanları

## 7.1. Kullanıcı hafızası

- marka tercihleri,
- kara listeler,
- içerik tercihleri,
- aile bireyleri,
- market tercihleri,
- maksimum mağaza sayısı,
- alışveriş günleri,
- hedef fiyatlar,
- bildirim tercihleri,
- geçmiş kararlar.

## 7.2. Ürün hafızası

- ürün kimliği,
- barkod,
- varyantlar,
- içerik sürümleri,
- puanlar,
- güvenlik kayıtları,
- fiyat geçmişi,
- kişisel yorumlar,
- geçmiş satın almalar.

## 7.3. Görev hafızası

- hangi araştırma yapıldı,
- hangi kaynaklar kullanıldı,
- hangi agent çalıştı,
- sonuç neydi,
- güven seviyesi neydi,
- ne zaman tekrar kontrol edilmeli.

## 7.4. Karar hafızası

Her öneri veya ret kararı için;

- karar,
- nedenler,
- kullanılan kurallar,
- kaynaklar,
- güven seviyesi,
- kullanıcıya gösterilen açıklama

saklanmalıdır.

---

## 8. Raporlama yaklaşımı

Uygulama uzun raporları varsayılan olarak göstermemelidir. Önce özet, sonra ayrıntı yaklaşımı kullanılmalıdır.

Örnek günlük rapor:

> Bugünkü listenizde 11 ürün var. 7 ürün için uygun seçenek bulundu. 2 kampanya yarın sona eriyor. 1 ürün kara liste nedeniyle çıkarıldı. 1 ürün için fiyatın düşmesi beklenebilir.

Örnek dayanıklı tüketim raporu:

> Takip ettiğiniz televizyon hedef fiyatın altına düştü. Satıcı güvenilir, ancak kampanya banka kartı şartına bağlı. Aynı fiyat aralığında daha uzun garanti sunan bir alternatif de bulundu.

---

## 9. Bildirim yaklaşımı

Bildirim sistemi sessiz ve seçici olmalıdır.

Bildirim gönderilebilecek anlamlı olaylar:

- gerekli ürün için iyi fiyat oluşması,
- kampanyanın yakında bitmesi,
- resmî güvenlik kaydı bulunması,
- kullanıcının hedef fiyatının gerçekleşmesi,
- ortak listeye önemli ürün eklenmesi,
- alışveriş raporunun hazır olması,
- daha iyi alternatif bulunması,
- ürün formülünün değişmesi.

Bildirimler kullanıcıyı uygulamaya bağımlı hâle getirmemeli veya sürekli fiyat kontrolüne zorlamamalıdır.

---

## 10. Kapsam dışında veya sonraya bırakılan fikirler

Şimdilik kapsam dışında:

- mağaza içi raf ve koridor yönlendirmesi,
- güvenilir veri olmadan gerçek zamanlı stok garantisi,
- doğrulanmamış sağlık iddiaları,
- yalnızca LLM yorumuna dayalı güvenlik kararı,
- herkese açık sosyal yorum platformu,
- gereksiz özelliklerle yoğun ana ekran.

İleriki sürümlerde değerlendirilebilecek alanlar:

- anonim topluluk eğilimleri,
- daha gelişmiş ev stok yönetimi,
- teslimat ve online sipariş entegrasyonları,
- banka ve sadakat programı entegrasyonları,
- otomatik yeniden sipariş,
- gelişmiş bütçe ve tasarruf planlama.

---

## 11. Başlangıç ürün omurgası

İlk ürün omurgası dört ana deneyim etrafında kurulmalıdır:

1. **Alışveriş Listelerim**
   Günlük, haftalık, ortak aile ve uzun vadeli takip listeleri.

2. **Ürünü Tara**
   Barkod, içerik, besin değeri ve fiyat etiketinden anlık değerlendirme.

3. **Araştır ve Karar Ver**
   Broşür, fiyat geçmişi, güvenlik, içerik ve tercihler üzerinden öneri.

4. **Raporlar ve Alarmlar**
   Ne alınmalı, ne bekletilmeli, hangi kampanya bitiyor ve neden.

---

## 12. Sonraki dokümantasyon adımları

Uygulama iskeleti olgunlaştırıldıktan sonra aşağıdaki belgeler hazırlanmalıdır:

1. Ürün Gereksinimleri Dokümanı — PRD
2. Kullanıcı personalları ve temel senaryolar
3. Uçtan uca kullanıcı akışları
4. Bilgi mimarisi ve ekran haritası
5. Çok ajanlı harness mimarisi
6. Veri kaynakları ve güvenilirlik politikası
7. Ürün, fiyat, kampanya ve hafıza veri modeli
8. Puanlama ve öneri politikası
9. Bildirim ve alarm politikası
10. Gizlilik, güvenlik ve aile paylaşım modeli
11. MVP kapsamı ve sonraki sürümler
12. Test stratejisi ve kabul kriterleri
13. Teknik yığın ve uygulama planı
14. Sprint ve teslimat planı

---

## 13. Ürünün kısa tanımı

> Akıllı Alışveriş Asistanı; kullanıcının ihtiyaçlarını, ailesinin tercihlerini, ürün deneyimlerini, güvenlik ve içerik verilerini, güncel fiyatları ve kampanyaları birlikte değerlendirerek neyin, ne zaman, nereden ve neden alınması gerektiğini açıklayan çok ajanlı kişisel satın alma karar platformudur.
