/**
 * Hesap planı — yalnızca istemci tarafı (localStorage).
 * Ödeme / abonelik doğrulaması yok; arayüz ve tutarlılık için.
 */

export const ACCOUNT_PLAN_IDS = [
  "individual_premium",
  "company",
  "investor",
] as const;

export type AccountPlanId = (typeof ACCOUNT_PLAN_IDS)[number];

const STORAGE_KEY = "cosmomatch_account_plan_v1";

export type AccountPlanDefinition = {
  id: AccountPlanId;
  title: string;
  subtitle: string;
  /** Aylık, gösterim amaçlı TRY */
  priceMonthlyTry: number;
  priceNote: string;
  features: string[];
  accent: "violet" | "cyan" | "amber";
  highlight?: boolean;
};

/** Tahmini operasyon giderleri (aylık TRY) — vitrin amaçlı, faturalama yok */
export type OperationalCostRow = {
  label: string;
  amountTry: number;
  detail: string;
};

export const OPERATIONAL_COST_ROWS: OperationalCostRow[] = [
  {
    label: "Barındırma & edge CDN",
    amountTry: 420,
    detail: "Statik uygulama, TLS, küresel dağıtım (Vite çıktısı + edge)",
  },
  {
    label: "Alan adı & DNS",
    amountTry: 95,
    detail: "Yıllık alan ücretinin aylık karşılığı, yönetilen DNS",
  },
  {
    label: "Veritabanı & kimlik",
    amountTry: 1050,
    detail: "Appwrite sınıfı: belgeler, oturum, dosya kotası",
  },
  {
    label: "Güvenlik (WAF / rate limit)",
    amountTry: 280,
    detail: "Bot ve kötüye kullanıma karşı koruma katmanı",
  },
  {
    label: "Gözlem & yedekleme",
    amountTry: 190,
    detail: "Log saklama, uyarılar, yapılandırılmış yedek",
  },
  {
    label: "LLM API (eşleşme çıkarımı)",
    amountTry: 720,
    detail: "OpenAI benzeri anlamsal skor; Premium kotaya dahil varsayım",
  },
];

export function operationalCostTotalTry(): number {
  return OPERATIONAL_COST_ROWS.reduce((s, r) => s + r.amountTry, 0);
}

export const ACCOUNT_PLANS: AccountPlanDefinition[] = [
  {
    id: "individual_premium",
    title: "Bireysel Premium",
    subtitle: "Araştırmacılar ve uzmanlar için tam özellikli kişisel hesap.",
    priceMonthlyTry: 349,
    priceNote: "AI eşleşme ve kişisel öneriler dahil",
    accent: "violet",
    highlight: true,
    features: [
      "AI ile anlamsal iş eşleştirme (OpenAI tabanlı skor)",
      "Panoda en iyi 3 pozisyon önerisi (yerel saklama)",
      "Sınırsız profil yeteneği & gelişmiş arama",
      "Pazar alanında ilan verme ve düzenleme",
      "Öncelikli e-posta iletişim şablonları",
    ],
  },
  {
    id: "company",
    title: "Şirket",
    subtitle: "Küçük ve orta ölçekli uzay ekosistemi firmaları.",
    priceMonthlyTry: 1290,
    priceNote: "5 kullanıcıya kadar · AI hariç",
    accent: "cyan",
    features: [
      "5 ekip üyesi daveti ve paylaşılan kurum profili",
      "Pazar alanında kurumsal vitrin rozeti ve öne çıkan ilan slotu",
      "Metin tabanlı eşleşme skoru ve ilan export / iç raporlar",
      "Toplu iletişim e-posta şablonları",
      "AI anlamsal eşleşme bu planda kapalıdır (maliyet optimizasyonu)",
    ],
  },
  {
    id: "investor",
    title: "Yatırımcı",
    subtitle: "Fon ve kurumsal yatırımcılar için pipeline ve izleme.",
    priceMonthlyTry: 2490,
    priceNote: "Pipeline & uyarılar · AI eşleşme hariç",
    accent: "amber",
    features: [
      "İlan ve şirket takip listeleri (watchlist)",
      "Yeni fırsat ve pazar ilanı uyarıları (tasarım bildirimleri)",
      "Şirket ve teknoloji etiketlerine göre filtre preset’leri",
      "Özet pano: TRL, kategori ve kurum kırılımı (salt okunur analitik)",
      "Veri odası erişimi (ileride API — şu an arayüz yer tutucu)",
    ],
  },
];

export function getAccountPlanById(id: AccountPlanId): AccountPlanDefinition {
  const p = ACCOUNT_PLANS.find((x) => x.id === id);
  if (!p) return ACCOUNT_PLANS[0];
  return p;
}

export function planAllowsAiMatch(plan: AccountPlanId): boolean {
  return plan === "individual_premium";
}

/** Şirket / Yatırımcı planlarında isim yanında gösterilen rozet (Bireysel Premium’da yok). */
export type AccountPlanRoleBadge = {
  label: string;
  className: string;
};

export function accountPlanRoleBadge(plan: AccountPlanId): AccountPlanRoleBadge | null {
  if (plan === "company") {
    return {
      label: "Şirket",
      className:
        "inline-flex shrink-0 items-center rounded-md border border-cyan-400/40 bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-100/95",
    };
  }
  if (plan === "investor") {
    return {
      label: "Yatırımcı",
      className:
        "inline-flex shrink-0 items-center rounded-md border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-100/95",
    };
  }
  return null;
}

export function formatPlanPriceMonthly(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

function readStorage(): Record<string, AccountPlanRef> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, AccountPlanRef>;
    }
  } catch {
    /* ignore */
  }
  return {};
}

type AccountPlanRef = { plan: AccountPlanId };

function isPlanId(v: unknown): v is AccountPlanId {
  return (
    typeof v === "string" &&
    (ACCOUNT_PLAN_IDS as readonly string[]).includes(v)
  );
}

const PLAN_CHANGE_EVENT = "cosmomatch-account-plan";

export function getStoredAccountPlan(userId: string | undefined): AccountPlanId {
  if (!userId) return "individual_premium";
  const map = readStorage();
  const entry = map[userId];
  if (entry && isPlanId(entry.plan)) return entry.plan;
  return "individual_premium";
}

export function setStoredAccountPlan(userId: string, plan: AccountPlanId): void {
  const map = readStorage();
  map[userId] = { plan };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
  window.dispatchEvent(new Event(PLAN_CHANGE_EVENT));
}

export function subscribeAccountPlan(callback: () => void): () => void {
  const onStore = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  const onLocal = () => callback();
  window.addEventListener("storage", onStore);
  window.addEventListener(PLAN_CHANGE_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStore);
    window.removeEventListener(PLAN_CHANGE_EVENT, onLocal);
  };
}
