export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  /** YYYY-MM-DD (Appwrite `users` koleksiyonu, string). */
  birthDate?: string;
  nationality?: string;
  /** Profilde seçilen yetenekler (Appwrite `users` koleksiyonu, string dizisi). */
  skills: string[];
};
