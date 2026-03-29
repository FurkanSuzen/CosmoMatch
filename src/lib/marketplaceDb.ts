import { AppwriteException, ID, Permission, Query, Role } from "appwrite";
import type { Models } from "appwrite";
import { appwriteDatabases } from "./appwrite";
import type {
  CreateProductListingInput,
  MarketplaceCategoryId,
  ProductListing,
} from "../types/marketplace";
import { MARKETPLACE_CATEGORY_IDS } from "../types/marketplace";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "";
const productsCollectionId =
  import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ?? "";

/**
 * Appwrite konsolunda `products` koleksiyonu için önerilen alanlar (string):
 * - title, description, companyName, contactEmail, sellerUserId, category, priceLabel, trl, imageUrl
 * İzinler: oluşturma oturumlu kullanıcılar; okuma `users` (veya `any`).
 */
export function isMarketplaceDbConfigured(): boolean {
  return (
    Boolean(import.meta.env.VITE_APPWRITE_ENDPOINT) &&
    Boolean(import.meta.env.VITE_APPWRITE_PROJECT_ID) &&
    databaseId.length > 0 &&
    productsCollectionId.length > 0
  );
}

type ProductDoc = Models.Document & {
  title?: string;
  description?: string;
  companyName?: string;
  contactEmail?: string;
  sellerUserId?: string;
  category?: string;
  priceLabel?: string;
  trl?: string;
  imageUrl?: string;
};

function isCategoryId(v: string): v is MarketplaceCategoryId {
  return (MARKETPLACE_CATEGORY_IDS as readonly string[]).includes(v);
}

function mapDoc(doc: ProductDoc): ProductListing | null {
  const cat = typeof doc.category === "string" ? doc.category.trim() : "";
  if (!isCategoryId(cat)) return null;
  const title = typeof doc.title === "string" ? doc.title.trim() : "";
  if (!title) return null;
  return {
    id: doc.$id,
    title,
    description:
      typeof doc.description === "string" ? doc.description.trim() : "",
    companyName:
      typeof doc.companyName === "string" ? doc.companyName.trim() : "—",
    contactEmail:
      typeof doc.contactEmail === "string" ? doc.contactEmail.trim() : "",
    sellerUserId:
      typeof doc.sellerUserId === "string" ? doc.sellerUserId.trim() : "",
    category: cat,
    priceLabel:
      typeof doc.priceLabel === "string" && doc.priceLabel.trim().length > 0
        ? doc.priceLabel.trim()
        : "Teklif üzerine",
    trl: typeof doc.trl === "string" ? doc.trl.trim() : "",
    imageUrl: typeof doc.imageUrl === "string" ? doc.imageUrl.trim() : "",
    createdAt: doc.$createdAt,
  };
}

export type ListProductListingsFilters = {
  category: MarketplaceCategoryId | "all";
  search: string;
};

export async function listProductListings(
  filters: ListProductListingsFilters,
): Promise<ProductListing[]> {
  if (!isMarketplaceDbConfigured()) return [];

  const queries: string[] = [Query.orderDesc("$createdAt"), Query.limit(200)];
  if (filters.category !== "all") {
    queries.push(Query.equal("category", [filters.category]));
  }

  try {
    const res = await appwriteDatabases.listDocuments({
      databaseId,
      collectionId: productsCollectionId,
      queries,
    });
    const rows = res.documents
      .map((d) => mapDoc(d as ProductDoc))
      .filter((x): x is ProductListing => x !== null);

    const q = filters.search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q),
    );
  } catch (e) {
    console.warn("[CosmoMatch] marketplace listelenemedi:", e);
    return [];
  }
}

function listingPermissions(sellerId: string): string[] {
  return [
    Permission.read(Role.users()),
    Permission.update(Role.user(sellerId)),
    Permission.delete(Role.user(sellerId)),
  ];
}

