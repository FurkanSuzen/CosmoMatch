import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-28 px-5 pb-16 pt-8 sm:px-8">
      <div className="pointer-events-none mx-auto max-w-6xl border-t border-white/[0.06] pt-12" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-indigo-500/10 via-slate-950/80 to-fuchsia-500/10 p-10 text-center sm:p-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.25),transparent_55%)]" />
          <h2 className="relative text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Bir sonraki iş ortaklığınızı başlatmaya hazır mısınız?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
            Kurumsal dağıtım, güvenlik incelemesi ve özel grafik entegrasyonları için ekibimizle iletişime geçin.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:cosmomatchweb@gmail.com"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition hover:bg-slate-100"
            >
              cosmomatchweb@gmail.com
            </a>
            <a
              href="#top"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:border-white/[0.2]"
            >
              En başa dön
            </a>
          </div>
        </motion.div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-10 text-sm text-slate-500 sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} CosmoMatch. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="transition hover:text-slate-300">
              Güvenlik
            </a>
            <a href="#" className="transition hover:text-slate-300">
              Gizlik
            </a>
            <a href="#" className="transition hover:text-slate-300">
              Şartlar ve Koşullar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
