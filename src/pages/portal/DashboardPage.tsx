import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortalGlobe } from "../../components/portal/PortalGlobe";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStoredTopMatches,
  TOP_MATCHES_UPDATED_EVENT,
  type StoredTopMatchesPayload,
} from "../../lib/topMatchesStorage";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function rankStyle(rank: number): string {
  if (rank === 1)
    return "from-amber-500/25 via-amber-500/5 to-transparent border-amber-400/20";
  if (rank === 2)
    return "from-slate-400/20 via-slate-500/5 to-transparent border-slate-400/15";
  return "from-orange-900/30 via-orange-950/10 to-transparent border-orange-800/25";
}

export function DashboardPage() {
  const { user } = useAuth();
  const [topPayload, setTopPayload] = useState<StoredTopMatchesPayload | null>(() =>
    typeof window !== "undefined" ? getStoredTopMatches() : null,
  );

  const skillsKey = useMemo(
    () => (user?.skills?.length ? user.skills.join("|") : ""),
    [user],
  );

  const refreshTop = useCallback(() => {
    setTopPayload(getStoredTopMatches());
  }, []);

  useEffect(() => {
    const onUpdate = () => refreshTop();
    window.addEventListener(TOP_MATCHES_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(TOP_MATCHES_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refreshTop]);

  const topStale = Boolean(
    topPayload && skillsKey && topPayload.skillsKey !== skillsKey,
  );

  const firstName = user?.name?.split(" ")[0] ?? "Siz";
  const lastName = user?.name?.split(" ")[1] ?? "";
  const company = user?.company?.trim() || "Kurum bilgisi eklenmedi";
  const nationality = user?.nationality?.trim() || "Ülke bilgisi eklenmedi";
  const tags = (user?.skills?.length ? user.skills : ["Yetenek bilgisi eklenmedi"]).slice(0, 6);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Canlı çalışma alanı
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            {firstName + " " + lastName + " · " + company}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Hoş geldiniz, {firstName}. Marketplace, eşleşmeler ve network özeti bu
            sayfada; ayrıntılar için sol menüden ilgili bölüme geçin.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
            {nationality}
          </span>
          <span className="rounded-full border border-green-300/25 bg-green-300/10 px-3 py-1.5 text-xs font-medium text-violet-200/95">
            AI Entegrasyonu Aktif
          </span>
        </div>
      </motion.header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-7"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-600/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-800 text-lg font-semibold text-white shadow-lg shadow-violet-500/20">
                {initials(user?.name ?? "?")}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight text-white">
                  {user?.name ?? "Profil"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {user?.company?.trim()
                    ? `${company} · Üye`
                    : "Kurum ve yeteneklerinizi profilden ekleyin"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-200">
              Onaylı
            </span>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
          <Link
            to="/portal/profil"
            className="relative mt-6 inline-flex text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Profili düzenle →
          </Link>
        </motion.article>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-7"
        >
          <div className="pointer-events-none absolute -right-20 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  AI önerileriniz
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Eşleşmeler sayfasında{" "}
                  <span className="text-slate-400">AI ile eşleştir</span> dediğinizde
                  en uygun 3 ilan burada saklanır — tekrar istek atılmaz.
                </p>
              </div>
              {topPayload?.savedAt ? (
                <span className="shrink-0 rounded-full border border-white/[0.08] bg-black/20 px-2.5 py-1 text-[10px] text-slate-500">
                  {new Date(topPayload.savedAt).toLocaleString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              ) : null}
            </div>

            {topStale ? (
              <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-100/90">
                Profil yetenekleriniz kayıtlı öneriden sonra değişti.{" "}
                <Link
                  to="/portal/eslesmeler"
                  className="font-medium text-amber-200 underline-offset-2 hover:underline"
                >
                  Yeniden AI ile eşleştir
                </Link>
              </p>
            ) : null}

            {!topPayload?.items.length ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-300">
                  Henüz kayıtlı öneri yok
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Kişisel en iyi 3 pozisyonu görmek için eşleşmelerde AI çalıştırın.
                </p>
                <Link
                  to="/portal/eslesmeler"
                  className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-violet-600/90 to-indigo-600/90 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500"
                >
                  Eşleşmelere git
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {topPayload.items.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    <Link
                      to="/portal/eslesmeler"
                      className={`group flex items-stretch gap-0 overflow-hidden rounded-xl border bg-gradient-to-r ${rankStyle(i + 1)} transition hover:border-white/[0.12]`}
                    >
                      <span className="flex w-11 shrink-0 items-center justify-center bg-black/25 text-sm font-bold text-white/90">
                        {i + 1}
                      </span>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-3 sm:px-4">
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-medium leading-snug text-slate-100 group-hover:text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.organization} · {item.categoryLabel}
                          </p>
                        </div>
                        <span className="flex shrink-0 flex-col items-end gap-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-200/75">
                            Uyum
                          </span>
                          <span className="text-lg font-bold tabular-nums text-emerald-300">
                            {item.score}%
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}

            <div className="relative mt-6 flex flex-wrap gap-3 border-t border-white/[0.06] pt-5 text-sm">
              <Link
                to="/portal/eslesmeler"
                className="font-medium text-violet-300/95 transition hover:text-violet-200"
              >
                Tüm eşleşmeler →
              </Link>
              <Link
                to="/portal/marketplace"
                className="text-slate-500 transition hover:text-slate-300"
              >
                Marketplace
              </Link>
              <Link
                to="/portal/network"
                className="text-slate-500 transition hover:text-slate-300"
              >
                Network
              </Link>
            </div>
          </div>
        </motion.section>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Küre · Canlı iş birlikleri
        </p>
        <PortalGlobe />
      </motion.div>
    </div>
  );
}
