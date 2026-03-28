import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  {
    step: "01",
    title: "Profilini Oluştur",
    text: "Yapılandırılmış yetkinlik grafiği—araçlar, yükler, tesisler ve fikri mülkiyet.",
  },
  {
    step: "02",
    title: "İhtiyaçlarını veya Yeteneklerini Paylaş",
    text: "Kısıtlarla tanımlanan görev akışları: bütçe, zaman çizelgesi ve ITAR uyumluluğu.",
  },
  {
    step: "03",
    title: "AI en uygun eşleşmeyi bulsun",
    text: "Karşı tarafın hazırlık seviyesi ve risk sinyalleriyle desteklenen, açıklanabilir skorlar.",
  },
  {
    step: "04",
    title: "Birlikte üret ve hayata geçir",
    text: "Paylaşımlı çalışma alanları, kilometre taşları ve ihracat uyumlu doküman akışları.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-28 overflow-hidden px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(99,102,241,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Nasıl Çalışır?"
          title="Ortaklığa giden yol-dört adımda"
          subtitle="Net,anlaşılır ve şeffaf. Kara kutu yok."
        />

        <div className="mt-20">
          {/* Desktop: horizontal */}
          <div className="hidden lg:block">
            <div className="relative flex items-stretch justify-between gap-4">
              <div className="pointer-events-none absolute left-0 right-0 top-[2.25rem] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <motion.div
                className="pointer-events-none absolute left-0 top-[2.25rem] h-px w-full origin-left bg-gradient-to-r from-cyan-400/50 via-indigo-400/40 to-fuchsia-400/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.1 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex w-[22%] flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-[11px] font-semibold tracking-widest text-slate-300 shadow-[0_0_24px_-4px_rgba(99,102,241,0.45)]">
                    {s.step}
                  </div>
                  <h3 className="mt-8 text-sm font-semibold tracking-tight text-white">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile / tablet: vertical */}
          <div className="lg:hidden">
            <div className="relative mx-auto max-w-md pl-2">
              <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
              <motion.div
                className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-cyan-400/50 via-indigo-400/40 to-fuchsia-400/50"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <ol className="relative space-y-10">
                {steps.map((s, i) => (
                  <motion.li
                    key={s.step}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex gap-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-[11px] font-semibold tracking-widest text-slate-300 shadow-[0_0_20px_-4px_rgba(99,102,241,0.4)]">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-white">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {s.text}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
