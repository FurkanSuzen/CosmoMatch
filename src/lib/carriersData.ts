import carriersJson from "../assets/carriers.json";
import type {
  CarriersPayload,
  FlatJobOffer,
  JobOffer,
} from "../types/carriers";

type CarriersRoot = CarriersPayload & {
  platform?: { lastUpdated?: string };
};

const root = carriersJson as CarriersRoot;
const payload = root;

export function getJobFilterOptions(): CarriersPayload["filters"] {
  return payload.filters;
}

export const carriersMeta = {
  lastUpdated: root.platform?.lastUpdated,
};

export function getCarrierCategories(): { key: string; label: string }[] {
  return payload.categories;
}

export function categoryLabel(key: string): string {
  const row = payload.categories.find((c) => c.key === key);
  return row?.label ?? key;
}

/** Tüm şirket ilanları tek dizide */
export function getAllFlatJobs(): FlatJobOffer[] {
  return payload.organizations.flatMap((org) =>
    org.jobs.map((job) => ({
      ...job,
      orgBlockCountry: org.country,
    })),
  );
}

export type JobListFilters = {
  search: string;
  organization: string;
  country: string;
  categoryKey: string;
  status: string;
};

export function filterFlatJobs(
  jobs: FlatJobOffer[],
  f: JobListFilters,
): FlatJobOffer[] {
  const q = f.search.trim().toLowerCase();
  return jobs.filter((job) => {
    if (f.organization !== "all" && job.organization !== f.organization)
      return false;
    if (f.country !== "all" && job.orgBlockCountry !== f.country) return false;
    if (f.categoryKey !== "all" && job.category !== f.categoryKey) return false;
    if (f.status !== "all" && job.status !== f.status) return false;
    if (!q) return true;
    const hay = [
      job.title,
      job.organization,
      job.location.city,
      job.location.facility,
      ...job.tags,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

/** Profil yetenekleri ile ilan metninin kaba örtüşmesi (gösterim amaçlı). */
export function skillMatchPercent(userSkills: string[], job: JobOffer): number | null {
  const skills = userSkills.map((s) => s.trim().toLowerCase()).filter((s) => s.length >= 2);
  if (skills.length === 0) return null;

  const blob = [
    ...job.tags,
    ...job.requirements.technicalSkills,
    ...job.requirements.competencies,
    job.title,
  ]
    .join(" ")
    .toLowerCase();

  let hits = 0;
  for (const s of skills) {
    if (blob.includes(s)) hits++;
    else {
      const parts = s.split(/[\s/]+/).filter((p) => p.length >= 3);
      for (const p of parts) {
        if (blob.includes(p)) {
          hits++;
          break;
        }
      }
    }
  }

  const base = 42;
  const span = 57;
  const ratio = Math.min(1, hits / Math.max(1, skills.length));
  return Math.round(base + ratio * span);
}

export function formatDeadline(iso: string): string {
  const t = iso.trim();
  if (!t) return "Belirtilmemiş";
  const d = new Date(`${t}T12:00:00`);
  if (Number.isNaN(d.getTime())) return t;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
