import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PortalLayout } from "./components/portal/PortalLayout";
import { DashboardPage } from "./pages/portal/DashboardPage";
import { MarketplacePage } from "./pages/portal/MarketplacePage";
import { NetworkPage } from "./pages/portal/NetworkPage";
import { MatchesPage } from "./pages/portal/MatchesPage";
import { ProfilePage } from "./pages/portal/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/kayit" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="eslesmeler" element={<MatchesPage />} />
          <Route path="profil" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
