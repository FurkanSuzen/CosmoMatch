import { motion } from "framer-motion";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionHeading } from "../ui/SectionHeading";

const items = [
  {
    title: "AI Eşleştirme Sistemi",
    body: "Kişi yetenekleri grafikleri, özellikleri ve misyonu tabanlı partner eşleştirme sistemi.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v4M12 17v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M3 12h4M17 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    title: "Açık İnovasyon Pazarı",
    body: "Ödüllü yarışmalar, ortak çalışma alanları, altyapılar, sistemler pazarı ve daha fazlası.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h10M4 17h16"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <rect
          x="15"
          y="9.5"
          width="5"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    ),
  },
  {
    title: "Uzay Teknolojileri ve Yetenek Ağı",
    body: "Onaylı mühendisler, uzay bilimciker, araştırmacılar ve öğrenciler için bir yetenek ağı.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 11a4 4 0 100-8 4 4 0 000 8zM4 21v-1a7 7 0 0114 0v1"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M19 8v4M17 10h4"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
            eyebrow="Ana Platform"
          title="Uzay Ekosistemi için Gereken Her Şey"
          subtitle="Eşleştirme, pazar yeri ve yetenek - Üç temel konu, tek bir alanda birleşiyor."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GlassPanel className="group relative h-full overflow-hidden p-8 transition duration-500 hover:-translate-y-1 hover:border-indigo-400/25 hover:shadow-[0_0_48px_-12px_rgba(99,102,241,0.35)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/15 to-cyan-400/5 blur-3xl transition group-hover:opacity-100" />
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {item.body}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
