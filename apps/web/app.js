import { escapeHtml, formatDate, offerCardFields, statusLabel } from "./format.js";

const app = document.getElementById("app");

function setSpinner(on) {
  const button = document.getElementById("refresh-button");
  if (button) button.disabled = on;
}

function showBanner(message) {
  const banner = document.getElementById("error-banner");
  if (!banner) return;
  banner.textContent = message;
  banner.classList.remove("hidden");
}

function hideBanner() {
  const banner = document.getElementById("error-banner");
  if (banner) banner.classList.add("hidden");
}

function offerCard(offer) {
  const fields = offerCardFields(offer);
  const reviewTag = fields.needsReview
    ? `<span class="status-tag review">İnceleme gerekli</span>`
    : "";
  const previous = fields.previousPrice
    ? `<span class="previous-price">${escapeHtml(fields.previousPrice)}</span>`
    : "";
  const brochureLink = fields.brochureId
    ? `<a class="brochure-link" href="#/brochures/${encodeURIComponent(fields.brochureId)}">Broşürü Görüntüle →</a>`
    : "";

  return `
    <article class="offer-card">
      <span class="retailer">${escapeHtml(fields.retailer)}</span>
      <div class="product-name">${escapeHtml(fields.productName)}</div>
      ${fields.meta ? `<div class="product-meta">${escapeHtml(fields.meta)}</div>` : ""}
      <div class="price-row">
        <span class="price">${escapeHtml(fields.price)}</span>
        ${previous}
      </div>
      ${fields.dates ? `<div class="dates">${escapeHtml(fields.dates)}</div>` : ""}
      <div class="footer">
        <span class="status-tag">${escapeHtml(statusLabel(fields.verificationStatus))}</span>
        ${reviewTag}
        ${brochureLink}
      </div>
    </article>
  `;
}

function renderSection(title, offers, emptyText) {
  if (!offers || offers.length === 0) {
    return `
      <section class="dashboard-section">
        <h2>${escapeHtml(title)}</h2>
        <div class="empty-state">${escapeHtml(emptyText)}</div>
      </section>
    `;
  }
  return `
    <section class="dashboard-section">
      <h2>${escapeHtml(title)} <span class="count">${offers.length}</span></h2>
      <div class="product-grid">${offers.map(offerCard).join("")}</div>
    </section>
  `;
}

function renderDashboard(summary) {
  app.innerHTML = [
    renderSection("Bu Haftanın Fırsatları", summary.this_week, "Bu hafta için fırsat yok."),
    renderSection("Yakında Başlayacak İndirimler", summary.upcoming, "Yaklaşan indirim yok."),
    renderSection(
      "Süresi Dolmak Üzere Olanlar",
      summary.expiring_soon,
      "Süresi dolmak üzere olan ürün yok.",
    ),
    renderSection("Son Eklenen Broşürler", summary.recent_brochures, "Henüz broşür yok."),
  ].join("");
}

async function loadDashboard() {
  hideBanner();
  setSpinner(true);
  try {
    const response = await fetch("/dashboard");
    if (!response.ok) {
      throw new Error(`Dashboard API yanıtı: ${response.status}`);
    }
    const summary = await response.json();
    renderDashboard(summary);
  } catch (error) {
    showBanner(`Dashboard yüklenemedi: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    setSpinner(false);
  }
}

function brochurePageCard(page) {
  const assetId = page.original_asset_id ?? "";
  const contentUrl = assetId ? `/assets/${encodeURIComponent(assetId)}/content` : "";
  const thumb = contentUrl
    ? `<img src="${contentUrl}" alt="Sayfa ${page.page_number}" loading="lazy" data-lightbox="${contentUrl}" />`
    : `<div class="empty-state">Görsel yok</div>`;
  return `
    <figure class="page-thumb" data-lightbox-open="${escapeHtml(contentUrl)}">
      ${thumb}
      <figcaption class="page-label">Sayfa ${page.page_number}</figcaption>
    </figure>
  `;
}

function renderBrochure(brochure, pages, offers) {
  const title = brochure.title ?? "Broşür";
  const meta = [
    brochure.valid_from ? formatDate(brochure.valid_from) : "",
    brochure.valid_until ? `→ ${formatDate(brochure.valid_until)}` : "",
    brochure.content_source_url
      ? `<a href="${escapeHtml(brochure.content_source_url)}" target="_blank" rel="noopener">Kaynak</a>`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const pageGrid =
    pages && pages.length > 0
      ? `<div class="page-grid">${pages.map(brochurePageCard).join("")}</div>`
      : `<div class="empty-state">Bu broşürün sayfası yok.</div>`;

  const offersGrid =
    offers && offers.length > 0
      ? `<div class="product-grid">${offers.map(offerCard).join("")}</div>`
      : `<div class="empty-state">Bu broşürde ürün bulunamadı.</div>`;

  app.innerHTML = `
    <section class="brochure-header">
      <a href="#/">← Dashboard</a>
      <h2>${escapeHtml(title)}</h2>
      <div class="meta">${meta}</div>
    </section>
    <h3>Sayfalar</h3>
    ${pageGrid}
    <h3>Ürünler</h3>
    ${offersGrid}
    <div class="lightbox" id="lightbox">
      <button class="close" id="lightbox-close">×</button>
      <img id="lightbox-img" alt="" />
    </div>
  `;

  attachLightbox();
}

function attachLightbox() {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-img");
  const closeButton = document.getElementById("lightbox-close");

  const open = (url) => {
    if (!lightbox || !image || !url) return;
    image.src = url;
    lightbox.classList.add("open");
  };

  const close = () => lightbox?.classList.remove("open");

  document.querySelectorAll("[data-lightbox-open]").forEach((element) => {
    element.addEventListener("click", () => {
      const url = element.getAttribute("data-lightbox-open") ?? "";
      open(url);
    });
  });

  document.querySelectorAll("[data-lightbox]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      const url = element.getAttribute("data-lightbox") ?? "";
      open(url);
    });
  });

  closeButton?.addEventListener("click", close);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
}

async function loadBrochure(brochureId) {
  hideBanner();
  setSpinner(true);
  try {
    const brochureResponse = await fetch(`/brochures/${encodeURIComponent(brochureId)}`);
    if (!brochureResponse.ok) {
      throw new Error("Broşür yüklenemedi");
    }
    const brochureData = await brochureResponse.json();
    renderBrochure(brochureData.brochure, brochureData.pages, brochureData.offers);
  } catch (error) {
    showBanner(`Broşür yüklenemedi: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    setSpinner(false);
  }
}

function handleRoute() {
  const hash = window.location.hash;
  const brochureMatch = /^#\/brochures\/([^/]+)$/.exec(hash);
  if (brochureMatch && brochureMatch[1]) {
    void loadBrochure(decodeURIComponent(brochureMatch[1]));
    return;
  }
  void loadDashboard();
}

window.addEventListener("hashchange", handleRoute);

const refreshButton = document.getElementById("refresh-button");
refreshButton?.addEventListener("click", handleRoute);

handleRoute();

export { offerCard, renderDashboard };
