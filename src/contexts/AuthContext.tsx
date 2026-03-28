/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import { AppwriteException, ID } from "appwrite";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { appwriteAccount, isAppwriteConfigured } from "../lib/appwrite";
import { loadUserWithProfile, saveUserProfileToDb } from "../lib/usersDb";
import type { User } from "../types/user";

export type { User };

function formatAuthError(e: unknown): string {
  if (e instanceof AppwriteException) {
    return e.message || "İstek başarısız.";
  }
  if (e instanceof Error) return e.message;
  return "Beklenmeyen bir hata oluştu.";
}

type AuthContextValue = {
  user: User | null;
  /** Appwrite oturumu kontrol edildi (veya yapılandırma yok). */
  sessionReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  /** Görünen ad ve tercihler (kurum); Auth + `users` koleksiyonu senkron. */
  updateProfile: (data: {
    name: string;
    company?: string;
    skills: string[];
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!isAppwriteConfigured) {
      setUser(null);
      setSessionReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const aw = await appwriteAccount.get();
        if (!cancelled) setUser(await loadUserWithProfile(aw));
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!isAppwriteConfigured) {
        return {
          ok: false as const,
          error:
            "Appwrite yapılandırılmadı. Proje kökünde `.env` içinde VITE_APPWRITE_ENDPOINT ve VITE_APPWRITE_PROJECT_ID tanımlayın.",
        };
      }
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password)
        return { ok: false as const, error: "E-posta ve şifre gerekli." };

      try {
        await appwriteAccount.createEmailPasswordSession({
          email: normalized,
          password,
        });
        const aw = await appwriteAccount.get();
        setUser(await loadUserWithProfile(aw));
        return { ok: true as const };
      } catch (e) {
        return { ok: false as const, error: formatAuthError(e) };
      }
    },
    [],
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      company?: string;
    }) => {
      if (!isAppwriteConfigured) {
        return {
          ok: false as const,
          error:
            "Appwrite yapılandırılmadı. `.env` dosyasında VITE_APPWRITE_* değişkenlerini ayarlayın.",
        };
      }
      const email = data.email.trim().toLowerCase();
      const name = data.name.trim();
      if (!name || !email || !data.password)
        return { ok: false as const, error: "Tüm zorunlu alanları doldurun." };
      if (data.password.length < 8)
        return { ok: false as const, error: "Şifre en az 8 karakter olmalı." };

      try {
        await appwriteAccount.create({
          userId: ID.unique(),
          email,
          password: data.password,
          name,
        });
        await appwriteAccount.createEmailPasswordSession({
          email,
          password: data.password,
        });
        const company = data.company?.trim();
        if (company) {
          await appwriteAccount.updatePrefs({ prefs: { company } });
        }
        const aw = await appwriteAccount.get();
        setUser(await loadUserWithProfile(aw));
        return { ok: true as const };
      } catch (e) {
        return { ok: false as const, error: formatAuthError(e) };
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (data: { name: string; company?: string; skills: string[] }) => {
      if (!isAppwriteConfigured) {
        return {
          ok: false as const,
          error:
            "Appwrite yapılandırılmadı. `.env` dosyasında VITE_APPWRITE_* değişkenlerini ayarlayın.",
        };
      }
      const name = data.name.trim();
      if (!name) return { ok: false as const, error: "Görünen ad gerekli." };
      if (name.length > 128)
        return { ok: false as const, error: "Görünen ad en fazla 128 karakter olabilir." };

      const companyTrim = (data.company ?? "").trim();

      try {
        await appwriteAccount.updateName({ name });
        const awAfterName = await appwriteAccount.get();
        const prevPrefs = (awAfterName.prefs as Record<string, unknown>) ?? {};
        await appwriteAccount.updatePrefs({
          prefs: { ...prevPrefs, company: companyTrim },
        });
        const current = await appwriteAccount.get();
        await saveUserProfileToDb(current.$id, {
          name,
          email: current.email,
          company: companyTrim,
          skills: data.skills,
        });
        setUser(await loadUserWithProfile(current));
        return { ok: true as const };
      } catch (e) {
        return { ok: false as const, error: formatAuthError(e) };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    if (isAppwriteConfigured) {
      try {
        await appwriteAccount.deleteSession({ sessionId: "current" });
      } catch {
        /* oturum zaten yoksa yine de yerel state temizlenir */
      }
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, sessionReady, login, register, updateProfile, logout }),
    [user, sessionReady, login, register, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
