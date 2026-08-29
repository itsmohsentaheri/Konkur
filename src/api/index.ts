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
import { http, REMOTE } from "./client";
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

/** آیا فرانت به بک‌اند Node.js واقعی وصل است یا در حالت دمو؟ */
export { REMOTE };

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
      if (REMOTE) {
        const res = await http.post<{ token: string; user: User }>("/auth/signup", input);
        http.setToken(res.token);
        db.saveSession(res.user.email);
        return res.user;
      }
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
      if (REMOTE) {
        const res = await http.post<{ token: string; user: User }>("/auth/login", input);
        http.setToken(res.token);
        db.saveSession(res.user.email);
        return res.user;
      }
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
      if (REMOTE) {
        try {
          await http.post("/auth/logout");
        } catch {
          /* even if server unreachable, clear local session */
        }
        http.clearToken();
        db.clearSession();
        return;
      }
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
      // همیشه نسخهٔ محلی را نگه می‌داریم (برای رندر فوری و حالت دمو)
      db.saveSite(site);
      if (REMOTE) {
        try {
          await http.put("/content", { site });
        } catch {
          /* اگر سرور در دسترس نبود، تغییر بعدی دوباره تلاش می‌کند */
        }
      }
    },
    async reset(): Promise<SiteData> {
      if (REMOTE) {
        try {
          await http.post("/content/reset");
        } catch {
          /* noop */
        }
      }
      db.resetSite();
      return db.loadSite();
    },
  },

  /* ── فعالیت‌ها (سفارش، سبد، رزرو، پیام، مطالعه) ──
     GET /activity · PUT /activity */
  activity: {
    get: (): ActivityState => db.loadActivity(),
    async save(state: ActivityState): Promise<void> {
      db.saveActivity(state);
      if (REMOTE) {
        try {
          await http.put("/activity", {
            profile: state.profile,
            cart: state.cart,
            study: state.study,
            enrolledClassIds: state.enrolledClassIds,
          });
        } catch {
          /* noop */
        }
      }
    },
    /** فقط در حالت REMOTE: دریافت وضعیت از سرور و ترکیب با state محلی */
    async fetch(): Promise<Partial<ActivityState> | null> {
      if (!REMOTE) return null;
      try {
        const [activity, reservations, orders] = await Promise.all([
          http.get<Partial<ActivityState>>("/activity"),
          http.get<Reservation[]>("/reservations"),
          http.get<Order[]>("/orders"),
        ]);
        return { ...activity, reservations, orders };
      } catch {
        return null;
      }
    },
  },

  /* ── سفارش‌ها ───────────────────────────────
     POST /orders · GET /orders · PATCH /orders/:id/status */
  orders: {
    async checkout(cart: OrderItem[], customer: string): Promise<Order> {
      if (REMOTE) {
        const order = await http.post<Order>("/orders", { customer, items: cart });
        return order;
      }
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
    async updateStatus(id: string, status: string): Promise<void> {
      if (REMOTE) {
        try {
          await http.patch(`/orders/${id}`, { status });
        } catch {
          /* noop */
        }
      }
    },
  },

  /* ── رزرو مشاوره ────────────────────────────
     POST /reservations · GET /reservations · PATCH /reservations/:id/status */
  reservations: {
    async create(input: Omit<Reservation, "id" | "date" | "status" | "code">): Promise<Reservation> {
      if (REMOTE) {
        return await http.post<Reservation>("/reservations", input);
      }
      return request("POST /reservations", () => ({
        ...input,
        id: uid(),
        code: `RS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: faDate(),
        status: "در انتظار",
      }));
    },
    nextStatus: (cur: string) => cycle(RES_FLOW, cur),
    async updateStatus(id: string, status: string): Promise<void> {
      if (REMOTE) {
        try {
          await http.patch(`/reservations/${id}`, { status });
        } catch {
          /* noop */
        }
      }
    },
  },

  /* ── پیام‌های پشتیبانی ──────────────────────
     POST /messages · GET /messages · PATCH /messages/:id/read · DELETE /messages/:id */
  messages: {
    async send(input: Omit<Message, "id" | "date" | "read">): Promise<Message> {
      if (REMOTE) {
        return await http.post<Message>("/messages", input);
      }
      return request("POST /messages", () => ({ ...input, id: uid(), date: faDate(), read: false }));
    },
    async markRead(id: string): Promise<void> {
      if (REMOTE) {
        try {
          await http.patch(`/messages/${id}`);
        } catch {
          /* noop */
        }
      }
    },
    async remove(id: string): Promise<void> {
      if (REMOTE) {
        try {
          await http.del(`/messages/${id}`);
        } catch {
          /* noop */
        }
      }
    },
  },

  /* ── خبرنامه ────────────────────────────────
     POST /newsletter */
  newsletter: {
    async subscribe(contact: string): Promise<void> {
      if (REMOTE) {
        try {
          await http.post("/newsletter", { contact });
        } catch {
          /* noop */
        }
        return;
      }
      return request("POST /newsletter", () => void contact);
    },
  },
};
