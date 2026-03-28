import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import logo from "./dönen.svg";

const links = [
  { label: "Platform", href: "#features" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Önizleme", href: "#platform" },
  { label: "Partneler", href: "#partners" },
];

const SCROLL_TOP_SHOW = 56;
const SCROLL_DELTA = 8;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (open) {
        setHidden(false);
        return;
      }

      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (y < SCROLL_TOP_SHOW) {
        setHidden(false);
        return;
      }
      if (delta > SCROLL_DELTA) setHidden(true);
      else if (delta < -SCROLL_DELTA) setHidden(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{
        y: hidden ? "-100%" : 0,
        opacity: 1,
      }}
      transition={{
        y: { type: "spring", stiffness: 380, damping: 38, mass: 0.7 },
        opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-slate-950/55 backdrop-blur-2xl will-change-transform"
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-5 px-5 py-3 sm:min-h-[5.25rem] sm:gap-6 sm:px-10 sm:py-3.5">
        <a
          href="#top"
          className="group flex items-center gap-4 text-left sm:gap-5"
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 p-1.5 shadow-[0_0_28px_-4px_rgba(99,102,241,0.55)] sm:h-14 sm:w-14">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
              CosmoMatch
            </span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
              Deep-tech OS
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-[15px] font-medium text-slate-200 transition hover:border-white/[0.18] hover:bg-white/[0.06] sm:inline-flex"
          >
            Giriş Yap
          </a>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-white/[0.06] bg-slate-950/95 px-5 py-5 md:hidden"
        >
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-3.5 text-base font-medium text-slate-300"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
