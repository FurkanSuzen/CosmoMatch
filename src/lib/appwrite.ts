import { Account, Client, Databases } from "appwrite";

/**
 * Appwrite istemcisi — `.env` içinde VITE_APPWRITE_* değişkenlerini tanımlayın.
 * Sonraki adım: Auth (Account) ve veritabanı koleksiyonları bu modül üzerinden bağlanacak.
 */
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "";

export const isAppwriteConfigured = Boolean(
  endpoint.length > 0 && projectId.length > 0,
);

const client = new Client();

if (isAppwriteConfigured) {
  client.setEndpoint(endpoint).setProject(projectId);
}

/** Oturum ve kayıt (Appwrite Auth) */
export const appwriteAccount = new Account(client);

/** Veritabanı sorguları — koleksiyon ID’leri sonraki adımda eklenecek */
export const appwriteDatabases = new Databases(client);

export { client as appwriteClient };
