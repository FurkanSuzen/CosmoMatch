import { AppwriteException, Permission, Role } from "appwrite";
import type { Models } from "appwrite";
import { appwriteDatabases } from "./appwrite";
import { mapAppwriteUser } from "./mapAppwriteUser";
import type { User } from "../types/user";

/**
 * Appwrite Console’da oluştur:
 * - Database (ID → .env’de VITE_APPWRITE_DATABASE_ID)
 * - Collection `users` (ID → VITE_APPWRITE_USERS_COLLECTION_ID)
 * Öznitelikler: `name` (string, required), `email` (string, required), `company` (string, optional)
 * İzinler: koleksiyonda “Document Security” açıksa, aşağıdaki permissions yeterli.
 */

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "";
const usersCollectionId = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID ?? "";

export function isUsersDbConfigured(): boolean {
  return (
    Boolean(import.meta.env.VITE_APPWRITE_ENDPOINT) &&
    Boolean(import.meta.env.VITE_APPWRITE_PROJECT_ID) &&
    databaseId.length > 0 &&
    usersCollectionId.length > 0
  );
}

type UserDoc = Models.Document & {
  name?: string;
  email?: string;
  company?: string;
};

function userDocPermissions(userId: string): string[] {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

async function upsertUserDocument(
  userId: string,
  data: { name: string; email: string; company?: string },
): Promise<void> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
  };
  if (data.company !== undefined && data.company !== "")
    payload.company = data.company;

  await appwriteDatabases.upsertDocument({
    databaseId,
    collectionId: usersCollectionId,
    documentId: userId,
    data: payload,
    permissions: userDocPermissions(userId),
  });
}

/**
 * Auth kullanıcısı + `users` koleksiyonundaki profil.
 * Belge yoksa (404) Auth verisinden oluşturur.
 */
export async function loadUserWithProfile(aw: Models.User): Promise<User> {
  const base = mapAppwriteUser(aw);
  if (!isUsersDbConfigured()) return base;

  try {
    const doc = (await appwriteDatabases.getDocument({
      databaseId,
      collectionId: usersCollectionId,
      documentId: aw.$id,
    })) as UserDoc;

    return {
      id: aw.$id,
      email: typeof doc.email === "string" ? doc.email : base.email,
      name: typeof doc.name === "string" && doc.name.length > 0 ? doc.name : base.name,
      company:
        typeof doc.company === "string" && doc.company.length > 0
          ? doc.company
          : base.company,
    };
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 404) {
      await upsertUserDocument(aw.$id, {
        name: base.name,
        email: base.email,
        company: base.company,
      });
      return base;
    }
    console.warn("[CosmoMatch] users koleksiyonu okunamadı:", e);
    return base;
  }
}

/** Profili veritabanına yazar (kayıt / ayarlar güncellemesi). */
export async function saveUserProfileToDb(
  userId: string,
  data: { name: string; email: string; company?: string },
): Promise<void> {
  if (!isUsersDbConfigured()) return;
  await upsertUserDocument(userId, data);
}
