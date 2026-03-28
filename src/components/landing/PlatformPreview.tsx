import { motion } from "framer-motion";
import { GlassPanel } from "../ui/GlassPanel";
import { SectionHeading } from "../ui/SectionHeading";

const tags = ["GNC", "Thermal", "ITAR", "TRL 7", "LEO"];

const projects = [
  { name: "Kriyojenik yakıt hattı doğrulama", org: "Orbital Forge", match: "94%" },
  { name: "Yeniden giriş ısı kalkanı analizi", org: "Astra Labs", match: "91%" },
  { name: "Elektrikli itki test altyapısı paylaşımı", org: "Helios Drive", match: "89%" },
];

export function PlatformPreview() {
  return (
    <section
      id="platform"
      className="relative scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Platform Önizleme"
          title="Ekiplerinizin gerçekten kullanacağı bir kontrol yüzeyi"
          subtitle="Profiller, projeler ve eşleşme zekâsı tek ve sade bir arayüzde."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 perspective-[2000px]"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="pointer-events-none absolute -inset-4 rounded-[28px] bg-gradient-to-br from-indigo-500/20 via-transparent to-fuchsia-500/15 blur-3xl" />
            <GlassPanel className="relative overflow-hidden rounded-[20px] border-white/[0.09] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
              <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <aside className="flex w-full gap-3 border-b border-white/[0.06] bg-white/[0.02] p-4 lg:w-52 lg:flex-col lg:border-b-0 lg:border-r">
                  <div className="flex h-9 items-center gap-2 rounded-lg bg-white/[0.04] px-3 text-[12px] font-medium text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Genel Bakış
                  </div>
                  {["Eşleşmeler", "Projeler", "Network"].map((x) => (
                    <div
                      key={x}
                      className="hidden h-9 items-center rounded-lg px-3 text-[12px] text-slate-500 lg:flex"
                    >
                      {x}
                    </div>
                  ))}
                </aside>

                <div className="min-w-0 flex-1">
                  {/* Top bar */}
                  <div className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                        Canlı Çalışma Alanı
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-100">
                        Görev Akışı · Artemis sınıfı Röle
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400">
                        ITAR: Sadece ABD
                      </span>
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.8, repeat: Infinity }}
                        className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-medium text-emerald-300"
                      >
                        AI senkronizasyonu aktif
                      </motion.span>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Profile card */}
                    <motion.div
                      whileHover={{ rotateX: 2, rotateY: -2 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-inner"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-700 to-violet-900 ring-1 ring-white/10 items-center justify-center flex">
                          <p className="font-bold">M</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Meridian Aerospace
                            </p>
                            <p className="text-xs text-slate-500">
                              Ana Yükleyici · Fırlatma Sistemleri
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-200">
                          Onaylı
                        </span>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Project list */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Önerilen Fırsatlar
                      </p>
                      {projects.map((p, i) => (
                        <motion.div
                          key={p.name}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.08 * i, duration: 0.45 }}
                          className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-100">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-500">{p.org}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
                            {p.match}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
