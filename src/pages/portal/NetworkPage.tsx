import { AppwriteException } from "appwrite";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isUsersDbConfigured, listUsersFromDb } from "../../lib/usersDb";
import type { User } from "../../types/user";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function NetworkPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isUsersDbConfigured()) {
        if (!cancelled) {
          setUsers([]);
          setError(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const list = await listUsersFromDb();
        if (!cancelled) setUsers(list);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof AppwriteException
              ? e.message
              : "Kullanıcılar yüklenemedi.";
          setError(msg);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Network
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">
          Profiller ve kurumlar
        </h1>
        <p className="mt-3 text-slate-400">
          Doğrulanmış yetenek ağı. Arama, filtre ve mesajlaşma yakında burada
          olacak.
        </p>
      </motion.div>

      {!isUsersDbConfigured() && (
        <p className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          Kullanıcı listesi için Appwrite veritabanı ve{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">
            users
          </code>{" "}
          koleksiyonu ortam değişkenlerinde tanımlı olmalıdır.
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200/90">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[104px] animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.04]"
            />
          ))}
        </div>
      )}

      {!loading && !error && users.length === 0 && isUsersDbConfigured() && (
        <p className="mt-10 text-sm text-slate-500">
          Henüz kayıtlı kullanıcı yok veya listeleme izniniz yok.
        </p>
      )}

      {!loading && users.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-semibold text-white ring-1 ring-white/10">
                  {initials(p.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-slate-100">
                    {p.name}
                  </h2>
                  <p className="text-xs text-indigo-300/90">
                    {p.company ?? "-"}
                  </p>
                  
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {p.email}
                    </p>
                
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
