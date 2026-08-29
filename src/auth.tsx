import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "./api";
import type { LoginInput, SignupInput, User } from "./api/types";

export type { LoginInput, SignupInput, User };
export type Role = User["role"];

type Auth = {
  user: User | null;
  /** returns error message or null */
  signup: (input: SignupInput) => Promise<string | null>;
  login: (input: LoginInput) => Promise<string | null>;
  logout: () => Promise<void>;
};

const Ctx = createContext<Auth | null>(null);

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "خطای ناشناخته؛ دوباره تلاش کن");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => api.auth.current());

  const signup = async (input: SignupInput): Promise<string | null> => {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "ایمیل معتبر وارد کن";
    if (input.password.length < 6) return "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (input.name.trim().length < 3) return "نام و نام خانوادگی را کامل بنویس";
    try {
      setUser(await api.auth.signup(input));
      return null;
    } catch (e) {
      return errMsg(e);
    }
  };

  const login = async (input: LoginInput): Promise<string | null> => {
    if (!input.identifier.trim() || !input.password) return "ایمیل/موبایل و رمز را وارد کن";
    try {
      setUser(await api.auth.login(input));
      return null;
    } catch (e) {
      return errMsg(e);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return <Ctx.Provider value={{ user, signup, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): Auth {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
