import type { ExtractionRegion } from "./types.js";

export interface GridConfig {
  readonly columns: number;
  readonly rows: number;
  readonly overlapRatio: number;
}

/**
 * Splits an image of `width` x `height` into a grid of overlapping regions.
 * Each region is identified as `r<row>c<column>` with 1-based indices.
 */
export function generateRegions(
  width: number,
  height: number,
  config: GridConfig = { columns: 2, rows: 2, overlapRatio: 0.12 },
): ExtractionRegion[] {
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) {
    throw new Error("Image dimensions must be positive integers.");
  }
  if (!Number.isInteger(config.columns) || config.columns < 1) {
    throw new Error("Region columns must be a positive integer.");
  }
  if (!Number.isInteger(config.rows) || config.rows < 1) {
    throw new Error("Region rows must be a positive integer.");
  }
  if (
    !Number.isFinite(config.overlapRatio) ||
    config.overlapRatio < 0 ||
    config.overlapRatio >= 0.4
  ) {
    throw new Error("Region overlap ratio must be between 0 and 0.4.");
  }

  const cellWidth = width / config.columns;
  const cellHeight = height / config.rows;
  const overlapX = Math.round(cellWidth * config.overlapRatio);
  const overlapY = Math.round(cellHeight * config.overlapRatio);

  const regions: ExtractionRegion[] = [];
  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.columns; column += 1) {
      const left = Math.max(0, Math.floor(column * cellWidth) - overlapX);
      const top = Math.max(0, Math.floor(row * cellHeight) - overlapY);
      const right = Math.min(width, Math.ceil((column + 1) * cellWidth) + overlapX);
      const bottom = Math.min(height, Math.ceil((row + 1) * cellHeight) + overlapY);
      regions.push({
        id: `r${row + 1}c${column + 1}`,
        left,
        top,
        width: right - left,
        height: bottom - top,
      });
    }
  }
  return regions;
}

export function regionToJsonLd(region: ExtractionRegion): string {
  return JSON.stringify(region);
}
