import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const cards = [
  {
    title: "Marketplace",
    desc: "Açık inovasyon ilanları ve ortak geliştirme fırsatları.",
    to: "/portal/marketplace",
    accent: "from-indigo-500/20 to-cyan-400/10",
  },
  {
    title: "Network",
    desc: "Doğrulanmış mühendis ve kurum profilleri.",
    to: "/portal/network",
    accent: "from-violet-500/15 to-fuchsia-500/10",
  },
  {
    title: "Eşleşmeler",
    desc: "AI skorları ve bir sonraki adımlar.",
    to: "/portal/eslesmeler",
    accent: "from-sky-500/15 to-indigo-500/10",
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Hoş geldiniz
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
          {user?.name.split(" ")[0]}, CosmoMatch portalındasınız
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          Buradan marketplace ilanlarını keşfedebilir, ağınızı genişletebilir ve
          yapay zekâ eşleşmelerinizi yönetebilirsiniz. Yakında daha fazla modül
          eklenecek.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08 * i,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              to={c.to}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition hover:border-indigo-400/25 hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.25)]"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-80 blur-3xl transition group-hover:opacity-100`}
              />
              <h2 className="relative text-lg font-semibold text-white">
                {c.title}
              </h2>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {c.desc}
              </p>
              <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-300">
                Aç
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
