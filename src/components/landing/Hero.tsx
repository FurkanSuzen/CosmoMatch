import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FloatingOrbitCards } from "./FloatingOrbitCards";
import { OrbitalRings } from "./OrbitalRings";
import { Starfield } from "./Starfield";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "18%"],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["0%", "12%"],
  );
  const dim = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduceMotion ? [1, 1] : [1, 0.35],
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-32"
    >
      <motion.div
        style={{ y: bgY, opacity: dim }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_60%,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-space-void" />
        <Starfield />
        <OrbitalRings />
      </motion.div>

      <FloatingOrbitCards />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-4xl text-center"
      >
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 backdrop-blur-md"
        >
          <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          Uzay İnovasyonları Destekleme Sistemi
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-balance bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-semibold tracking-[-0.04em] text-transparent sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.05]"
        >
          Geleceğin Uzay İnovasyonları için Eşleştirme Sistemi
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          CosmoMatch, uzay teknolojileri ve inovasyonları için AI destekli eşleştirme ve Uzay İnovasyonları pazar alanı olarak araştırmacı ekipler, uzay sanayisi ve üniversiteler için tasarlanmıştır.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            to="/kayit"
            className="group relative inline-flex h-12 min-w-[180px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 px-8 text-sm font-semibold text-slate-950 shadow-[0_0_40px_-8px_rgba(99,102,241,0.65)] transition hover:shadow-[0_0_56px_-6px_rgba(34,211,238,0.55)]"
          >
            <span className="relative z-10 tracking-tight">Başla</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition group-hover:opacity-100" />
          </Link>
          <Link
            to="/#features"
            className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-8 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:border-white/[0.2] hover:bg-white/[0.07]"
          >
            Ekosistemi Keşfet
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600">
          Kaydır {/* / scroll down */}
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-slate-600 to-transparent" />
      </motion.div>
    </section>
  );
}
