# Domain Foundation

| Alan | Değer |
|---|---|
| Document ID | DOM-000 |
| Sürüm | 1.0 |
| Durum | Onaylandı |
| EOS Sürümü | EOS v1.0 |
| Son Güncelleme | 2026-07-28 |

## Amaç

Bu klasör, kampanya kaynaklarından alınan ham verinin hangi domain kavramlarına dönüştürüleceğini tanımlar.

POC'un en kritik domain problemi **Product Identity**'dir. Aynı gerçek ürün farklı kaynaklarda farklı metinlerle görünebilir; buna karşılık benzer görünen iki kayıt gerçekte farklı varyant veya paket olabilir.

## Doküman Haritası

- [Ubiquitous Language](ubiquitous-language.md)
- [Product Identity Model](product-identity-model.md)
- [Domain Entities and Value Objects](domain-entities-and-value-objects.md)
- [Campaign Offer Model](campaign-offer-model.md)
- [Normalization Model](normalization-model.md)
- [Matching Lifecycle](matching-lifecycle.md)
- [Domain Invariants](domain-invariants.md)

## Temel Ayrım

```text
Source
  └── Observation
        ├── Observed Product
        └── Observed Offer
               ↓ normalize / match
Product Family
  └── Product Variant
        └── Offer
```

Ham gözlem, canonical ürün ve kampanya teklifi aynı şey değildir.
