import { motion } from "framer-motion";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../layout/icon.svg";

const nav = [
  { to: "/portal", label: "Panel", end: true },
  { to: "/portal/marketplace", label: "Marketplace" },
  { to: "/portal/network", label: "Network" },
  { to: "/portal/eslesmeler", label: "Eşleşmeler" },
];

const linkClass =
  "rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors";
const activeClass = "bg-white/[0.08] text-white";
const idleClass = "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100";

export function PortalNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
    setUserOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[4rem] max-w-[1400px] items-center justify-between gap-4 px-4 sm:min-h-[4.5rem] sm:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to="/portal"
            className="group flex shrink-0 items-center gap-3 text-left"
          >
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 p-1.5 shadow-[0_0_24px_-4px_rgba(99,102,241,0.5)] sm:h-12 sm:w-12">
              <img src={logo} alt="" className="h-full w-full object-contain" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold tracking-[-0.02em] text-white">
                CosmoMatch
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-300/90">
                Portal
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Portal"
          >
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : idleClass}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] py-1.5 pl-2 pr-3 text-left transition hover:border-white/[0.14]"
              aria-expanded={userOpen}
              aria-haspopup="menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/40 to-slate-800 text-xs font-semibold text-white">
                {user?.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-200 sm:block">
                {user?.name}
              </span>
              <svg
                className="h-4 w-4 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {userOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-white/[0.08] bg-slate-950/95 py-1 shadow-xl backdrop-blur-xl"
                role="menu"
              >
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="truncate text-sm font-medium text-white">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-red-300 transition hover:bg-white/[0.04]"
                >
                  Çıkış yap
                </button>
              </motion.div>
            ) : null}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Menü"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
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

      {menuOpen ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-white/[0.06] bg-slate-950/95 px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-base font-medium ${isActive ? "bg-white/[0.08] text-white" : "text-slate-300"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}
