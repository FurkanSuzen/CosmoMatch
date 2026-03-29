import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  createProductListing,
  isMarketplaceDbConfigured,
  updateProductListing,
} from "../../lib/marketplaceDb";
import {
  MARKETPLACE_CATEGORY_IDS,
  MARKETPLACE_CATEGORY_LABELS,
  type MarketplaceCategoryId,
  type ProductListing,
} from "../../types/marketplace";

type Props = {
  open: boolean;
  onClose: () => void;
  sellerUserId: string;
  defaultCompany: string;
  defaultContactEmail: string;
  /** Doluysa form düzenleme modunda açılır. */
  initialListing: ProductListing | null;
  onSuccess: () => void;
};

const emptyForm = () => ({
  title: "",
  description: "",
  companyName: "",
  contactEmail: "",
  category: "payload" as MarketplaceCategoryId,
  priceLabel: "",
  trl: "",
  imageUrl: "",
});

function buildForm(
  initialListing: ProductListing | null,
  defaultCompany: string,
  defaultContactEmail: string,
) {
  if (initialListing) {
    return {
      title: initialListing.title,
      description: initialListing.description,
      companyName: initialListing.companyName,
      contactEmail: initialListing.contactEmail?.trim() ?? "",
      category: initialListing.category,
      priceLabel: initialListing.priceLabel,
      trl: initialListing.trl,
      imageUrl: initialListing.imageUrl,
    };
  }
  return {
    ...emptyForm(),
    companyName: defaultCompany.trim(),
    contactEmail: defaultContactEmail.trim(),
  };
}

export function CreateListingModal({
  open,
  onClose,
  sellerUserId,
  defaultCompany,
  defaultContactEmail,
  initialListing,
  onSuccess,
}: Props) {
  const [form, setForm] = useState(() =>
    buildForm(initialListing, defaultCompany, defaultContactEmail),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const listing = initialListing;
    const company = defaultCompany;
    queueMicrotask(() => {
      setForm(buildForm(listing, company, defaultContactEmail));
      setError(null);
    });
  }, [open, initialListing, defaultCompany, defaultContactEmail]);

  function resetAndClose() {
    setForm(emptyForm());
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isMarketplaceDbConfigured()) {
      setError(
        "Appwrite'da products koleksiyonu tanımlanmadı. Ortam değişkenlerini kontrol edin.",
      );
      return;
    }
    setSubmitting(true);
    const companyName = form.companyName.trim() || defaultCompany.trim();
    const body = { ...form, companyName };

    const res = initialListing
      ? await updateProductListing(sellerUserId, initialListing.id, body)
      : await createProductListing(sellerUserId, body);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setForm(emptyForm());
    onSuccess();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Kapat"
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="listing-modal-title"
            className="fixed inset-x-4 bottom-6 top-[12vh] z-50 mx-auto flex max-h-[min(640px,85vh)] max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0f1c] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_-20px_rgba(0,0,0,0.85)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90vh] sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="border-b border-white/[0.06] bg-gradient-to-r from-indigo-950/40 to-transparent px-5 py-4">
              <h2
                id="listing-modal-title"
                className="text-lg font-semibold tracking-tight text-white"
              >
                {initialListing ? "İlanı düzenle" : "Yeni ilan"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {initialListing
                  ? "İlan metnini ve görünümünü güncelleyin."
                  : "Kurumsal uzay ürün veya hizmetinizi paylaşın."}
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4"
            >
              <label className="block">
                <span className="text-xs font-medium text-slate-400">Başlık</span>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none ring-indigo-500/0 transition placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                  placeholder="Örn. Ka-band downlink modülü"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-400">Kurum</span>
                <input
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, companyName: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                  placeholder={defaultCompany || "Şirket adı"}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-400">
                  İletişim e-postası (alıcılar)
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactEmail: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                  placeholder="ornek@sirket.com"
                />
                <span className="mt-1 block text-[11px] text-slate-600">
                  «İletişime geç» varsayılan posta programında bu adrese yönlendirir.
                </span>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-400">Kategori</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as MarketplaceCategoryId,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-[#0d1320] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                >
                  {MARKETPLACE_CATEGORY_IDS.map((id) => (
                    <option key={id} value={id}>
                      {MARKETPLACE_CATEGORY_LABELS[id]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-400">Açıklama</span>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                  placeholder="Teknik özet, teslim kapsamı, aradığınız iş birliği tipi…"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-slate-400">
                    Fiyat / model
                  </span>
                  <input
                    value={form.priceLabel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, priceLabel: e.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                    placeholder="€, teklif, ortak yatırım…"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-400">TRL (opsiyonel)</span>
                  <input
                    value={form.trl}
                    onChange={(e) => setForm((f) => ({ ...f, trl: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                    placeholder="TRL 6"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-slate-400">
                  Görsel URL (opsiyonel)
                </span>
                <input
                  type="text"
                  inputMode="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-500/25"
                  placeholder="https://…"
                />
              </label>
              {error && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200/95">
                  {error}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 border-t border-white/[0.06] pt-4">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
                >
                  {submitting
                    ? "Kaydediliyor…"
                    : initialListing
                      ? "Değişiklikleri kaydet"
                      : "İlanı yayınla"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
