import { categoryLabel } from "./carriersData";
import type { FlatJobOffer } from "../types/carriers";

export const TOP_MATCHES_UPDATED_EVENT = "cosmomatch:top-matches-updated";

const STORAGE_KEY = "cosmomatch.topMatches.v1";

export type StoredTopMatchesPayload = {
  version: 1;
  /** Profil yeteneklerinin sıralı birleşimi — değişince kayıt “eski” sayılır */
  skillsKey: string;
  savedAt: string;
  items: {
    id: string;
    score: number;
    title: string;
    organization: string;
    categoryLabel: string;
  }[];
};

export function getStoredTopMatches(): StoredTopMatchesPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredTopMatchesPayload;
    if (data.version !== 1 || !Array.isArray(data.items)) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * AI skor haritasına göre en yüksek 3 ilanı kaydeder (token tekrarı yok; dashboard okur).
 */
export function saveTopThreeFromAiScores(
  jobs: FlatJobOffer[],
  scores: Record<string, number>,
  skillsKey: string,
): void {
  const ranked = jobs
    .map((j) => ({ job: j, score: scores[j.id] }))
    .filter((x): x is { job: FlatJobOffer; score: number } => typeof x.score === "number")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const payload: StoredTopMatchesPayload = {
    version: 1,
    skillsKey,
    savedAt: new Date().toISOString(),
    items: ranked.map(({ job, score }) => ({
      id: job.id,
      score,
      title: job.title,
      organization: job.organization,
      categoryLabel: categoryLabel(job.category),
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(TOP_MATCHES_UPDATED_EVENT));
}