function validateListingInput(
  input: CreateProductListingInput,
): { ok: true; payload: Record<string, unknown> } | { ok: false; error: string } {
  const title = input.title.trim();
  if (title.length < 3)
    return { ok: false, error: "Başlık en az 3 karakter olmalı." };
  const description = input.description.trim();
  if (description.length < 10)
    return { ok: false, error: "Açıklama en az 10 karakter olmalı." };
  const companyName = input.companyName.trim();
  if (companyName.length < 2)
    return { ok: false, error: "Kurum adı girin." };

  const contactEmail = input.contactEmail.trim();
  if (!contactEmail)
    return { ok: false, error: "İletişim e-postası zorunludur (alıcılar size bu adresle ulaşır)." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
    return { ok: false, error: "Geçerli bir iletişim e-postası girin." };

  const payload: Record<string, unknown> = {
    title,
    description,
    companyName,
    contactEmail,
    category: input.category,
    priceLabel: input.priceLabel.trim() || "Teklif üzerine",
    trl: input.trl.trim(),
    imageUrl: input.imageUrl.trim(),
  };
  return { ok: true, payload };
}

export async function createProductListing(
  sellerUserId: string,
  input: CreateProductListingInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!isMarketplaceDbConfigured()) {
    return { ok: false, error: "Marketplace veritabanı yapılandırılmadı." };
  }

  const validated = validateListingInput(input);
  if (!validated.ok) return validated;
  const payload = { ...validated.payload, sellerUserId };

  try {
    const doc = await appwriteDatabases.createDocument({
      databaseId,
      collectionId: productsCollectionId,
      documentId: ID.unique(),
      data: payload,
      permissions: listingPermissions(sellerUserId),
    });
    return { ok: true, id: doc.$id };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return { ok: false, error: e.message || "İlan oluşturulamadı." };
    }
    return { ok: false, error: "Beklenmeyen bir hata oluştu." };
  }
}

export async function updateProductListing(
  sellerUserId: string,
  documentId: string,
  input: CreateProductListingInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isMarketplaceDbConfigured()) {
    return { ok: false, error: "Marketplace veritabanı yapılandırılmadı." };
  }
  if (!sellerUserId || !documentId.trim()) {
    return { ok: false, error: "Oturum veya ilan bilgisi eksik." };
  }

  const validated = validateListingInput(input);
  if (!validated.ok) return validated;

  try {
    const existing = (await appwriteDatabases.getDocument({
      databaseId,
      collectionId: productsCollectionId,
      documentId,
    })) as ProductDoc;

    const owner =
      typeof existing.sellerUserId === "string"
        ? existing.sellerUserId.trim()
        : "";
    if (owner !== sellerUserId) {
      return { ok: false, error: "Bu ilanı düzenleme yetkiniz yok." };
    }

    await appwriteDatabases.updateDocument({
      databaseId,
      collectionId: productsCollectionId,
      documentId,
      data: validated.payload,
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return { ok: false, error: e.message || "İlan güncellenemedi." };
    }
    return { ok: false, error: "Beklenmeyen bir hata oluştu." };
  }
}

export async function deleteProductListing(
  sellerUserId: string,
  documentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isMarketplaceDbConfigured()) {
    return { ok: false, error: "Marketplace veritabanı yapılandırılmadı." };
  }
  if (!sellerUserId || !documentId.trim()) {
    return { ok: false, error: "Oturum veya ilan bilgisi eksik." };
  }

  try {
    const existing = (await appwriteDatabases.getDocument({
      databaseId,
      collectionId: productsCollectionId,
      documentId,
    })) as ProductDoc;

    const owner =
      typeof existing.sellerUserId === "string"
        ? existing.sellerUserId.trim()
        : "";
    if (owner !== sellerUserId) {
      return { ok: false, error: "Bu ilanı silme yetkiniz yok." };
    }

    await appwriteDatabases.deleteDocument({
      databaseId,
      collectionId: productsCollectionId,
      documentId,
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return { ok: false, error: e.message || "İlan silinemedi." };
    }
    return { ok: false, error: "Beklenmeyen bir hata oluştu." };
  }
}
