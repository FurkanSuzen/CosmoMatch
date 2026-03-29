import { useEffect, useState } from "react";
import {
  accountPlanRoleBadge,
  getStoredAccountPlan,
  subscribeAccountPlan,
  type AccountPlanId,
} from "../../lib/accountPlan";

type Props = {
  userId: string | undefined;
  /** Rozet `span`ına ek sınıflar */
  className?: string;
};

export function AccountRoleBadge({ userId, className = "" }: Props) {
  const [plan, setPlan] = useState<AccountPlanId>(() =>
    getStoredAccountPlan(userId),
  );

  useEffect(() => {
    setPlan(getStoredAccountPlan(userId));
  }, [userId]);

  useEffect(
    () => subscribeAccountPlan(() => setPlan(getStoredAccountPlan(userId))),
    [userId],
  );

  const badge = accountPlanRoleBadge(plan);
  if (!badge) return null;

  const combined = [badge.className, className].filter(Boolean).join(" ");

  return (
    <span className={combined} title={`Hesap türü: ${badge.label}`}>
      {badge.label}
    </span>
  );
}
