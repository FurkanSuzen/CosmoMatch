import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/auth/AuthShell";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const { register, user, sessionReady } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (sessionReady && user) navigate("/portal", { replace: true });
  }, [sessionReady, user, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setPending(true);
    const res = await register({ name, email, password, company: company || undefined });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate("/portal", { replace: true });
  }

  if (!sessionReady) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-space-void text-sm text-slate-400">
        Yükleniyor…
      </div>
    );
  }

  return (
    <AuthShell
      title="Hesap oluşturun"
      subtitle="Kurumsal ağınıza katılın; eşleşmeler ve marketplace tek panelde."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}

        <div>
          <label
            htmlFor="reg-name"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            Ad soyad
          </label>
          <input
            id="reg-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="Ayşe Yılmaz"
            required
          />
        </div>

        <div>
          <label
            htmlFor="reg-email"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            İş e-postası
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="ornek@sirket.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="reg-company"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            Kurum <span className="font-normal text-slate-600">(isteğe bağlı)</span>
          </label>
          <input
            id="reg-company"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="Meridian Aerospace"
          />
        </div>

        <div>
          <label
            htmlFor="reg-password"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            Şifre
          </label>
          <input
            id="reg-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="En az 8 karakter"
            minLength={8}
            required
          />
        </div>

        <div>
          <label
            htmlFor="reg-confirm"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            Şifre tekrar
          </label>
          <input
            id="reg-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="••••••••"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={pending}
          whileTap={{ scale: 0.99 }}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_-6px_rgba(99,102,241,0.55)] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Hesap oluşturuluyor…" : "Kayıt ol"}
        </motion.button>

        <p className="pt-1 text-center text-sm text-slate-500">
          Zaten hesabınız var mı?{" "}
          <Link
            to="/giris"
            className="font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Giriş yapın
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
