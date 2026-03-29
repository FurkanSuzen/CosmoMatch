import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "./icon.svg";

const links = [
  { label: "Platform", hash: "features" },
  { label: "Nasıl Çalışır?", hash: "how-it-works" },
  { label: "Önizleme", hash: "platform" },
  { label: "Partnerler", hash: "partners" },
] as const;

const SCROLL_TOP_SHOW = 56;
const SCROLL_DELTA = 8;

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Navbar() {
  const { user, sessionReady } = useAuth();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const loggedIn = sessionReady && user !== null;
  const profileSubtitle =
    user?.company?.trim() || user?.email?.trim() || "";

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
        <Link
          to="/"
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
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.hash}
              to={{ pathname: "/", hash: l.hash }}
              className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!sessionReady ? (
            <span
              className="hidden h-11 w-[9.5rem] animate-pulse rounded-full bg-white/[0.06] sm:block"
              aria-hidden
            />
          ) : loggedIn ? (
            <>
              <Link
                to="/portal/profil"
                className="hidden max-w-[min(100%,240px)] items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] py-2 pl-2 pr-4 transition hover:border-white/[0.14] hover:bg-white/[0.07] sm:flex"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/45 to-slate-800 text-xs font-semibold text-white ring-1 ring-white/10">
                  {userInitials(user.name)}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium text-white">
                    {user.name}
                  </span>
                  {profileSubtitle ? (
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {user.company?.trim() ? user.company : user.email}
                    </span>
                  ) : null}
                </span>
              </Link>
              <Link
                to="/portal"
                className="hidden rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2.5 text-[14px] font-medium text-indigo-200/95 transition hover:border-indigo-400/35 hover:bg-indigo-500/15 lg:inline-flex"
              >
                Panele git
              </Link>
              <Link
                to="/portal/profil"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/40 to-slate-800 text-xs font-semibold text-white sm:hidden"
                aria-label={`Profil: ${user.name}`}
              >
                {userInitials(user.name)}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/giris"
                className="hidden rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-[15px] font-medium text-slate-200 transition hover:border-white/[0.18] hover:bg-white/[0.06] sm:inline-flex"
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="hidden rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-2.5 text-[15px] font-semibold text-slate-950 shadow-[0_0_24px_-6px_rgba(99,102,241,0.45)] transition hover:brightness-110 sm:inline-flex"
              >
                Kayıt ol
              </Link>
            </>
          )}
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
              <Link
                key={l.hash}
                to={{ pathname: "/", hash: l.hash }}
                className="rounded-lg px-2 py-3.5 text-base font-medium text-slate-300"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                <div className="my-2 border-t border-white/[0.06] pt-2">
                  <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Hesabınız
                  </p>
                  <Link
                    to="/portal/profil"
                    className="mt-1 block rounded-lg px-2 py-3.5 text-base font-medium text-slate-100"
                    onClick={() => setOpen(false)}
                  >
                    Profil — {user?.name}
                  </Link>
                  <Link
                    to="/portal"
                    className="block rounded-lg px-2 py-3.5 text-base font-medium text-indigo-300"
                    onClick={() => setOpen(false)}
                  >
                    Çalışma alanı
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="rounded-lg px-2 py-3.5 text-base font-medium text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="rounded-lg px-2 py-3.5 text-base font-semibold text-indigo-300"
                  onClick={() => setOpen(false)}
                >
                  Kayıt ol
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
