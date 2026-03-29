import { motion } from "framer-motion";
import type { FlatJobOffer } from "../../types/carriers";
import { carriersMeta, categoryLabel, formatDeadline } from "../../lib/carriersData";

type Props = {
  job: FlatJobOffer;
  matchPercent: number | null;
  onClose: () => void;
};

function Section({
  title,
  items,
  scrollable,
}: {
  title: string;
  items: string[];
  scrollable?: boolean;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul
        className={`mt-3 space-y-2 ${
          scrollable ? "max-h-52 overflow-y-auto overscroll-contain pr-1" : ""
        }`}
      >
        {items.map((x) => (
          <li key={x} className="text-sm leading-relaxed text-slate-400">
            <span className="text-violet-400/90">·</span> {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDetailModal({ job, matchPercent, onClose }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal
        className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#070b14] shadow-2xl"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-white/[0.06] bg-gradient-to-r from-violet-950/50 via-[#0a1020] to-cyan-950/20 px-6 py-5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-3 pr-16">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200/80">
                {job.organization} · {categoryLabel(job.category)}
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
                {job.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {job.location.facility}
                {job.location.city ? ` · ${job.location.city}` : ""}
                {job.location.state ? `, ${job.location.state}` : ""} ·{" "}
                {job.location.country}
              </p>
            </div>
            {matchPercent !== null ? (
              <span className="shrink-0 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
                  Profil eşleşmesi
                </span>
                <span className="text-lg font-bold tabular-nums text-emerald-300">
                  {matchPercent}%
                </span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm transition hover:bg-black/60"
          >
            Kapat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300"
              >
                {t}
              </span>
            ))}
            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                job.status === "Açık"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-slate-500/30 bg-slate-500/10 text-slate-400"
              }`}
            >
              {job.status}
            </span>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Çalışma şekli
              </dt>
              <dd className="mt-1 text-sm text-slate-200">{job.employmentType}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Sözleşme
              </dt>
              <dd className="mt-1 text-sm text-slate-200">{job.contractType}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Yayın
              </dt>
              <dd className="mt-1 text-sm text-slate-200">
                {formatDeadline(job.publishDate)}
              </dd>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Son başvuru
              </dt>
              <dd className="mt-1 text-sm text-slate-200">
                {formatDeadline(job.applicationDeadline)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-cyan-200/70">
              Ücret / ödeme
            </p>
            <p className="mt-1 text-sm font-medium text-cyan-100/95">
              {job.salary.displayText}
            </p>
          </div>

          <Section title="Eğitim" items={job.requirements.education} />
          <Section title="Diller" items={job.requirements.languages} />
          <Section
            title="Teknik beceriler"
            items={job.requirements.technicalSkills}
            scrollable
          />
          <Section title="Yetkinlikler" items={job.requirements.competencies} />

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-white">Yan haklar ve imkânlar</h3>
            <ul className="mt-3 space-y-2">
              {job.benefits.map((b) => (
                <li
                  key={b}
                  className="flex gap-2 text-sm leading-relaxed text-slate-400 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-violet-400/80"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-xs text-slate-600">
            Veri kaynağı: CosmoMatch taşıyıcı kataloğu
            {carriersMeta.lastUpdated
              ? ` · Katalog tarihi: ${carriersMeta.lastUpdated}`
              : ""}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
