import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-space-void px-4 py-10 sm:px-8 sm:py-14">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(79,70,229,0.18),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_100%_40%,rgba(168,85,247,0.1),transparent_45%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_0%_80%,rgba(34,211,238,0.06),transparent_45%)]" />

      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-300"
        >
          <span aria-hidden className="text-lg leading-none">
            ←
          </span>
          Ana sayfaya dön
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-8 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%)]" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/90">
              CosmoMatch
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.65rem]">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
