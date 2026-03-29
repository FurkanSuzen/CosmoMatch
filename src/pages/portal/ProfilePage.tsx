import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { AccountPlanPicker } from "../../components/portal/AccountPlanPicker";
import { AccountRoleBadge } from "../../components/portal/AccountRoleBadge";
import { ProfileSkillPicker } from "../../components/portal/ProfileSkillPicker";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAccountPlanById,
  getStoredAccountPlan,
  subscribeAccountPlan,
} from "../../lib/accountPlan";
import { appwriteAccount, isAppwriteConfigured } from "../../lib/appwrite";
import { skillsEqual } from "../../lib/skillsUtils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatJoined(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatBirthDate(ymd?: string): string | null {
  if (!ymd?.trim()) return null;
  const d = new Date(`${ymd.trim()}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillCatalog, setSkillCatalog] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [planLabel, setPlanLabel] = useState(() =>
    getAccountPlanById(getStoredAccountPlan(user?.id)).title,
  );

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setCompany(user.company ?? "");
    setSkills(user.skills);
  }, [user]);

  useEffect(() => {
    setPlanLabel(getAccountPlanById(getStoredAccountPlan(user?.id)).title);
  }, [user?.id]);

  useEffect(
    () =>
      subscribeAccountPlan(() =>
        setPlanLabel(getAccountPlanById(getStoredAccountPlan(user?.id)).title),
      ),
    [user?.id],
  );

  useEffect(() => {
    let cancelled = false;
    void import("../../data/skillsCatalog.json")
      .then((m: { default?: { skills?: string[] }; skills?: string[] }) => {
        const raw = m.default ?? m;
        const list = raw?.skills;
        if (!cancelled && Array.isArray(list)) setSkillCatalog(list);
      })
      .catch(() => {
        if (!cancelled) setSkillCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAppwriteConfigured || !user) {
      setJoinedAt(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const aw = await appwriteAccount.get();
        if (!cancelled) setJoinedAt(formatJoined(aw.$createdAt));
      } catch {
        if (!cancelled) setJoinedAt(null);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- joinedAt yalnızca user.id ile yenilensin
  }, [user?.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const res = await updateProfile({ name, company, skills });
    setSaving(false);
    if (res.ok) {
      setMessage({ type: "ok", text: "Profiliniz güncellendi." });
    } else {
      setMessage({ type: "err", text: res.error });
    }
  }

  if (!user) return null;

  const dirty =
    name.trim() !== user.name.trim() ||
    company.trim() !== (user.company ?? "").trim() ||
    !skillsEqual(skills, user.skills);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl flex-1"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Hesap
        </p>
        <h1 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-[-0.03em] text-white">
          Profil
          <AccountRoleBadge userId={user.id} />
        </h1>
        <p className="mt-3 text-slate-400">
          Görünen adınızı, kurum bilgisini ve teknoloji yetenek listenizi
          güncelleyin.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/40 to-slate-800 text-xl font-semibold text-white shadow-[0_0_32px_-8px_rgba(99,102,241,0.5)]"
              aria-hidden
            >
              {initials(name || user.name)}
            </div>
            <div className="min-w-0 flex-1 space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Görünen ad (kullanıcı adı)
                </label>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={128}
                  className="mt-2 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-company"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Kurum / şirket
                </label>
                <input
                  id="profile-company"
                  type="text"
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Opsiyonel"
                />
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
                <ProfileSkillPicker
                  catalog={skillCatalog}
                  value={skills}
                  onChange={setSkills}
                />
              </div>
            </div>
          </div>

          {message ? (
            <p
              className={`mt-6 text-sm ${message.type === "ok" ? "text-emerald-300/90" : "text-red-300/90"}`}
              role="status"
            >
              {message.text}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || !dirty || !name.trim()}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
            </button>
            {!dirty && !message ? (
              <span className="text-sm text-slate-500">Kaydedilecek değişiklik yok.</span>
            ) : null}
          </div>
        </form>

        <AccountPlanPicker userId={user.id} />
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="w-full shrink-0 lg:sticky lg:top-28 lg:w-[min(100%,380px)]"
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl">
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Hesap bilgileri
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Hesap planı
              </dt>
              <dd className="mt-1 text-slate-200">{planLabel}</dd>
              <p className="mt-1 text-xs text-slate-500">
                Aşağıdan plan değiştirebilirsiniz; yalnızca arayüz, ödeme yoktur.
              </p>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                E-posta
              </dt>
              <dd className="mt-1 break-all text-slate-200">{user.email}</dd>
              <p className="mt-1 text-xs text-slate-500">
                E-posta değişikliği için güvenlik doğrulaması gerekir; şimdilik
                salt okunur.
              </p>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Kullanıcı kimliği
              </dt>
              <dd className="mt-1 font-mono text-xs text-slate-300 break-all">
                {user.id}
              </dd>
            </div>
            {joinedAt ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Üyelik
                </dt>
                <dd className="mt-1 text-slate-200">{joinedAt}</dd>
              </div>
            ) : null}
            {formatBirthDate(user.birthDate) ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Doğum tarihi
                </dt>
                <dd className="mt-1 text-slate-200">{formatBirthDate(user.birthDate)}</dd>
              </div>
            ) : null}
            {user.nationality ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Uyruk
                </dt>
                <dd className="mt-1 text-slate-200">{user.nationality}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </motion.aside>
    </div>
  );
}
