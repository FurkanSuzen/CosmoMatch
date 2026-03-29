export const MARKETPLACE_CATEGORY_IDS = [
  "payload",
  "propulsion",
  "ground",
  "software",
  "services",
  "materials",
  "other",
] as const;

export type MarketplaceCategoryId = (typeof MARKETPLACE_CATEGORY_IDS)[number];

export const MARKETPLACE_CATEGORY_LABELS: Record<MarketplaceCategoryId, string> = {
  payload: "Haberleşme & payload",
  propulsion: "İtki & yakıt",
  ground: "Yer segmenti",
  software: "Yazılım & simülasyon",
  services: "Mühendislik hizmeti",
  materials: "Malzeme & test",
  other: "Diğer",
};

export type ProductListing = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  /** Alıcıların iletişime geçeceği satıcı e-postası */
  contactEmail: string;
  sellerUserId: string;
  category: MarketplaceCategoryId;
  /** Örn. €2.1M, Teklif üzerine, Ortak yatırım */
  priceLabel: string;
  trl: string;
  imageUrl: string;
  createdAt: string;
};

export type CreateProductListingInput = {
  title: string;
  description: string;
  companyName: string;
  contactEmail: string;
  category: MarketplaceCategoryId;
  priceLabel: string;
  trl: string;
  imageUrl: string;
};

/** Veritabanı yokken gösterilen örnek ilanlar. */
export const DEMO_PRODUCT_LISTINGS: ProductListing[] = [
  {
    id: "demo-1",
    title: "LEO haberleşme payload modülü",
    description:
      "Çift bantlı K/Ka uyumlu payload; termal model ve EMC raporları dahil. TRL 6 doğrulama için ortak test ortamı aranıyor.",
    companyName: "Astra Labs",
    contactEmail: "pazar@astralabs.example.com",
    sellerUserId: "demo",
    category: "payload",
    priceLabel: "€2.1M",
    trl: "TRL 6",
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Elektrikli itki test bankı",
    description:
      "Hall etkili ölçüm hatları ve vakum haznesi ile 5–15 kW sınıfı itki karakterizasyonu. Kurulum ve eğitim paketi opsiyonel.",
    companyName: "Helios Drive",
    contactEmail: "contact@heliosdrive.example.com",
    sellerUserId: "demo",
    category: "propulsion",
    priceLabel: "Teklif üzerine",
    trl: "TRL 5",
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Ground segment güvenlik analizi",
    description:
      "CCSDS ve ECSS uyumlu güvenlik mimarisi; penetrasyon testi ve risk kaydı teslimi.",
    companyName: "Meridian Aerospace",
    contactEmail: "sales@meridian.example.com",
    sellerUserId: "demo",
    category: "ground",
    priceLabel: "Ortak yatırım",
    trl: "TRL 7",
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    title: "Orbit belirleme yazılım SDK",
    description:
      "Düşük yörünge için batch OD/ID çözümü; Python ve C API. Lisans ve SLA seçenekleri.",
    companyName: "Orbital Forge",
    contactEmail: "sdk@orbitalforge.example.com",
    sellerUserId: "demo",
    category: "software",
    priceLabel: "Yıllık lisans",
    trl: "TRL 8",
    imageUrl: "",
    createdAt: new Date().toISOString(),
  },
];
