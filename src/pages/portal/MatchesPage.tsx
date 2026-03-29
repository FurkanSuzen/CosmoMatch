import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { JobDetailModal } from "../../components/matches/JobDetailModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  categoryLabel,
  filterFlatJobs,
  formatDeadline,
  getAllFlatJobs,
  getCarrierCategories,
  getJobFilterOptions,
} from "../../lib/carriersData";
import {
  getStoredAccountPlan,
  planAllowsAiMatch,
  subscribeAccountPlan,
} from "../../lib/accountPlan";
import {
  fetchAiMatchScores,
  isAiMatchConfigured,
  resolveMatchPercent,
} from "../../lib/matchAi";
import { saveTopThreeFromAiScores } from "../../lib/topMatchesStorage";
import type { FlatJobOffer } from "../../types/carriers";

/** `?? []` her render'da yeni dizi yaratmayı önlemek için */
const NO_SKILLS: string[] = [];

type SortKey = "match" | "deadline" | "title" | "org";

function orgInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function deadlineSortKey(iso: string): number {
  const t = iso.trim();
  if (!t) return Number.POSITIVE_INFINITY;
  const ms = new Date(`${t}T12:00:00`).getTime();
  return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
}

function sortJobs(
  jobs: FlatJobOffer[],
  sort: SortKey,
  userSkills: string[],
  aiScores: Record<string, number> | null,
): FlatJobOffer[] {
  const copy = [...jobs];
  if (sort === "match") {
    copy.sort((a, b) => {
      const ma = resolveMatchPercent(userSkills, a, aiScores) ?? -1;
      const mb = resolveMatchPercent(userSkills, b, aiScores) ?? -1;
      return mb - ma;
    });
  } else if (sort === "deadline") {
    copy.sort(
      (a, b) => deadlineSortKey(a.applicationDeadline) - deadlineSortKey(b.applicationDeadline),
    );
  } else if (sort === "org") {
    copy.sort((a, b) =>
      a.organization.localeCompare(b.organization, "tr", { sensitivity: "base" }),
    );
  } else {
    copy.sort((a, b) =>
      a.title.localeCompare(b.title, "tr", { sensitivity: "base" }),
    );
  }
  return copy;
}

