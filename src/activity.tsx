import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* ---------- types ---------- */
export type Reservation = {
  id: string;
  code: string;
  name: string;
  phone: string;
  group: string;
  service: string;
  date: string;
  status: string;
};
export type OrderItem = { title: string; price: number; qty: number };
export type Order = {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
};
export type Message = {
  id: string;
  name: string;
  phone: string;
  topic: string;
  msg: string;
  date: string;
  read: boolean;
};
export type Profile = { name: string; group: string; target: string };

type Activity = {
  profile: Profile;
  reservations: Reservation[];
  orders: Order[];
  cart: OrderItem[];
  messages: Message[];
  /** minutes studied per weekday — شنبه تا جمعه */
  study: number[];
  enrolledClassIds: number[];
};

const KEY = "ratbesho-activity-v1";

export const faDate = () => new Intl.DateTimeFormat("fa-IR").format(new Date());
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const SEED: Activity = {
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

/* ---------- context ---------- */
type Actions = {
  addReservation: (r: Omit<Reservation, "id" | "date" | "status">) => void;
  cycleReservationStatus: (id: string) => void;
  addToCart: (item: { title: string; price: number }) => void;
  changeQty: (title: string, delta: number) => void;
  removeFromCart: (title: string) => void;
  checkout: (customer: string) => string;
  cycleOrderStatus: (id: string) => void;
  addMessage: (m: Omit<Message, "id" | "date" | "read">) => void;
  markRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  logStudy: (minutes: number) => void;
  enroll: (id: number) => void;
  unenroll: (id: number) => void;
  setProfile: (p: Profile) => void;
};

const Ctx = createContext<(Activity & Actions & { cartCount: number }) | null>(null);

const RES_FLOW = ["در انتظار", "تأیید شده", "انجام شده"];
const ORDER_FLOW = ["در حال پردازش", "ارسال شده", "تحویل شده"];
const cycle = (flow: string[], cur: string) => flow[(flow.indexOf(cur) + 1) % flow.length];

/** index of today in the Persian week (شنبه = 0) */
export const todayWeekIndex = () => (new Date().getDay() + 1) % 7;

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Activity>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...SEED, ...(JSON.parse(raw) as Partial<Activity>) };
    } catch {
      /* corrupted storage */
    }
    return SEED;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const actions: Actions = {
    addReservation: (r) =>
      setState((s) => ({
        ...s,
        reservations: [{ ...r, id: uid(), date: faDate(), status: "در انتظار" }, ...s.reservations],
      })),
    cycleReservationStatus: (id) =>
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => (r.id === id ? { ...r, status: cycle(RES_FLOW, r.status) } : r)),
      })),
    addToCart: (item) =>
      setState((s) => {
        const existing = s.cart.find((c) => c.title === item.title);
        return existing
          ? { ...s, cart: s.cart.map((c) => (c.title === item.title ? { ...c, qty: c.qty + 1 } : c)) }
          : { ...s, cart: [...s.cart, { ...item, qty: 1 }] };
      }),
    changeQty: (title, delta) =>
      setState((s) => ({
        ...s,
        cart: s.cart.map((c) => (c.title === title ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0),
      })),
    removeFromCart: (title) => setState((s) => ({ ...s, cart: s.cart.filter((c) => c.title !== title) })),
    checkout: (customer) => {
      const code = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setState((s) =>
        s.cart.length === 0
          ? s
          : {
              ...s,
              cart: [],
              orders: [
                {
                  id: uid(),
                  customer,
                  items: s.cart,
                  total: s.cart.reduce((a, b) => a + b.price * b.qty, 0),
                  date: faDate(),
                  status: "در حال پردازش",
                },
                ...s.orders,
              ],
            }
      );
      return code;
    },
    cycleOrderStatus: (id) =>
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === id ? { ...o, status: cycle(ORDER_FLOW, o.status) } : o)),
      })),
    addMessage: (m) =>
      setState((s) => ({ ...s, messages: [{ ...m, id: uid(), date: faDate(), read: false }, ...s.messages] })),
    markRead: (id) =>
      setState((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })),
    deleteMessage: (id) => setState((s) => ({ ...s, messages: s.messages.filter((m) => m.id !== id) })),
    logStudy: (minutes) =>
      setState((s) => {
        const idx = todayWeekIndex();
        const study = [...s.study];
        study[idx] += minutes;
        return { ...s, study };
      }),
    enroll: (id) =>
      setState((s) =>
        s.enrolledClassIds.includes(id) ? s : { ...s, enrolledClassIds: [...s.enrolledClassIds, id] }
      ),
    unenroll: (id) =>
      setState((s) => ({ ...s, enrolledClassIds: s.enrolledClassIds.filter((x) => x !== id) })),
    setProfile: (p) => setState((s) => ({ ...s, profile: p })),
  };

  const cartCount = state.cart.reduce((a, b) => a + b.qty, 0);
  return <Ctx.Provider value={{ ...state, ...actions, cartCount }}>{children}</Ctx.Provider>;
}

export function useActivity() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useActivity must be used inside <ActivityProvider>");
  return ctx;
}
