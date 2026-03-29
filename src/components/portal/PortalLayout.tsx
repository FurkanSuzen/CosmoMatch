import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../layout/icon.svg";
import { PortalSidebar } from "./PortalSidebar";

export function PortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-space-void">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_50%_at_50%_-15%,rgba(79,70,229,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_30%,rgba(168,85,247,0.07),transparent_50%)]" />

      <PortalSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="flex min-h-[100dvh] flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-[#070a14]/90 px-4 py-3 backdrop-blur-2xl lg:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200"
            aria-expanded={mobileOpen}
            aria-label="Menüyü aç"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link
            to="/portal"
            className="flex min-w-0 items-center gap-2.5 text-left"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 p-1">
              <img src={logo} alt="" className="h-full w-full object-contain" />
            </span>
            <span className="truncate text-sm font-semibold text-white">CosmoMatch</span>
          </Link>
          <span className="w-11" aria-hidden />
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
