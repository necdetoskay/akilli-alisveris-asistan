import { expect, test } from "@playwright/test";

test("API health endpoint is reachable", async ({ request }) => {
  const response = await request.get("/health");

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({
    service: "api",
    status: "ok",
  });
});

test("unknown endpoint returns safe problem details", async ({ request }) => {
  const response = await request.get("/unknown");

  expect(response.status()).toBe(404);
  await expect(response.json()).resolves.toEqual({
    status: 404,
    title: "Not Found",
    type: "about:blank",
  });
});
