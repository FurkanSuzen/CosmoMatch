import { Outlet } from "react-router-dom";
import { PortalNavbar } from "./PortalNavbar";

export function PortalLayout() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-space-void">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_50%_at_50%_-15%,rgba(79,70,229,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_30%,rgba(168,85,247,0.07),transparent_50%)]" />

      <PortalNavbar />
      <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
