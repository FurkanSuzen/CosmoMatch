import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/auth/AuthShell";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { login, user, sessionReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const from =
    state?.from && state.from.startsWith("/portal") ? state.from : "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (sessionReady && user) navigate(from, { replace: true });
  }, [sessionReady, user, from, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await login(email, password);
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate(from, { replace: true });
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
      title="Tekrar hoş geldiniz"
      subtitle="CosmoMatch portalına giriş yaparak eşleşmelerinizi ve ağınızı yönetin."
    >
      <form onSubmit={onSubmit} className="space-y-5">
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
            htmlFor="login-email"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            E-posta
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none ring-indigo-500/0 transition placeholder:text-slate-600 focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="ornek@sirket.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="text-xs font-medium uppercase tracking-wider text-slate-500"
          >
            Şifre
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/25"
            placeholder="••••••••"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={pending}
          whileTap={{ scale: 0.99 }}
          className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_32px_-6px_rgba(99,102,241,0.55)] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Giriş yapılıyor…" : "Giriş yap"}
        </motion.button>

        <p className="text-center text-sm text-slate-500">
          Hesabınız yok mu?{" "}
          <Link
            to="/kayit"
            className="font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Kayıt olun
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
