import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PortalGlobe } from "../../components/portal/PortalGlobe";
import { useAuth } from "../../contexts/AuthContext";

const cards = [
  {
    title: "Marketplace",
    desc: "Açık inovasyon ilanları ve ortak geliştirme fırsatları.",
    to: "/portal/marketplace",
    accent: "from-indigo-500/25 to-cyan-400/10",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h10M4 17h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="15"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Network",
    desc: "Doğrulanmış mühendis ve kurum profilleri.",
    to: "/portal/network",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 11a4 4 0 100-8 4 4 0 000 8zM4 21v-1a7 7 0 0114 0v1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19 8v4M17 10h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Eşleşmeler",
    desc: "AI skorları ve bir sonraki adımlar.",
    to: "/portal/eslesmeler",
    accent: "from-sky-500/20 to-indigo-500/10",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2l2.4 7h7.6l-6 4.6 2.3 7L12 17.3 5.7 20.6 8 13 2 9h7.6L12 2z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Siz";

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12 lg:items-start">
      {/* Sol: başlık + kartlar altta alta */}
      <div className="order-2 flex min-w-0 flex-1 flex-col gap-8 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Hoş geldiniz
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            {firstName}, CosmoMatch portalındasınız
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Marketplace, network ve eşleşmeler tek panelde. Aşağıdan modüllere
            geçin veya küreyi sürükleyerek dünyayı keşfedin.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08 * i,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to={c.to}
                className="group relative flex gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition hover:border-indigo-400/30 hover:bg-white/[0.05] hover:shadow-[0_0_48px_-16px_rgba(99,102,241,0.35)] sm:p-6"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br ${c.accent} opacity-70 blur-3xl transition group-hover:opacity-100`}
                />
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-cyan-300/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                  {c.icon}
                </span>
                <div className="relative min-w-0 flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    {c.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {c.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition group-hover:gap-2">
                    Aç
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sağ: küre */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="order-1 w-full shrink-0 lg:sticky lg:top-24 lg:order-2 lg:w-[min(100%,440px)]"
      >
        <PortalGlobe />
      </motion.div>
    </div>
  );
}
