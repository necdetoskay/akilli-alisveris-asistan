import type { CatalogueCandidate } from "@akilli-alisveris/source";

export interface CatalogueSelection {
  readonly active: CatalogueCandidate | null;
  readonly upcoming: CatalogueCandidate | null;
}

function validDate(candidate: CatalogueCandidate): Date | null {
  return candidate.validFrom instanceof Date && !Number.isNaN(candidate.validFrom.getTime())
    ? candidate.validFrom
    : null;
}

/**
 * Chooses the currently active catalogue (latest valid_from <= now) and the
 * nearest upcoming catalogue (earliest valid_from > now). Candidates without a
 * parseable date are ignored unless no dated candidate exists, in which case
 * the first undated candidate is used as the active fallback.
 */
export function selectTargetCatalogues(
  candidates: readonly CatalogueCandidate[],
  now: Date = new Date(),
): CatalogueSelection {
  const dated = candidates
    .map((candidate) => ({ candidate, date: validDate(candidate) }))
    .filter((entry): entry is { candidate: CatalogueCandidate; date: Date } => entry.date !== null)
    .sort((left, right) => left.date.getTime() - right.date.getTime());

  if (dated.length === 0) {
    const fallback = candidates[0] ?? null;
    return { active: fallback, upcoming: null };
  }

  let active: CatalogueCandidate | null = null;
  let upcoming: CatalogueCandidate | null = null;

  for (const entry of dated) {
    if (entry.date.getTime() <= now.getTime()) {
      active = entry.candidate;
    } else if (upcoming === null) {
      upcoming = entry.candidate;
    }
  }

  return { active, upcoming };
}
