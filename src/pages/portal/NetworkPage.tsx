import { AppwriteException } from "appwrite";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AccountRoleBadge } from "../../components/portal/AccountRoleBadge";
import { useAuth } from "../../contexts/AuthContext";
import { isUsersDbConfigured, listUsersFromDb } from "../../lib/usersDb";
import type { User } from "../../types/user";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return v;
}

type SkillChip = { label: string; count: number };

function buildSkillChips(users: User[], limit: number): SkillChip[] {
  const counts = new Map<string, { display: string; n: number }>();
  for (const u of users) {
    for (const raw of u.skills) {
      const t = raw.trim();
      if (!t) continue;
      const key = t.toLowerCase();
      const prev = counts.get(key);
      if (prev) prev.n += 1;
      else counts.set(key, { display: t, n: 1 });
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map((x) => ({ label: x.display, count: x.n }));
}

function NetworkMemberCard({
  person,
  index,
  isSelf,
}: {
  person: User;
  index: number;
  isSelf: boolean;
}) {
  const tags = person.skills.slice(0, 8);
  const extra = person.skills.length - tags.length;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ delay: 0.04 * Math.min(index, 12), duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.015] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_24px_48px_-24px_rgba(0,0,0,0.5)] backdrop-blur-xl transition duration-300 hover:border-teal-400/20 hover:shadow-[0_28px_64px_-28px_rgba(45,212,191,0.18)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-teal-400/12 via-indigo-500/8 to-transparent blur-2xl transition duration-500 group-hover:from-teal-400/18" />
      <div className="relative flex gap-4">
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/35 via-slate-800 to-indigo-950 text-base font-bold tracking-tight text-white shadow-lg shadow-teal-500/10 ring-1 ring-white/10 sm:h-16 sm:w-16">
            {initials(person.name)}
          </div>
          {isSelf ? (
            <span className="absolute -bottom-1 -right-1 rounded-md border border-indigo-400/40 bg-indigo-600/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-lg">
              Siz
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1.5">
            <h2 className="min-w-0 truncate text-base font-semibold tracking-tight text-white sm:text-lg">
              {person.name}
            </h2>
            <AccountRoleBadge userId={person.id} />
          </div>
          <p className="mt-1 truncate text-sm text-teal-200/80">
            {person.company?.trim() ? person.company : "Kurum belirtilmedi"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {person.nationality ? (
              <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-400">
                {person.nationality}
              </span>
            ) : null}
            {person.skills.length > 0 ? (
              <span className="rounded-lg border border-white/[0.06] bg-black/20 px-2 py-0.5 text-[11px] tabular-nums text-slate-500">
                {person.skills.length} yetenek
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="relative mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-4">
          {tags.map((s) => (
            <span
              key={s}
              className="max-w-full truncate rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300"
              title={s}
            >
              {s}
            </span>
          ))}
          {extra > 0 ? (
            <span className="rounded-md border border-dashed border-white/10 px-2 py-1 text-[11px] text-slate-500">
              +{extra}
            </span>
          ) : null}
        </div>
      ) : (
        <p className="relative mt-5 border-t border-white/[0.06] pt-4 text-xs italic text-slate-600">
          Henüz yetenek eklenmemiş.
        </p>
      )}

      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-4">
        <a
          href={`mailto:${person.email}`}
          className="min-w-0 truncate text-xs text-slate-500 transition hover:text-teal-300/90 group-hover:text-slate-400"
        >
          {person.email}
        </a>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-600 opacity-0 transition group-hover:opacity-100">
          İletişim
        </span>
      </div>
    </motion.article>
  );
}

export function NetworkPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const debouncedSearch = useDebounced(search, 240);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isUsersDbConfigured()) {
        if (!cancelled) {
          setUsers([]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const list = await listUsersFromDb();
        if (!cancelled) setUsers(list);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof AppwriteException
              ? e.message
              : "Kullanıcılar yüklenemedi.";
          setError(msg);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const nameFiltered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      if (u.name.toLowerCase().includes(q)) return true;
      if (u.email.toLowerCase().includes(q)) return true;
      if (u.company?.toLowerCase().includes(q)) return true;
      if (u.nationality?.toLowerCase().includes(q)) return true;
      return u.skills.some((s) => s.toLowerCase().includes(q));
    });
  }, [users, debouncedSearch]);

  const skillChips = useMemo(() => buildSkillChips(nameFiltered, 36), [nameFiltered]);

  const filteredMembers = useMemo(() => {
    let list: User[];
    if (selectedSkills.length === 0) list = nameFiltered;
    else {
      const want = new Set(selectedSkills.map((s) => s.toLowerCase()));
      list = nameFiltered.filter((u) =>
        u.skills.some((sk) => want.has(sk.toLowerCase())),
      );
    }
    const copy = [...list];
    copy.sort((a, b) => a.name.localeCompare(b.name, "tr", { sensitivity: "base" }));
    return copy;
  }, [nameFiltered, selectedSkills]);

  function toggleSkill(label: string) {
    const key = label.toLowerCase();
    setSelectedSkills((prev) => {
      const has = prev.some((p) => p.toLowerCase() === key);
      if (has) return prev.filter((p) => p.toLowerCase() !== key);
      return [...prev, label];
    });
  }

  function clearSkillFilters() {
    setSelectedSkills([]);
  }

  const dbReady = isUsersDbConfigured();

  return (
    <div className="flex flex-col gap-10 pb-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-teal-950/[0.45] via-[#0a0f1c] to-indigo-950/[0.35] px-6 py-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_40px_120px_-40px_rgba(20,184,166,0.22)] sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-teal-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-600/14 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/2 h-px w-[120%] -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div className="relative max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-200/75">
            Keşfet · Bağlantı kur
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            CosmoMatch network
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Uzay ekosistemindeki profesyonelleri isim veya kuruma göre arayın;
            yetenek etiketleriyle daraltın. Şirket ve yatırımcı hesapları rozetle
            görünür.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex min-h-[52px] min-w-[200px] flex-1 items-center gap-3 rounded-2xl border border-white/[0.1] bg-black/25 px-4 py-3 shadow-inner backdrop-blur-md sm:min-w-[280px]">
              <svg
                className="h-5 w-5 shrink-0 text-teal-400/70"
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
                placeholder="İsim, e-posta, kurum, uyruk veya yetenek…"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none ring-0 placeholder:text-slate-600"
                aria-label="Network araması"
              />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
              <span className="tabular-nums text-lg font-semibold text-white">
                {loading ? "—" : filteredMembers.length}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                eşleşen
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {!dbReady && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.08] px-5 py-4 text-sm text-amber-100/90"
        >
          <strong className="font-semibold">Önizleme:</strong> Kullanıcı
          dizinini görmek için Appwrite veritabanı ve{" "}
          <code className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-xs">
            VITE_APPWRITE_USERS_COLLECTION_ID
          </code>{" "}
          tanımlanmalıdır.
        </motion.div>
      )}

      {error ? (
        <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-200/90">
          {error}
        </p>
      ) : null}

      {dbReady && !loading && !error && users.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-white/[0.07] bg-[#060a12]/80 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Yetenek filtresi
              </h2>
              <p className="mt-1 max-w-xl text-xs text-slate-500">
                Aşağıdaki etiketler mevcut listeye göre sıralanır. Birden fazla
                seçtiğinizde,{" "}
                <span className="text-slate-400">en az birini</span> taşıyan
                profiller listelenir.
              </p>
            </div>
            {selectedSkills.length > 0 ? (
              <button
                type="button"
                onClick={clearSkillFilters}
                className="shrink-0 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/[0.15] hover:bg-white/[0.07]"
              >
                Filtreleri temizle
              </button>
            ) : null}
          </div>

          {skillChips.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Aramanızla eşleşen profilde yetenek etiketi yok.
            </p>
          ) : (
            <div className="mt-5 flex max-h-[200px] flex-wrap gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {skillChips.map(({ label, count }) => {
                const active = selectedSkills.some(
                  (s) => s.toLowerCase() === label.toLowerCase(),
                );
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleSkill(label)}
                    className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-[11px] font-medium transition ${
                      active
                        ? "border-teal-400/45 bg-teal-500/20 text-teal-100 shadow-[0_0_20px_-8px_rgba(45,212,191,0.45)]"
                        : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-slate-300"
                    }`}
                  >
                    <span className="truncate">{label}</span>
                    <span
                      className={`shrink-0 tabular-nums ${active ? "text-teal-200/80" : "text-slate-600"}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.section>
      ) : null}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[280px] animate-pulse rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-white/[0.02]"
            />
          ))}
        </div>
      ) : null}

      {!loading && !error && users.length === 0 && dbReady ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.02] px-8 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 text-2xl opacity-60">
            ◇
          </div>
          <p className="mt-6 text-lg font-medium text-slate-300">Henüz üye yok</p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Veritabanında kayıtlı profil bulunamadı veya listeleme izniniz kısıtlı
            olabilir.
          </p>
        </div>
      ) : null}

      {!loading && filteredMembers.length === 0 && users.length > 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] px-8 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">Sonuç yok</p>
          <p className="mt-2 text-sm text-slate-500">
            Aramayı veya yetenek filtresini gevşetmeyi deneyin.
          </p>
        </div>
      ) : null}

      {!loading && filteredMembers.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((p, i) => (
              <NetworkMemberCard
                key={p.id}
                person={p}
                index={i}
                isSelf={currentUser?.id === p.id}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
