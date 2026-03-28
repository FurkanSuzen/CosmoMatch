/* eslint-disable react-refresh/only-export-components -- context + hook pattern */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/** Demo hesap — giriş sayfasında da gösterilir (yalnızca yerel mock). */
export const MOCK_DEMO_EMAIL = "demo@cosmomatch.io";
export const MOCK_DEMO_PASSWORD = "CosmoMatch2026!";

export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
};

type StoredUser = User & { password: string };

const SESSION_KEY = "cosmomatch_session";
const USERS_KEY = "cosmomatch_users";

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function writeSession(user: User | null) {
  if (!user) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

const listeners = new Set<() => void>();
let cache = readSession();

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return null;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit() {
  cache = readSession();
  listeners.forEach((l) => l());
}

function ensureMockDemoUser() {
  if (typeof localStorage === "undefined") return;
  const users = readUsers();
  const normalized = MOCK_DEMO_EMAIL.toLowerCase();
  if (users.some((u) => u.email === normalized)) return;
  users.push({
    id: "cm-mock-demo-1",
    email: normalized,
    name: "Demo Kullanıcı",
    company: "CosmoMatch Labs",
    password: MOCK_DEMO_PASSWORD,
  });
  writeUsers(users);
}

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureMockDemoUser();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password)
        return { ok: false as const, error: "E-posta ve şifre gerekli." };

      const users = readUsers();
      const found = users.find((u) => u.email === normalized);
      if (!found || found.password !== password)
        return { ok: false as const, error: "E-posta veya şifre hatalı." };

      const session: User = {
        id: found.id,
        email: found.email,
        name: found.name,
        company: found.company,
      };
      writeSession(session);
      emit();
      return { ok: true as const };
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
      const email = data.email.trim().toLowerCase();
      const name = data.name.trim();
      if (!name || !email || !data.password)
        return { ok: false as const, error: "Tüm zorunlu alanları doldurun." };
      if (data.password.length < 8)
        return { ok: false as const, error: "Şifre en az 8 karakter olmalı." };

      const users = readUsers();
      if (users.some((u) => u.email === email))
        return { ok: false as const, error: "Bu e-posta zaten kayıtlı." };

      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        email,
        name,
        company: data.company?.trim() || undefined,
        password: data.password,
      };
      users.push(newUser);
      writeUsers(users);

      const session: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        company: newUser.company,
      };
      writeSession(session);
      emit();
      return { ok: true as const };
    },
    [],
  );

  const logout = useCallback(() => {
    writeSession(null);
    emit();
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
