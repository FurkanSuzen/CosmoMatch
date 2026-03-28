import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { user, sessionReady } = useAuth();
  const location = useLocation();

  if (!sessionReady) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-space-void text-sm text-slate-400">
        Yükleniyor…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/giris" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
