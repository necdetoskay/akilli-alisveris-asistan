# Alert Explainability and Message Content

## Required content

An alert should explain:

```text
what changed
old price
new price
absolute and percentage difference
retailer
promotion conditions
price freshness
comparison basis
why the alert was triggered
```

## Example

```text
Takip ettiğiniz ürün 549,90 TL'den 489,90 TL'ye düştü.
Düşüş: 60,00 TL (%10,9)
Mağaza: Örnek Market
Bu fiyat sadakat kartı gerektirmiyor.
Son kontrol: 20 dakika önce.
```

## Historical-low example

```text
Bu ürün, takip başladığından beri gördüğümüz en düşük fiyata indi:
429,90 TL.
```

## Uncertainty

When history is limited:

```text
Son 30 günlük verilerimize göre düşük fiyat.
Daha eski fiyat geçmişi mevcut değil.
```
