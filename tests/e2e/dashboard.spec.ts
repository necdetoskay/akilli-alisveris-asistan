import { expect, test } from "@playwright/test";

test("dashboard renders live data sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h1")).toContainText("Akıllı Alışveriş Asistanı");
  await expect(page.locator(".badge")).toContainText("Canlı Veri");
});

test("dashboard shows the four sections with real offers", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("h2", { hasText: "Bu Haftanın Fırsatları" })).toBeVisible();
  await expect(page.locator("h2", { hasText: "Yakında Başlayacak İndirimler" })).toBeVisible();
  await expect(page.locator("h2", { hasText: "Son Eklenen Broşürler" })).toBeVisible();

  const cards = page.locator(".offer-card");
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

test("retailer names render without mojibake", async ({ page }) => {
  await page.goto("/");

  const retailerNames = page.locator(".offer-card .retailer");
  const count = await retailerNames.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i += 1) {
    const text = (await retailerNames.nth(i).textContent()) ?? "";
    expect(text).not.toContain("?");
  }
});

test("offer card links to brochure view", async ({ page }) => {
  await page.goto("/");

  const link = page.locator("a.brochure-link").first();
  await expect(link).toBeVisible();
  await link.click();

  await expect(page).toHaveURL(/#\/brochures\//);
  await expect(page.locator(".brochure-header h2")).toBeVisible();
});

test("brochure view shows page thumbnails and opens lightbox", async ({ page }) => {
  await page.goto("/");
  const link = page.locator("a.brochure-link").first();
  await link.click();

  await expect(page.locator("h3", { hasText: "Sayfalar" })).toBeVisible();
  await expect(page.locator("h3", { hasText: "Ürünler" })).toBeVisible();

  const thumb = page.locator(".page-thumb img").first();
  await expect(thumb).toBeVisible();
  const src = await thumb.getAttribute("src");
  expect(src).toMatch(/^\/assets\/.+\/content$/);

  await thumb.click();
  await expect(page.locator("#lightbox.open")).toBeVisible();
  await expect(page.locator("#lightbox-img")).toHaveAttribute("src", src ?? "");

  await page.locator("#lightbox-close").click();
  await expect(page.locator("#lightbox.open")).toHaveCount(0);
});

test("asset content endpoint serves original image", async ({ request }) => {
  const dashboard = await request.get("/dashboard");
  const body = await dashboard.json();

  const withAsset = body.recent_brochures?.find(
    (offer) => offer.asset_storage_key !== null && offer.asset_storage_key !== undefined,
  );

  if (withAsset) {
    const response = await request.get(`/assets/${withAsset.asset_storage_key}/content`);
    expect([200]).toContain(response.status());
  }
});
