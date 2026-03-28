import { motion } from "framer-motion";

const people = [
  { name: "Dr. Elif Kaya", role: "Propulsion · ITAR", org: "Meridian Aerospace" },
  { name: "Marcus Weber", role: "GNC · Avrupa", org: "Nova Flight" },
  { name: "Priya Sharma", role: "Malzeme bilimi", org: "Helix Materials" },
];

export function NetworkPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Network
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
          Profiller ve kurumlar
        </h1>
        <p className="mt-3 text-slate-400">
          Doğrulanmış yetenek ağı. Arama, filtre ve mesajlaşma yakında burada olacak.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-semibold text-white ring-1 ring-white/10">
                {p.name
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0])
                  .join("")}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-medium text-slate-100">{p.name}</h2>
                <p className="text-xs text-indigo-300/90">{p.role}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{p.org}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
