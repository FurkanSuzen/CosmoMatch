import { AppwriteException, Permission, Query, Role } from "appwrite";
import type { Models } from "appwrite";
import { appwriteDatabases } from "./appwrite";
import { mapAppwriteUser } from "./mapAppwriteUser";
import type { User } from "../types/user";


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
  birthDate?: string;
  nationality?: string;
  skills?: string[];
};

function userDocPermissions(userId: string): string[] {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

function normalizeSkills(skills: string[] | undefined): string[] {
  if (!Array.isArray(skills)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of skills) {
    if (typeof s !== "string") continue;
    const t = s.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= 80) break;
  }
  return out;
}

async function upsertUserDocument(
  userId: string,
  data: {
    name: string;
    email: string;
    company?: string;
    birthDate?: string;
    nationality?: string;
    skills?: string[];
  },
): Promise<void> {
  const payload: Record<string, unknown> = {
    name: data.name,
    email: data.email,
  };
  if (data.company !== undefined)
    payload.company = data.company === "" ? "" : data.company;
  if (data.birthDate !== undefined)
    payload.birthDate = data.birthDate === "" ? "" : data.birthDate.trim();
  if (data.nationality !== undefined)
    payload.nationality =
      data.nationality === "" ? "" : data.nationality.trim();
  if (data.skills !== undefined) payload.skills = normalizeSkills(data.skills);

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
      birthDate:
        typeof doc.birthDate === "string" && doc.birthDate.trim().length > 0
          ? doc.birthDate.trim()
          : undefined,
      nationality:
        typeof doc.nationality === "string" && doc.nationality.trim().length > 0
          ? doc.nationality.trim()
          : undefined,
      skills: normalizeSkills(doc.skills),
    };
  } catch (e) {
    if (e instanceof AppwriteException && e.code === 404) {
      await upsertUserDocument(aw.$id, {
        name: base.name,
        email: base.email,
        company: base.company,
        skills: [],
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
  data: {
    name: string;
    email: string;
    company?: string;
    birthDate?: string;
    nationality?: string;
    skills?: string[];
  },
): Promise<void> {
  if (!isUsersDbConfigured()) return;
  await upsertUserDocument(userId, data);
}

/**
 * `users` koleksiyonundaki tüm profiller (Appwrite okuma izinleri açık olmalı).
 */
export async function listUsersFromDb(): Promise<User[]> {
  if (!isUsersDbConfigured()) return [];

  const res = await appwriteDatabases.listDocuments({
    databaseId,
    collectionId: usersCollectionId,
    queries: [Query.limit(200), Query.orderDesc("$createdAt")],
  });

  return res.documents.map((doc) => {
    const d = doc as UserDoc;
    return {
      id: doc.$id,
      email: typeof d.email === "string" ? d.email : "",
      name:
        typeof d.name === "string" && d.name.trim().length > 0
          ? d.name.trim()
          : "İsimsiz",
      company:
        typeof d.company === "string" && d.company.trim().length > 0
          ? d.company.trim()
          : undefined,
      birthDate:
        typeof d.birthDate === "string" && d.birthDate.trim().length > 0
          ? d.birthDate.trim()
          : undefined,
      nationality:
        typeof d.nationality === "string" && d.nationality.trim().length > 0
          ? d.nationality.trim()
          : undefined,
      skills: normalizeSkills(d.skills),
    };
  });
}
