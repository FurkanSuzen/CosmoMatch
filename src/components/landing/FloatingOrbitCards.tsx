import { motion } from "framer-motion";
import { GlassPanel } from "../ui/GlassPanel";

const cards = [
  {
    title: "Proje",
    label: "Türksat 6A · Uydu",
    meta: "TUSAŞ · 4 ortak",
    accent: "from-cyan-400/20 to-indigo-500/10",
  },
  {
    title: "Profil",
    label: "Prof. Dr. Dilhan EZER",
    meta: "Astroizik Profesörü · NASA",
    accent: "from-violet-400/20 to-fuchsia-500/10",
  },
  {
    title: "Yetenekler",
    label: "Cryo systems · CFD",
    meta: "98% Eşleşme Puanı",
    accent: "from-sky-400/15 to-indigo-500/10",
  },
];

export function FloatingOrbitCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden min-[900px]:block">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          className="absolute w-[min(88vw,280px)]"
          style={{
            left: i === 0 ? "6%" : i === 1 ? "58%" : "28%",
            top: i === 0 ? "18%" : i === 1 ? "22%" : "62%",
          }}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            rotateZ: [0, i % 2 === 0 ? 1.5 : -1.2, 0],
            filter: "blur(0px)",
          }}
          transition={{
            opacity: { duration: 1, delay: 0.4 + i * 0.12 },
            y: { duration: 9 + i, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 11 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotateZ: {
              duration: 12 + i,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <GlassPanel className="relative overflow-hidden p-4 sm:p-5">
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${c.accent} blur-2xl`}
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {c.title}
            </p>
            <p className="mt-2 text-sm font-medium tracking-tight text-slate-100">
              {c.label}
            </p>
            <p className="mt-1 text-xs text-slate-500">{c.meta}</p>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