function JobCard({
  job,
  index,
  matchPercent,
  matchPending,
  onSelect,
}: {
  job: FlatJobOffer;
  index: number;
  matchPercent: number | null;
  /** AI skoru beklenirken */
  matchPending?: boolean;
  onSelect: () => void;
}) {
  const cat = categoryLabel(job.category);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition hover:border-violet-400/25 hover:shadow-[0_0_48px_-16px_rgba(139,92,246,0.35)]"
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-1 flex-col p-5 text-left"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/90 to-indigo-900 text-xs font-bold text-white shadow-lg shadow-violet-500/15">
            {orgInitials(job.organization)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {job.organization} · {cat}
            </p>
            <h2 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug tracking-tight text-white">
              {job.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {job.location.city}
              {job.location.country ? ` · ${job.location.country}` : ""}
            </p>
          </div>
          {matchPending ? (
            <span className="shrink-0 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-2 text-center">
              <span className="block text-[9px] font-semibold uppercase tracking-wide text-violet-200/80">
                AI
              </span>
              <span className="text-sm font-medium text-violet-200/90">···</span>
            </span>
          ) : matchPercent !== null ? (
            <span className="shrink-0 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-center">
              <span className="block text-[9px] font-semibold uppercase tracking-wide text-emerald-200/75">
                Eşleşme
              </span>
              <span className="text-sm font-bold tabular-nums text-emerald-300">
                {matchPercent}%
              </span>
            </span>
          ) : (
            <span className="shrink-0 self-start rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] text-slate-500">
              Yetenek ekleyin
            </span>
          )}
        </div>
        <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
          {job.salary.displayText}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
          {job.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto text-xs text-slate-500">
            Son başvuru: {formatDeadline(job.applicationDeadline)}
          </span>
        </div>
      </button>
    </motion.article>
  );
}

export function MatchesPage() {
  const { user } = useAuth();
  const userSkills = user?.skills ?? NO_SKILLS;
  const filterOpts = getJobFilterOptions();
  const allJobs = useMemo(() => getAllFlatJobs(), []);

  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [categoryKey, setCategoryKey] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("match");
  const [selected, setSelected] = useState<FlatJobOffer | null>(null);
  const [aiScores, setAiScores] = useState<Record<string, number> | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [accountPlan, setAccountPlan] = useState(() =>
    getStoredAccountPlan(user?.id),
  );

  useEffect(() => {
    setAccountPlan(getStoredAccountPlan(user?.id));
  }, [user?.id]);

  useEffect(() => subscribeAccountPlan(() => setAccountPlan(getStoredAccountPlan(user?.id))), [user?.id]);

  const aiPlanOk = planAllowsAiMatch(accountPlan);

  useEffect(() => {
    if (aiPlanOk) return;
    setAiScores(null);
    setAiStatus("idle");
  }, [aiPlanOk]);

  const filtered = useMemo(
    () =>
      filterFlatJobs(allJobs, {
        search,
        organization,
        country,
        categoryKey,
        status,
      }),
    [allJobs, search, organization, country, categoryKey, status],
  );

  const runAiMatch = useCallback(async () => {
    if (!aiPlanOk || !isAiMatchConfigured() || userSkills.length === 0) return;
    setAiStatus("loading");
    setAiScores(null);
    try {
      const scores = await fetchAiMatchScores(userSkills, allJobs);
      setAiScores(scores);
      setAiStatus("ok");
      saveTopThreeFromAiScores(allJobs, scores, userSkills.join("|"));
    } catch {
      setAiScores(null);
      setAiStatus("error");
    }
  }, [userSkills, allJobs, aiPlanOk]);

  const sorted = useMemo(
    () => sortJobs(filtered, sort, userSkills, aiScores),
    [filtered, sort, userSkills, aiScores],
  );

  const stats = useMemo(() => {
    const open = filtered.filter((j) => j.status === "Açık").length;
    const orgs = new Set(filtered.map((j) => j.organization)).size;
    return { total: filtered.length, open, orgs };
  }, [filtered]);

  const selectedMatch = useMemo(() => {
    if (!selected || userSkills.length === 0) return null;
    return resolveMatchPercent(userSkills, selected, aiScores);
  }, [selected, userSkills, aiScores]);

  const aiPending =
    isAiMatchConfigured() && userSkills.length > 0 && aiStatus === "loading";

  const aiMatchDisabled =
    !aiPlanOk ||
    !isAiMatchConfigured() ||
    userSkills.length === 0 ||
    aiStatus === "loading";

  return (
    <div className="flex flex-col gap-10 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-violet-950/[0.35] via-[#0a0f1c] to-indigo-950/[0.2] px-6 py-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_40px_100px_-40px_rgba(139,92,246,0.28)] sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-200/75">
            Akıllı eşleştirme
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Kurumsal iş teklifleri ve kariyer fırsatları
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Taşıyıcı ve üretici firmaların güncel pozisyonlarını tek ekranda görün.
            Varsayılan olarak hızlı metin örtüşmesi skoru gösterilir;{" "}
            <strong className="font-medium text-slate-300">
              AI ile eşleştir
            </strong>{" "}
            (Bireysel Premium) ile anlamsal uyum çalışır. En uygun 3 ilan panonuzda
            yerel olarak saklanır.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runAiMatch()}
              disabled={aiMatchDisabled}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {aiStatus === "loading" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI çalışıyor…
                </>
              ) : (
                <>AI ile eşleştir</>
              )}
            </button>
            {!aiPlanOk ? (
              <span className="text-xs text-slate-500">
                AI için{" "}
                <Link
                  to="/portal/profil"
                  className="font-medium text-violet-300 underline-offset-2 hover:underline"
                >
                  Profil → Bireysel Premium
                </Link>{" "}
                planını seçin.
              </span>
            ) : !isAiMatchConfigured() ? (
              <span className="text-xs text-slate-500">
                OpenAI anahtarı gerekir (<code className="rounded bg-white/5 px-1">VITE_OPENAI_API_KEY</code>)
              </span>
            ) : userSkills.length === 0 ? (
              <span className="text-xs text-slate-500">
                Önce profilde yetenek ekleyin
              </span>
            ) : null}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Listelenen pozisyon
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
                {stats.total}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Açık ilan
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-300/95">
                {stats.open}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Kurum (filtre sonucu)
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-violet-200/95">
                {stats.orgs}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {userSkills.length === 0 ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100/90">
          <strong className="font-semibold">İpucu:</strong> Profilde yeteneklerinizi
          eklediğinizde pozisyonlarla eşleşme yüzdesi hesaplanır.{" "}
          <Link
            to="/portal/profil"
            className="font-medium text-amber-200 underline-offset-2 hover:underline"
          >
            Profile git
          </Link>
        </div>
      ) : null}

      {aiPlanOk && isAiMatchConfigured() && userSkills.length > 0 ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            aiStatus === "error"
              ? "border-rose-500/25 bg-rose-500/[0.07] text-rose-100/95"
              : aiStatus === "loading"
                ? "border-violet-500/25 bg-violet-500/[0.07] text-violet-100/90"
                : aiStatus === "ok"
                  ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-100/90"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400"
          }`}
        >
          {aiStatus === "loading" ? (
            <>
              <strong className="font-semibold">AI eşleşme:</strong> Tüm ilanlar
              profilinizle karşılaştırılıyor; en iyi 3 sonuç panoya kaydedilecek.
            </>
          ) : aiStatus === "error" ? (
            <>
              <strong className="font-semibold">AI kullanılamadı.</strong> Ağ veya
              anahtar hatası; metin tabanlı skor kullanılıyor.{" "}
              <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
                VITE_OPENAI_API_KEY
              </code>
            </>
          ) : aiStatus === "ok" ? (
            <>
              <strong className="font-semibold">AI skorları hazır.</strong> Liste ve
              sıralama güncellendi; öneriler ana sayfaya yazıldı .
            </>
          ) : (
            <>
              <strong className="font-semibold">Hızlı skor:</strong> Kartlarda metin
              örtüşmesi kullanılıyor. Anlamsal AI skoru için{" "}
              <strong className="text-slate-300">AI ile eşleştir</strong> düğmesine
              basın.
            </>
          )}
        </div>
      ) : userSkills.length > 0 && !aiPlanOk ? (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.07] px-4 py-3 text-sm text-violet-100/90">
          <strong className="font-semibold">AI eşleşme:</strong> Şirket veya
          Yatırımcı planında anlamsal skor kapalıdır.{" "}
          <Link
            to="/portal/profil"
            className="font-medium text-white underline-offset-2 hover:underline"
          >
            Profilde Bireysel Premium
          </Link>{" "}
          seçerek açabilirsiniz (yalnızca arayüz seçimi).
        </div>
      ) : userSkills.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
          <strong className="font-medium text-slate-300">Gelişmiş eşleşme:</strong>{" "}
          Ortam değişkenine{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs text-slate-300">
            VITE_OPENAI_API_KEY
          </code>{" "}
          ekleyerek yapay zeka ile anlamsal uyum skoru alabilirsiniz.
        </div>
      ) : null}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <label className="block max-w-xl">
            <span className="sr-only">Ara</span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pozisyon, şehir, etiket…"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-400/35 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-400/40 sm:text-sm"
            >
              <option value="all">Tüm kurumlar</option>
              {filterOpts.organizations.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-400/40 sm:text-sm"
            >
              <option value="all">Tüm ülkeler</option>
              {filterOpts.countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-400/40 sm:text-sm"
            >
              <option value="all">Tüm kategoriler</option>
              {getCarrierCategories().map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <span>Durum</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-400/40"
            >
              <option value="all">Tümü</option>
              {filterOpts.statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <span>Sırala</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-400/40"
            >
              <option value="match">Eşleşme (yüksek)</option>
              <option value="deadline">Son başvuru (yakın)</option>
              <option value="title">Başlık (A–Z)</option>
              <option value="org">Kurum (A–Z)</option>
            </select>
          </label>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">Sonuç yok</p>
          <p className="mt-2 text-sm text-slate-500">
            Filtreleri veya aramayı gevşetin.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              index={i}
              matchPercent={resolveMatchPercent(userSkills, job, aiScores)}
              matchPending={aiPending}
              onSelect={() => setSelected(job)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected ? (
          <JobDetailModal
            key={selected.id}
            job={selected}
            matchPercent={selectedMatch}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
