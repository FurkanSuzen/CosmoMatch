import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Features } from "../components/landing/Features";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { PlatformPreview } from "../components/landing/PlatformPreview";
import { TrustPartners } from "../components/landing/TrustPartners";

function scrollToSectionHash(hash: string) {
  const id = hash.replace(/^#/, "").trim();
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash || !hash.replace(/^#/, "").trim()) return;
    const t = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToSectionHash(hash));
    });
    return () => window.cancelAnimationFrame(t);
  }, [hash]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-space-void">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(79,70,229,0.14),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_100%_40%,rgba(168,85,247,0.08),transparent_45%)]" />

      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PlatformPreview />
        <TrustPartners />
      </main>
      <Footer />
    </div>
  );
}
