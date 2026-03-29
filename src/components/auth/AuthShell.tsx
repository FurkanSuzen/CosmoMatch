import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  mode?: "login" | "register";
};

const sideCopy = {
  login: {
    headline: "Profesyonel ağınızı tek panelde yönetin",
    bullets: [
      "Eşleşmeler ve fırsatlar anlık",
      "Kurumsal marketplace entegrasyonu",
      "Güvenli, rol tabanlı erişim",
    ],
  },
  register: {
    headline: "Kurumsal ekosisteme adım atın",
    bullets: [
      "Profilinizi bir kez oluşturun",
      "Uzmanlık ve hedeflerinizi paylaşın",
      "Ekip ve projelerle eşleşin",
    ],
  },
} as const;

export function AuthShell({
  title,
  subtitle,
  children,
  mode = "login",
}: AuthShellProps) {
  const side = sideCopy[mode];

  return (
    <div className="grid h-dvh min-h-0 grid-cols-1 overflow-hidden bg-space-void lg:grid-cols-2">

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_80%_-20%,rgba(79,70,229,0.22),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_0%_100%,rgba(6,182,212,0.08),transparent_50%)]" />

      <aside className="relative items-center justify-center hidden min-h-0 flex-col justify-between overflow-hidden border-b border-white/[0.06] bg-[#030712] px-10 py-12 lg:flex lg:border-b-0 lg:border-r">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4V4h2V4h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-[320px] w-[320px] rounded-full bg-cyan-500/[0.09] blur-[90px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-300/90">
            CosmoMatch
          </p>
          <h2 className="mt-8 max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.04em] text-white sm:text-4xl">
            {side.headline}
          </h2>
          <ul className="mt-10 space-y-4">
            {side.bullets.map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-sm leading-relaxed text-slate-400"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-slate-600">
          © {new Date().getFullYear()} CosmoMatch. Tüm hakları saklıdır.
        </p>
      </aside>

      {/* Mobile top strip */}
      <div className="relative flex h-28 shrink-0 items-end bg-gradient-to-br from-indigo-950/80 via-space-950 to-space-void px-6 pb-5 lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_40%)]" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-indigo-300/90">
            CosmoMatch
          </p>
          <p className="mt-1 text-sm font-medium text-slate-300">{side.headline}</p>
        </div>
      </div>

      {/* Right: form */}
      <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <div className="shrink-0 px-6 pt-6 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-200"
          >
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-base leading-none text-slate-400 transition group-hover:border-indigo-400/30 group-hover:text-indigo-200"
            >
              ←
            </span>
            Ana sayfaya dön
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 pb-8 sm:px-10 lg:px-14 lg:pb-12">
          <div className="mx-auto flex min-h-full max-w-md flex-col justify-center py-4 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-white/[0.09] bg-white/[0.035] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_32px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-10"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,transparent_42%,transparent_100%)] sm:rounded-[1.75rem]" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/90">
                  CosmoMatch
                </p>
                <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.7rem]">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {subtitle}
                </p>
                <div className="mt-8">{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
