/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID?: string;
  readonly VITE_APPWRITE_USERS_COLLECTION_ID?: string;
  /** Uzay ürün / hizmet ilanları (`products` koleksiyonu). */
  readonly VITE_APPWRITE_PRODUCTS_COLLECTION_ID?: string;
  /** Eşleşme skoru için OpenAI (istemcide; üretimde proxy önerilir). */
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_OPENAI_MODEL?: string;
  /** Örn. Azure OpenAI uç noktası */
  readonly VITE_OPENAI_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
