export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  /** Profilde seçilen yetenekler (Appwrite `users` koleksiyonu, string dizisi). */
  skills: string[];
};
