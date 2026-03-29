import type { FlatJobOffer, JobOffer } from "../types/carriers";
import { skillMatchPercent } from "./carriersData";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY ?? "";
const model = import.meta.env.VITE_OPENAI_MODEL ?? "gpt-4o-mini";
const baseUrl = (
  import.meta.env.VITE_OPENAI_BASE_URL ?? "https://api.openai.com/v1"
).replace(/\/$/, "");

/** İstemci anahtarı üretimde önerilmez; tercihen backend proxy kullanın. */
export function isAiMatchConfigured(): boolean {
  return apiKey.length > 0;
}

type CompactJob = {
  id: string;
  title: string;
  organization: string;
  category: string;
  tags: string[];
  technicalSkills: string[];
  competencies: string[];
  education: string[];
};

function compactJob(job: FlatJobOffer): CompactJob {
  return {
    id: job.id,
    title: job.title,
    organization: job.organization,
    category: job.category,
    tags: job.tags.slice(0, 10),
    technicalSkills: job.requirements.technicalSkills.slice(0, 14),
    competencies: job.requirements.competencies.slice(0, 8),
    education: job.requirements.education.slice(0, 6),
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function parseScoresJson(text: string): Record<string, number> {
  const trimmed = text.trim();
  const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = block ? block[1]!.trim() : trimmed;
  const parsed = JSON.parse(raw) as { scores?: { id: string; score: number }[] };
  const out: Record<string, number> = {};
  if (!Array.isArray(parsed.scores)) return out;
  for (const row of parsed.scores) {
    if (typeof row.id !== "string" || typeof row.score !== "number") continue;
    const n = Math.round(row.score);
    out[row.id] = Math.max(0, Math.min(100, n));
  }
  return out;
}

async function scoreBatch(
  userSkills: string[],
  jobs: FlatJobOffer[],
  signal: AbortSignal | undefined,
): Promise<Record<string, number>> {
  const compact = jobs.map(compactJob);

  const system = `Sen uzay, havacılık ve yüksek teknoloji sektörlerinde kariyer eşleştirme uzmanısın.
Kullanıcının profil yetenekleri (kısa etiketler) ile iş ilanlarını karşılaştır.
Değerlendirmede:
- Tam kelime eşleşmesi arama; anlamsal uyum, transfer edilebilir beceri ve ilgili teknoloji alanlarını düşün.
- Kullanıcının etiketleri geniş veya genel olabilir; ilanın gerektirdiği uzmanlıkla mantıksal bağ kur.
- Eğitim ve dil gereksinimlerini ikincil kriter olarak ele al (yetenek uyumu birincil).
Her ilan için 0–100 arası tek bir tam sayı üret: 100 neredeyse ideal aday, 0 belirgin uyumsuzluk.
Yanıt SADECE geçerli JSON: {"scores":[{"id":"ilan-id","score":72}, ...]} — başka metin yok.`;

  const user = `Kullanıcı profil yetenekleri (etiketler):\n${JSON.stringify(userSkills, null, 0)}\n\nDeğerlendirilecek ilanlar:\n${JSON.stringify(compact, null, 0)}\n\nHer ilan id için bir skor ver; tüm id'leri kapsa.`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `OpenAI ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Boş yanıt");
  return parseScoresJson(content);
}

const BATCH = 14;

/**
 * Profil yetenekleri ile ilanlar için OpenAI tabanlı 0–100 skorlar.
 * İlan çoksa birkaç istekte gruplar.
 */
export async function fetchAiMatchScores(
  userSkills: string[],
  jobs: FlatJobOffer[],
  signal?: AbortSignal,
): Promise<Record<string, number>> {
  if (!isAiMatchConfigured() || userSkills.length === 0 || jobs.length === 0) {
    return {};
  }

  const batches = chunk(jobs, BATCH);
  const merged: Record<string, number> = {};

  for (const batch of batches) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const part = await scoreBatch(userSkills, batch, signal);
    Object.assign(merged, part);
  }

  return merged;
}

/** Sıralama / kart için birleşik skor: önce AI, yoksa metin tabanlı sezgisel skor. */
export function resolveMatchPercent(
  userSkills: string[],
  job: JobOffer,
  aiScores: Record<string, number> | null,
): number | null {
  if (userSkills.length === 0) return null;
  const ai = aiScores?.[job.id];
  if (typeof ai === "number") return ai;
  return skillMatchPercent(userSkills, job);
}
