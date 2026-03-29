import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CreateListingModal } from "../../components/marketplace/CreateListingModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  isMarketplaceDbConfigured,
  listProductListings,
} from "../../lib/marketplaceDb";
import {
  DEMO_PRODUCT_LISTINGS,
  MARKETPLACE_CATEGORY_IDS,
  MARKETPLACE_CATEGORY_LABELS,
  type MarketplaceCategoryId,
  type ProductListing,
} from "../../types/marketplace";

type SortKey = "newest" | "company" | "title";

function filterDemo(
  items: ProductListing[],
  category: MarketplaceCategoryId | "all",
  search: string,
): ProductListing[] {
  let rows = items;
  if (category !== "all") rows = rows.filter((p) => p.category === category);
  const q = search.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q),
    );
  }
  return rows;
}

function sortListings(items: ProductListing[], sort: SortKey): ProductListing[] {
  const copy = [...items];
  if (sort === "newest") {
    copy.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } else if (sort === "company") {
    copy.sort((a, b) => a.companyName.localeCompare(b.companyName, "tr"));
  } else {
    copy.sort((a, b) => a.title.localeCompare(b.title, "tr"));
  }
  return copy;
}

function ProductCard({
  item,
  onSelect,
  onEdit,
  showEdit,
  index,
}: {
  item: ProductListing;
  onSelect: () => void;
  onEdit: () => void;
  showEdit: boolean;
  index: number;
}) {
  const catLabel = MARKETPLACE_CATEGORY_LABELS[item.category];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition hover:border-indigo-400/25 hover:shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)]"
    >
      {showEdit ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute right-2 top-2 z-10 rounded-lg border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-black/70"
        >
          Düzenle
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-1 flex-col text-left"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-950">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,rgba(99,102,241,0.25),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(6,182,212,0.12),transparent_45%)]">
              <span className="text-4xl font-semibold tracking-tight text-white/20">
                {item.title.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a14]/90 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-200/95 backdrop-blur-md">
            {catLabel}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-white">
            {item.title}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">{item.companyName}</p>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
            {item.trl ? (
              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-300">
                {item.trl}
              </span>
            ) : null}
            <span className="ml-auto text-sm font-semibold tabular-nums text-cyan-300/90">
              {item.priceLabel}
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function DetailModal({
  item,
  onClose,
  onEdit,
  showEdit,
}: {
  item: ProductListing;
  onClose: () => void;
  onEdit: () => void;
  showEdit: boolean;
}) {
  const catLabel = MARKETPLACE_CATEGORY_LABELS[item.category];
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal
        className="relative z-10 flex max-h-[min(85vh,800px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080c16] shadow-2xl"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[21/9] max-h-[220px] shrink-0 overflow-hidden bg-slate-900 sm:aspect-[24/9]">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950/80 via-slate-900 to-cyan-950/30">
              <span className="text-5xl font-bold text-white/15">
                {item.title.slice(0, 3).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/70"
          >
            Kapat
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
              {catLabel}
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {item.title}
            </h2>
            <p className="mt-1 text-slate-400">{item.companyName}</p>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.trl ? (
              <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
                {item.trl}
              </span>
            ) : null}
            <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200/95">
              {item.priceLabel}
            </span>
          </div>
          <div className="space-y-3 border-t border-white/[0.06] pt-4">
            {showEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/25"
              >
                İlanı düzenle
              </button>
            ) : null}
            <p className="text-xs text-slate-500">
              İletişim ve satın alma akışları yakında platform üzerinden
              tamamlanacaktır. Şimdilik kurum adıyla satıcıyı tanıyabilirsiniz.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function MarketplacePage() {
  const { user } = useAuth();
  const [category, setCategory] = useState<MarketplaceCategoryId | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ProductListing | null>(null);
  const [selected, setSelected] = useState<ProductListing | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 280);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (isMarketplaceDbConfigured()) {
        const data = await listProductListings({
          category,
          search: debouncedSearch,
        });
        if (!cancelled) setListings(data);
      } else if (!cancelled) {
        setListings(filterDemo(DEMO_PRODUCT_LISTINGS, category, debouncedSearch));
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [category, debouncedSearch, refreshKey]);

  const sorted = useMemo(
    () => sortListings(listings, sort),
    [listings, sort],
  );

  const dbReady = isMarketplaceDbConfigured();

  function openCreateModal() {
    setEditingListing(null);
    setCreateOpen(true);
  }

  function openEditModal(item: ProductListing) {
    setEditingListing(item);
    setCreateOpen(true);
    setSelected(null);
  }

  function isOwner(item: ProductListing): boolean {
    return Boolean(
      dbReady && user?.id && item.sellerUserId && item.sellerUserId === user.id,
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-indigo-950/[0.35] via-[#0a0f1c] to-cyan-950/[0.15] px-6 py-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_40px_100px_-40px_rgba(79,70,229,0.35)] sm:px-10 sm:py-12"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-indigo-200/70">
            Orbital marketplace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            Kurumsal uzay ürünleri ve hizmetleri
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            İleri mühendislik çözümlerini keşfedin, filtreleyin ve ekibiniz için yeni
            ilanlar açın. Tek bir vitrinde payload, itki, yer segmenti ve daha
            fazlası.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-500"
            >
              İlan ver
            </button>
            <span className="text-sm text-slate-500">
              Oturum: {user?.name ?? "—"}
            </span>
          </div>
        </div>
      </motion.section>

      {!dbReady && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-100/90">
          <strong className="font-semibold">Önizleme modu:</strong> Appwrite’da{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
            products
          </code>{" "}
          koleksiyonu ve{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">
            VITE_APPWRITE_PRODUCTS_COLLECTION_ID
          </code>{" "}
          tanımlanınca ilanlar kalıcı olarak kaydedilir. Şu an örnek ilanlar
          gösteriliyor.
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <label className="block max-w-xl">
            <span className="sr-only">Ara</span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün, kurum veya anahtar kelime…"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-slate-100 outline-none ring-indigo-500/0 transition placeholder:text-slate-600 focus:border-indigo-400/35 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                category === "all"
                  ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-100"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:text-slate-300"
              }`}
            >
              Tümü
            </button>
            {MARKETPLACE_CATEGORY_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  category === id
                    ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-100"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:text-slate-300"
                }`}
              >
                {MARKETPLACE_CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            <span>Sırala</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-white/[0.08] bg-[#0c101c] px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400/40"
            >
              <option value="newest">En yeni</option>
              <option value="company">Kuruma göre</option>
              <option value="title">Başlığa göre</option>
            </select>
          </label>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/15"
          >
            + İlan aç
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[340px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-lg font-medium text-slate-300">Sonuç bulunamadı</p>
          <p className="mt-2 text-sm text-slate-500">
            Filtreleri veya aramayı değiştirin ya da yeni bir ilan oluşturun.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((item, i) => (
            <ProductCard
              key={item.id}
              item={item}
              index={i}
              onSelect={() => setSelected(item)}
              showEdit={isOwner(item)}
              onEdit={() => openEditModal(item)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected ? (
          <DetailModal
            key={selected.id}
            item={selected}
            onClose={() => setSelected(null)}
            showEdit={isOwner(selected)}
            onEdit={() => openEditModal(selected)}
          />
        ) : null}
      </AnimatePresence>

      <CreateListingModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setEditingListing(null);
        }}
        sellerUserId={user?.id ?? ""}
        defaultCompany={user?.company?.trim() ?? ""}
        initialListing={editingListing}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
