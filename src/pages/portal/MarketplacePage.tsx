import { motion } from "framer-motion";

const demo = [
  {
    title: "Cryo hat kalifikasyonu",
    org: "Orbital Forge",
    tag: "TRL 6",
    budget: "Ortak yatırım",
  },
  {
    title: "LEO haberleşme payload",
    org: "Astra Labs",
    tag: "İlan",
    budget: "€2.1M",
  },
  {
    title: "Elektrikli itki test bankı",
    org: "Helios Drive",
    tag: "Paylaşımlı",
    budget: "Teklif aşaması",
  },
  {
    title: "Uzay uydu tasarımı",
    org: "SpaceX",
    tag: "TRL 7",
    budget: "Ortak yatırım",
  },
  {
    title: "Yeniden giriş ısı kalkanı analizi",
    org: "Astra Labs",
    tag: "İlan",
    budget: "€1.5M",
  },
];

export function MarketplacePage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Marketplace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">
          Açık inovasyon ve ihtiyaç ilanları
        </h1>
        <p className="mt-3 text-slate-400">
          Yakında tam entegrasyon: filtreler, başvuru ve sözleşme akışları. Şimdilik
          örnek kartlar.
        </p>
      </motion.div>

      <ul className="mt-10 space-y-4">
        {demo.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-100">{item.title}</p>
              <p className="text-sm text-slate-500">{item.org}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300">
                {item.tag}
              </span>
              <span className="text-sm text-slate-400">{item.budget}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
