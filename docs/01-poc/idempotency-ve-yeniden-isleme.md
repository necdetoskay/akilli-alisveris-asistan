# Idempotency ve Yeniden İşleme

| Alan | Değer |
|---|---|
| Document ID | POC-006 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| Bağımlılıklar | POC-001, POC-004 |
| Son Güncelleme | 2026-07-28 |

## 1. Amaç

Aynı kampanya kaynağının tekrar işlenmesinde mükerrer veya açıklanamayan farklı kayıt oluşmasını önlemek.

## 2. Kaynak Kimliği

Her kaynak için en az:

- source_uri
- retrieval_timestamp
- content_hash
- source_type
- source_version
- market
- campaign_period

saklanır.

`content_hash`, aynı içeriğin farklı URL veya dosya adıyla gelmesini tespit etmekte kullanılır.

## 3. İşleme Kimliği

Her pipeline çalışması:

- run_id
- source_id
- pipeline_version
- model_version
- prompt_version
- normalization_rules_version
- started_at
- completed_at
- status

taşır.

## 4. Idempotency Anahtarı

İlk POC için önerilen anahtar:

```text
content_hash + pipeline_version + processing_profile
```

Aynı anahtar tamamlanmışsa varsayılan davranış yeni kayıt üretmemektir.

## 5. Yeniden İşleme Türleri

### Retry

Aynı sürümle teknik hata sonrası tekrar deneme.

### Reprocess

Yeni pipeline, prompt, model veya kuralla yeniden işleme.

### Review Rebuild

Manuel düzeltmeler korunarak normalize çıktının yeniden oluşturulması.

## 6. Kayıt Politikası

Ham kaynak değişmez.

Yeni işleme sürümü:

- önceki sonucu silmez,
- yeni result version üretir,
- hangi sürümün aktif olduğunu işaretler,
- önceki sonuçla fark raporu oluşturur.

## 7. Mükerrerlik Kontrolü

Mükerrer adayları için:

- aynı source_id,
- aynı visual_region,
- aynı raw text fingerprint,
- aynı normalize ürün alanları

birlikte değerlendirilir.

## 8. Test Senaryoları

1. Aynı dosyayı iki kez yükleme
2. Aynı içeriği farklı dosya adıyla yükleme
3. Aynı kaynağı teknik hata sonrası retry
4. Yeni pipeline sürümüyle reprocess
5. Manuel düzeltilmiş kaydı yeniden işleme
6. Kısmen değişmiş yeni katalog sürümü

## 9. Başarı Kriteri

Aynı içerik ve aynı pipeline sürümü tekrar işlendiğinde:

- yeni kaynak kaydı oluşmaz,
- yeni ürün kayıtları oluşmaz,
- önceki sonuç değişmez,
- işlem sonucu idempotent hit olarak raporlanır.
