/**
 * ═══════════════════════════════════════════════════════════════
 *  لایهٔ API رتبه‌شو — تنها مرز بین فرانت‌اند و داده
 * ═══════════════════════════════════════════════════════════════
 *  هیچ کامپوننتی حق ندارد مستقیم به localStorage یا دیتابیس دست بزند؛
 *  همه‌چیز از این ماژول عبور می‌کند.
 *
 *  ▸ نسخهٔ دمو: درخواست‌ها با تأخیر شبیه‌سازی‌شده (latency) به موتور db می‌روند.
 *  ▸ نسخهٔ تولید: کافی است بدنهٔ تابع `request` را با fetch/axios جایگزین کنید؛
 *    امضای همهٔ متدها ثابت می‌ماند و حتی یک کامپوننت هم تغییر نمی‌کند.
 *
 *    const res = await fetch(`${API_BASE}${endpoint}`, { method, body: JSON.stringify(payload) });
 *    if (!res.ok) throw new ApiError(res.status);
 *    return res.json();
 *
 *  آدرس بک‌اند از متغیر محیطی می‌آید:  VITE_API_BASE_URL=https://api.ratbesho.ir/api/v1
 *  جدول کامل اندپوینت‌های REST معادل، در فایل BACKEND.md آمده است.
 */
import { db, delay, faDate, uid, SEED_ACTIVITY } from "./db";
import type { SiteData } from "../data";
import type {
  ActivityState,
  LoginInput,
  Message,
  Order,
  OrderItem,
  Reservation,
  SignupInput,
  StoredUser,
  User,
} from "./types";

export const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";

const SIMULATED_LATENCY = 140; // ms — حس شبکهٔ واقعی در دمو

async function request<T>(endpoint: string, handler: () => T): Promise<T> {
  // ── در نسخهٔ تولید، این خط با یک HTTP call واقعی جایگزین می‌شود ──
  void endpoint; // برای مستندسازی مسیر REST
  await delay(SIMULATED_LATENCY + Math.random() * 160);
  return handler();
}

const strip = ({ password: _pw, ...rest }: StoredUser): User => rest;

const RES_FLOW = ["در انتظار", "تأیید شده", "انجام شده"];
const ORDER_FLOW = ["در حال پردازش", "ارسال شده", "تحویل شده"];
const cycle = (flow: string[], cur: string) => flow[(flow.indexOf(cur) + 1) % flow.length];

export { db, faDate, uid, SEED_ACTIVITY };
export type { ActivityState, LoginInput, Message, Order, OrderItem, Reservation, SignupInput, User };

/* ═══════════════ api ═══════════════ */
export const api = {
  /* ── احراز هویت ─────────────────────────────
     POST /auth/signup · POST /auth/login · POST /auth/logout · GET /auth/me */
  auth: {
    current(): User | null {
      const email = db.loadSession();
      if (!email) return null;
      const found = db.loadUsers().find((u) => u.email === email);
      return found ? strip(found) : null;
    },
    async signup(input: SignupInput): Promise<User> {
      return request("POST /auth/signup", () => {
        const email = input.email.trim().toLowerCase();
        const users = db.loadUsers();
        if (users.some((u) => u.email.toLowerCase() === email)) throw new Error("این ایمیل قبلاً ثبت شده؛ وارد شو");
        if (users.some((u) => u.phone && u.phone === input.phone.trim()))
          throw new Error("این شماره موبایل قبلاً ثبت شده؛ وارد شو");
        const next: StoredUser = {
          name: input.name.trim(),
          email,
          phone: input.phone.trim(),
          group: input.group,
          role: "student",
          password: input.password,
        };
        db.saveUsers([...users, next]);
        db.saveSession(email);
        return strip(next);
      });
    },
    async login(input: LoginInput): Promise<User> {
      return request("POST /auth/login", () => {
        const id = input.identifier.trim().toLowerCase();
        const found = db.loadUsers().find(
          (u) => u.email.toLowerCase() === id || (u.phone && u.phone === input.identifier.trim())
        );
        if (!found) throw new Error("حسابی با این ایمیل یا موبایل پیدا نشد");
        if (found.password !== input.password) throw new Error("رمز عبور اشتباه است");
        db.saveSession(found.email);
        return strip(found);
      });
    },
    async logout(): Promise<void> {
      return request("POST /auth/logout", () => db.clearSession());
    },
    async registerUser(user: StoredUser): Promise<void> {
      return request("POST /auth/users", () => void db.saveUsers([...db.loadUsers(), user]));
    },
  },

  /* ── محتوای سایت (CMS) ──────────────────────
     GET /content · PUT /content · POST /content/reset */
  content: {
    get: (): SiteData => db.loadSite(),
    async save(site: SiteData): Promise<void> {
      return request("PUT /content", () => db.saveSite(site));
    },
    async reset(): Promise<SiteData> {
      return request("POST /content/reset", () => {
        db.resetSite();
        return db.loadSite();
      });
    },
  },

  /* ── فعالیت‌ها (سفارش، سبد، رزرو، پیام، مطالعه) ──
     GET /activity · PUT /activity */
  activity: {
    get: (): ActivityState => db.loadActivity(),
    async save(state: ActivityState): Promise<void> {
      return request("PUT /activity", () => db.saveActivity(state));
    },
  },

  /* ── سفارش‌ها ───────────────────────────────
     POST /orders · GET /orders · PATCH /orders/:id/status */
  orders: {
    async checkout(cart: OrderItem[], customer: string): Promise<Order> {
      return request("POST /orders", () => ({
        id: uid(),
        customer,
        items: cart,
        total: cart.reduce((a, b) => a + b.price * b.qty, 0),
        date: faDate(),
        status: "در حال پردازش",
      }));
    },
    nextStatus: (cur: string) => cycle(ORDER_FLOW, cur),
  },

  /* ── رزرو مشاوره ────────────────────────────
     POST /reservations · GET /reservations · PATCH /reservations/:id/status */
  reservations: {
    async create(input: Omit<Reservation, "id" | "date" | "status" | "code">): Promise<Reservation> {
      return request("POST /reservations", () => ({
        ...input,
        id: uid(),
        code: `RS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: faDate(),
        status: "در انتظار",
      }));
    },
    nextStatus: (cur: string) => cycle(RES_FLOW, cur),
  },

  /* ── پیام‌های پشتیبانی ──────────────────────
     POST /messages · GET /messages · PATCH /messages/:id/read · DELETE /messages/:id */
  messages: {
    async send(input: Omit<Message, "id" | "date" | "read">): Promise<Message> {
      return request("POST /messages", () => ({ ...input, id: uid(), date: faDate(), read: false }));
    },
  },

  /* ── خبرنامه ────────────────────────────────
     POST /newsletter */
  newsletter: {
    async subscribe(contact: string): Promise<void> {
      return request("POST /newsletter", () => void contact);
    },
  },
};
