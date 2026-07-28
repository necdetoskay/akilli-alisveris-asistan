# Title Tokenization and Field Extraction

## Token classes

The parser should distinguish:

```text
brand
product family
category phrase
size
package count
weight
volume
flavor
color
form
usage intent
promotion noise
retailer noise
```

## Examples

```text
52'li
52 li
52 adet
x52
```

All normalize to:

```text
package_count = 52
```

```text
1,5 kg
1500 g
3 x 500 g
```

Normalize to:

```text
net_quantity = 1500 g
```

## Noise removal

Typical removable fragments:

```text
kampanyalı
özel fiyat
avantaj paketi
hemen al
stoklarla sınırlı
```

Noise removal must never delete identity-bearing tokens such as:

```text
light
şekersiz
laktozsuz
külot
cırtlı
```

## Ambiguity

Ambiguous tokens remain evidence with confidence rather than being forced into a definitive value.
