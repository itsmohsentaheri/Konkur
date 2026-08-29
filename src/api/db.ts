/**
 * موتور ذخیره‌سازی (Storage Engine)
 * -------------------------------
 * در نسخهٔ دمو، «دیتابیس» همان localStorage مرورگر است.
 * این فایل تنها جایی است که به storage دست می‌زند؛ بقیهٔ برنامه فقط با api کار می‌کند.
 * در نسخهٔ نهایی، این ماژول حذف شده و api مستقیم به سرور (PostgreSQL/Redis) وصل می‌شود.
 */
import { DEFAULT_SITE, type SiteData } from "../data";
import type { ActivityState, StoredUser } from "./types";

export const KEYS = {
  site: "ratbesho-site-v1",
  activity: "ratbesho-activity-v1",
  users: "ratbesho-users-v1",
  session: "ratbesho-session-v1",
} as const;

export const faDate = () => new Intl.DateTimeFormat("fa-IR").format(new Date());
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/* ---------- seed data ---------- */
export const SEED_USERS: StoredUser[] = [
  { name: "مدیر رتبه‌شو", email: "admin@ratbesho.ir", phone: "09120000000", group: "", role: "admin", password: "admin1405" },
  { name: "نگار موسوی", email: "negar@test.ir", phone: "09121234567", group: "تجربی", role: "student", password: "123456" },
];

export const SEED_ACTIVITY: ActivityState = {
  profile: { name: "نگار موسوی", group: "تجربی", target: "پزشکی — دانشگاه تهران" },
  reservations: [
    {
      id: "seed-r1",
      code: "RS-4821",
      name: "نگار موسوی",
      phone: "09121234567",
      group: "تجربی",
      service: "مشاوره تخصصی انتخاب رشته",
      date: "۱۴۰۴/۱۰/۱۸",
      status: "انجام شده",
    },
    {
      id: "seed-r2",
      code: "RS-3107",
      name: "علی رضایی",
      phone: "09351112233",
      group: "ریاضی",
      service: "تحلیل کارنامه و تراز",
      date: "۱۴۰۴/۱۰/۲۱",
      status: "تأیید شده",
    },
    {
      id: "seed-r3",
      code: "RS-5560",
      name: "هانیه کریمی",
      phone: "09198887766",
      group: "انسانی",
      service: "پکیج همراهی کامل",
      date: "۱۴۰۴/۱۱/۰۲",
      status: "در انتظار",
    },
  ],
  orders: [
    {
      id: "seed-o1",
      customer: "نگار موسوی",
      items: [
        { title: "جزوه طلایی زیست (۳ جلد)", price: 890000, qty: 1 },
        { title: "فلش‌کارت لغات ۵۰۴ و کنکور", price: 180000, qty: 1 },
      ],
      total: 1070000,
      date: "۱۴۰۴/۱۰/۲۵",
      status: "ارسال شده",
    },
    {
      id: "seed-o2",
      customer: "امیر تهرانی",
      items: [{ title: "پکیج ویدیویی جمع‌بندی ۴۰ روزه", price: 1450000, qty: 1 }],
      total: 1450000,
      date: "۱۴۰۴/۱۱/۰۱",
      status: "در حال پردازش",
    },
  ],
  cart: [{ title: "بانک تست شیمی (۴٬۵۰۰ تست)", price: 420000, qty: 1 }],
  messages: [
    {
      id: "seed-m1",
      name: "مریم احمدی (مادر داوطلب)",
      phone: "09121114455",
      topic: "مشاوره انتخاب رشته",
      msg: "دخترم امسال کنکور تجربی می‌ده. می‌خواستم بدانم جلسات مشاوره حضوری چه روزهایی برگزار می‌شود و آیا امکان پرداخت اقساطی پکیج همراهی هست؟",
      date: "۱۴۰۴/۱۱/۰۳",
      read: false,
    },
    {
      id: "seed-m2",
      name: "سروش ملکی",
      phone: "09361239876",
      topic: "کلاس‌های آموزشی",
      msg: "کلاس فیزیک مفهومی استاد رستمی برای داوطلب ریاضی از چه سطحی شروع می‌شود؟ من پایه‌ام متوسط است.",
      date: "۱۴۰۴/۱۱/۰۴",
      read: false,
    },
    {
      id: "seed-m3",
      name: "کیان رحیمی",
      phone: "09901234567",
      topic: "محصولات و فروشگاه",
      msg: "جزوه طلایی زیست آپدیت ۱۴۰۵ را دارد؟ اگر بله لطفاً لینک خرید را برایم بفرستید.",
      date: "۱۴۰۴/۱۱/۰۵",
      read: true,
    },
  ],
  study: [240, 180, 300, 90, 260, 330, 150],
  enrolledClassIds: [1, 4],
};

/* ---------- primitives ---------- */
function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/* ---------- domain loaders ---------- */
export const db = {
  /* site content */
  loadSite(): SiteData {
    const saved = read<Partial<SiteData>>(KEYS.site);
    if (!saved) return DEFAULT_SITE;
    return { ...DEFAULT_SITE, ...saved, settings: { ...DEFAULT_SITE.settings, ...(saved.settings ?? {}) } };
  },
  saveSite: (site: SiteData) => write(KEYS.site, site),
  resetSite: () => {
    try {
      localStorage.removeItem(KEYS.site);
    } catch { /* noop */ }
  },

  /* activity (orders, cart, reservations, messages, study, profile) */
  loadActivity(): ActivityState {
    const saved = read<Partial<ActivityState>>(KEYS.activity);
    return saved ? { ...SEED_ACTIVITY, ...saved } : SEED_ACTIVITY;
  },
  saveActivity: (state: ActivityState) => write(KEYS.activity, state),

  /* users & session */
  loadUsers(): StoredUser[] {
    const saved = read<StoredUser[]>(KEYS.users);
    return Array.isArray(saved) && saved.length ? saved : SEED_USERS;
  },
  saveUsers: (users: StoredUser[]) => write(KEYS.users, users),
  loadSession(): string | null {
    try {
      return localStorage.getItem(KEYS.session);
    } catch {
      return null;
    }
  },
  saveSession: (email: string) => {
    try {
      localStorage.setItem(KEYS.session, email);
    } catch { /* noop */ }
  },
  clearSession: () => {
    try {
      localStorage.removeItem(KEYS.session);
    } catch { /* noop */ }
  },
};
