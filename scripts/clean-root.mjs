import { rm } from "node:fs/promises";

const paths = [".turbo", "coverage", "playwright-report", "test-results"];

await Promise.all(
  paths.map((path) =>
    rm(path, {
      force: true,
      recursive: true
    }),
  ),
);
