import { motion } from "framer-motion";

const rows = [
  { name: "Lunar relay · Faz II", score: "98%", status: "İnceleme" },
  { name: "TPS karakterizasyonu", score: "94%", status: "Teklif" },
  { name: "Ground segment entegrasyonu", score: "91%", status: "Eşleşti" },
];

export function MatchesPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Eşleşmeler
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
          AI önerileri ve durum
        </h1>
        <p className="mt-3 text-slate-400">
          Skorlar ve iş akışı durumları örnek veridir; gerçek motor bağlantısı
          sonraki sprintte.
        </p>
      </motion.div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4 font-medium">Fırsat</th>
              <th className="hidden px-5 py-4 font-medium sm:table-cell">Skor</th>
              <th className="px-5 py-4 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="border-b border-white/[0.04] last:border-0"
              >
                <td className="px-5 py-4 font-medium text-slate-100">{r.name}</td>
                <td className="hidden px-5 py-4 text-cyan-300/90 sm:table-cell">
                  {r.score}
                </td>
                <td className="px-5 py-4 text-slate-400">{r.status}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
