export function formatCurrency(value, currency) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: currency || "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function offerCardFields(offer) {
  return {
    retailer: offer.retailer_name ?? offer.retailer_code ?? "",
    productName: offer.product_name ?? "",
    meta: [offer.brand, offer.category, offer.variant, offer.quantity_raw_text]
      .filter(Boolean)
      .join(" · "),
    price: formatCurrency(offer.current_price, offer.currency),
    previousPrice: formatCurrency(offer.previous_price, offer.currency),
    dates: formatDateRange(offer.valid_from, offer.valid_until),
    verificationStatus: offer.verification_status ?? "extracted",
    needsReview: Boolean(offer.needs_review),
    brochureId: offer.brochure_id ?? "",
    brochureTitle: offer.brochure_title ?? "",
  };
}

export function formatDateRange(from, until) {
  const fromText = formatDate(from);
  const untilText = formatDate(until);
  if (!fromText && !untilText) return "";
  if (fromText && untilText) return `${fromText} – ${untilText}`;
  return fromText || untilText;
}

export function statusLabel(status) {
  const labels = {
    extracted: "Çıkarıldı",
    reviewed: "İncelendi",
    retailer_verified: "Doğrulandı",
  };
  return labels[status] ?? status;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
