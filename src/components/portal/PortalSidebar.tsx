import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AccountRoleBadge } from "./AccountRoleBadge";
import logo from "../layout/icon.svg";

const nav = [
  { to: "/portal", label: "Genel Bakış", end: true },
  { to: "/portal/eslesmeler", label: "Eşleşmeler" },
  { to: "/portal/marketplace", label: "Pazar Alanı" },
  { to: "/portal/network", label: "Network" },
];

type Props = {
  mobileOpen: boolean;
  onNavigate: () => void;
};

export function PortalSidebar({ mobileOpen, onNavigate }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
    onNavigate();
  }

  const sidebarInner = (
    <>
      <div className="flex h-full flex-col px-4 pb-6 pt-8">
        <Link
          to="/portal"
          onClick={onNavigate}
          className="mb-10 flex items-center gap-3 px-2"
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 p-1.5 shadow-[0_0_20px_-4px_rgba(99,102,241,0.45)]">
            <img src={logo} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-white">
              CosmoMatch
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-300/90">
              Portal
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5" aria-label="Portal">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                      isActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" : "bg-transparent group-hover:bg-slate-600"
                    }`}
                    aria-hidden
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-6">
          <Link
            to="/portal/profil"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 transition hover:border-white/[0.1] hover:bg-white/[0.05]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/40 to-slate-800 text-xs font-semibold text-white">
              {(user?.name ?? "?")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-medium text-slate-100">
                  {user?.name}
                </span>
                {user?.id ? <AccountRoleBadge userId={user.id} /> : null}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {user?.email}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-red-300"
          >
            Çıkış yap
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.06] bg-[#070a14]/95 backdrop-blur-2xl lg:flex">
        {sidebarInner}
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-label="Menüyü kapat"
              onClick={onNavigate}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-[min(100%,280px)] border-r border-white/[0.08] bg-[#070a14]/98 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              {sidebarInner}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
