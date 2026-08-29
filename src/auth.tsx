import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* ---------- types ---------- */
export type Role = "student" | "admin";
export type User = {
  name: string;
  email: string;
  phone: string;
  group: string;
  role: Role;
};
type StoredUser = User & { password: string };

const USERS_KEY = "ratbesho-users-v1";
const SESSION_KEY = "ratbesho-session-v1";

const SEED_USERS: StoredUser[] = [
  { name: "مدیر رتبه‌شو", email: "admin@ratbesho.ir", phone: "09120000000", group: "", role: "admin", password: "admin1405" },
  { name: "نگار موسوی", email: "negar@test.ir", phone: "09121234567", group: "تجربی", role: "student", password: "123456" },
];

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as StoredUser[];
      if (Array.isArray(saved) && saved.length) return saved;
    }
  } catch {
    /* corrupted */
  }
  return SEED_USERS;
}

function loadSession(users: StoredUser[]): User | null {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const found = users.find((u) => u.email === email);
    if (!found) return null;
    const { password: _pw, ...rest } = found;
    return rest;
  } catch {
    return null;
  }
}

/* ---------- context ---------- */
type SignupInput = { name: string; email: string; phone: string; group: string; password: string };
type LoginInput = { identifier: string; password: string };

type Auth = {
  user: User | null;
  signup: (input: SignupInput) => string | null; // returns error message or null
  login: (input: LoginInput) => string | null;
  logout: () => void;
};

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredUser[]>(loadUsers);
  const [user, setUser] = useState<User | null>(() => loadSession(loadUsers()));

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* storage unavailable */
    }
  }, [users]);

  const signup = (input: SignupInput): string | null => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "ایمیل معتبر وارد کن";
    if (users.some((u) => u.email.toLowerCase() === email)) return "این ایمیل قبلاً ثبت شده؛ وارد شو";
    if (input.password.length < 6) return "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (input.name.trim().length < 3) return "نام و نام خانوادگی را کامل بنویس";
    const next: StoredUser = {
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      group: input.group,
      role: "student",
      password: input.password,
    };
    setUsers((u) => [...u, next]);
    const { password: _pw, ...rest } = next;
    try {
      localStorage.setItem(SESSION_KEY, email);
    } catch {
      /* noop */
    }
    setUser(rest);
    return null;
  };

  const login = (input: LoginInput): string | null => {
    const id = input.identifier.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === id || (u.phone && u.phone === input.identifier.trim())
    );
    if (!found) return "حسابی با این ایمیل یا موبایل پیدا نشد";
    if (found.password !== input.password) return "رمز عبور اشتباه است";
    const { password: _pw, ...rest } = found;
    try {
      localStorage.setItem(SESSION_KEY, found.email);
    } catch {
      /* noop */
    }
    setUser(rest);
    return null;
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
    setUser(null);
  };

  return <Ctx.Provider value={{ user, signup, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): Auth {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
