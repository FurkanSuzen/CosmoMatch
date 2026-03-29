import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ACCOUNT_PLANS,
  formatPlanPriceMonthly,
  getAccountPlanById,
  getStoredAccountPlan,
  operationalCostTotalTry,
  OPERATIONAL_COST_ROWS,
  type AccountPlanDefinition,
  type AccountPlanId,
  setStoredAccountPlan,
  subscribeAccountPlan,
} from "../../lib/accountPlan";

const accentRing: Record<AccountPlanDefinition["accent"], string> = {
  violet:
    "border-violet-500/35 ring-violet-500/20 hover:border-violet-400/45 data-[selected=true]:border-violet-400/55 data-[selected=true]:shadow-[0_0_40px_-12px_rgba(139,92,246,0.45)]",
  cyan: "border-cyan-500/30 ring-cyan-500/15 hover:border-cyan-400/40 data-[selected=true]:border-cyan-400/50 data-[selected=true]:shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)]",
  amber:
    "border-amber-500/35 ring-amber-500/15 hover:border-amber-400/45 data-[selected=true]:border-amber-400/55 data-[selected=true]:shadow-[0_0_40px_-12px_rgba(245,158,11,0.35)]",
};

const accentBadge: Record<AccountPlanDefinition["accent"], string> = {
  violet: "bg-violet-500/15 text-violet-200 border-violet-400/25",
  cyan: "bg-cyan-500/15 text-cyan-200 border-cyan-400/25",
  amber: "bg-amber-500/15 text-amber-200 border-amber-400/25",
};

type Props = {
  userId: string;
};

export function AccountPlanPicker({ userId }: Props) {
  const [plan, setPlan] = useState<AccountPlanId>(() =>
    getStoredAccountPlan(userId),
  );
  const [costOpen, setCostOpen] = useState(false);

  useEffect(() => {
   setPlan(getStoredAccountPlan(userId));
  }, [userId]);

  useEffect(() => {
    return subscribeAccountPlan(() => {
      setPlan(getStoredAccountPlan(userId));
    });
  }, [userId]);

  const costTotal = useMemo(() => operationalCostTotalTry(), []);

  function select(id: AccountPlanId) {
    setStoredAccountPlan(userId, id);
    setPlan(id);
  }

  const current = getAccountPlanById(plan);

  return (
    <div className="mt-10 space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Hesap planı
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
          Plan seçimi
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Bu bölüm yalnızca arayüzdür; ödeme veya abonelik doğrulaması yapılmaz.
          <strong className="font-medium text-slate-300">
            {" "}
            AI iş eşleştirme yalnızca Bireysel Premium
          </strong>{" "}
          ile sunulur. Şirket ve Yatırımcı planları kurumsal vitrin ve pipeline
          odağındadır.
        </p>
        <p className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
          Aktif plan:{" "}
          <span className="font-medium text-slate-300">{current.title}</span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {ACCOUNT_PLANS.map((def, i) => {
          const selected = plan === def.id;
          return (
            <motion.div
              key={def.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.35 }}
              className={`relative flex flex-col rounded-2xl border bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ring-1 ring-transparent transition ${accentRing[def.accent]} `}
              data-selected={selected}
            >
              {def.highlight ? (
                <span
                  className={`absolute -top-2.5 left-4 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${accentBadge[def.accent]}`}
                >
                  Popüler
                </span>
              ) : null}
              <div className="mb-4 min-h-[4rem]">
                <h3 className="text-lg font-semibold text-white">{def.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {def.subtitle}
                </p>
              </div>
              {/*
              <p className="text-2xl font-bold tabular-nums text-white">
                {formatPlanPriceMonthly(def.priceMonthlyTry)}
                <span className="text-sm font-medium text-slate-500"> / ay</span>
              </p>
              */}
              <p className="mt-1 text-[11px] text-slate-500">{def.priceNote}</p>
              <ul className="mt-4 flex-1 space-y-2.5 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-slate-400">
                {def.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => select(def.id)}
                className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  selected
                    ? "border border-white/15 bg-white/10 text-white"
                    : "border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                {selected ? "Seçili plan" : "Bu planı seç"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
