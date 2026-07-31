const turkishMonths: ReadonlyArray<readonly [string, number]> = [
  ["ocak", 1],
  ["şubat", 2],
  ["mart", 3],
  ["nisan", 4],
  ["mayıs", 5],
  ["mayis", 5],
  ["haziran", 6],
  ["temmuz", 7],
  ["ağustos", 8],
  ["agustos", 8],
  ["eylül", 9],
  ["eylul", 9],
  ["ekim", 10],
  ["kasım", 11],
  ["kasim", 11],
  ["aralık", 12],
  ["aralik", 12],
];

const monthAlternation = turkishMonths
  .map(([name]) => name)
  .join("|");

const dateInTextPattern = new RegExp(
  `\\b(\\d{1,2})\\s+(${monthAlternation})\\s+(\\d{4})\\b`,
  "i",
);

/**
 * Extracts a "9 Ağustos 2026" style Turkish date from arbitrary text.
 * Returns null when no unambiguous date is present.
 */
export function parseTurkishDate(text: string): Date | null {
  const match = dateInTextPattern.exec(text);
  if (!match) return null;

  const day = Number(match[1]);
  const monthEntry = turkishMonths.find(([name]) => name === match[2]?.toLowerCase());
  if (!monthEntry) return null;
  const year = Number(match[3]);

  if (day < 1 || day > 31 || year < 2000 || year > 2100) return null;

  const date = new Date(Date.UTC(year, monthEntry[1] - 1, day));
  // Guard against invalid day/month combinations such as 31 Şubat.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== monthEntry[1] - 1) {
    return null;
  }
  return date;
}
