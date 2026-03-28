import type { Models } from "appwrite";
import type { User } from "../types/user";

export function mapAppwriteUser(aw: Models.User): User {
  const prefs = aw.prefs as { company?: string } | undefined;
  return {
    id: aw.$id,
    email: aw.email,
    name: aw.name?.trim() || aw.email.split("@")[0] || "Kullanıcı",
    company:
      typeof prefs?.company === "string" && prefs.company.length > 0
        ? prefs.company
        : undefined,
  };
}
