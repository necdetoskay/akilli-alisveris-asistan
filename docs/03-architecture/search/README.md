# Hibrit ve Semantik Ürün Arama Mimarisi

**Belge Kodu:** ARCH-SEARCH-000
**Sürüm:** 1.0
**Durum:** Onaylandı

Bu bölüm, kullanıcının market diliyle yazdığı sorguları kanonik kategori, özellik, kullanım amacı ve hariç tutma kurallarına dönüştüren ürün arama mimarisini tanımlar.

Amaç yalnızca ürün başlığında geçen kelimeleri bulmak değildir. Sistem; `bebek bezi cırtlı`, `tost peyniri`, `gece sızdırmayan bez`, `renkliler için sıvı deterjan` gibi sorguları anlamlandırmalı, kesin ürün özelliklerini korumalı ve semantik olarak yakın fakat yanlış ürünleri elemelidir.

## Belgeler

1. [Hibrit semantik ürün araması](hybrid-semantic-product-search.md)
2. [Sorgu anlama ve niyet çıkarımı](query-understanding-and-intent-extraction.md)
3. [Kategori taksonomisi ve alias sözlüğü](category-taxonomy-and-aliases.md)
4. [Ürün özellik çıkarımı ve zenginleştirme](product-attribute-extraction.md)
5. [Sıralama ve sonuç açıklamaları](ranking-and-result-explanations.md)
6. [ADR-0005: PostgreSQL tabanlı hibrit arama](../adr/ADR-0005-postgresql-hybrid-search.md)

## Temel karar

Arama tek bir teknolojiye dayanmayacaktır. Sonuçlar aşağıdaki sinyallerin birlikte değerlendirilmesiyle üretilecektir:

- Tam ve yaklaşık metin eşleşmesi
- Kategori ve özellik filtreleri
- Alias ve eşanlamlı eşleşmeleri
- Semantik vektör benzerliği
- Kullanım amacı ve bağlamsal uyum
- Veri kalitesi ve ürün kimliği güveni
- Yeniden sıralama kuralları

## Güvenlik ilkesi

Semantik yakınlık, kesin ürün özelliklerinin yerine geçmez. Örneğin `cırtlı bez` sorgusunda `külot bez` semantik olarak yakın olsa bile kullanıcı niyetiyle çeliştiği için filtrelenebilir veya açıkça ayrı bir öneri grubunda gösterilebilir.
