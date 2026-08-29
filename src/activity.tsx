import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type {
  ActivityState,
  Message,
  Order,
  OrderItem,
  Profile,
  Reservation,
} from "./api/types";

/* سازگاری با importهای قدیمی — تایپ‌ها حالا در لایهٔ api تعریف می‌شوند */
export type { ActivityState, Message, Order, OrderItem, Profile, Reservation };

type Activity = ActivityState;

type Actions = {
  addReservation: (r: Omit<Reservation, "id" | "date" | "status" | "code">) => Promise<Reservation>;
  cycleReservationStatus: (id: string) => void;
  addToCart: (item: Omit<OrderItem, "qty">) => void;
  changeQty: (title: string, delta: number) => void;
  removeFromCart: (title: string) => void;
  checkout: (customer: string) => Promise<string | null>;
  cycleOrderStatus: (id: string) => void;
  addMessage: (m: Omit<Message, "id" | "date" | "read">) => Promise<void>;
  markRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  logStudy: (minutes: number) => void;
  enroll: (id: number) => void;
  unenroll: (id: number) => void;
  setProfile: (p: Profile) => void;
};

const Ctx = createContext<(Activity & Actions & { cartCount: number }) | null>(null);

/** index of today in the Persian week (شنبه = 0) */
export const todayWeekIndex = () => (new Date().getDay() + 1) % 7;

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Activity>(() => api.activity.get());

  /* ماندگاری: هر تغییر state از طریق api ذخیره می‌شود */
  useEffect(() => {
    void api.activity.save(state);
  }, [state]);

  const actions: Actions = {
    /* ایجاد رزرو در سمت api (مثل POST /reservations) و سپس به‌روزرسانی نما */
    addReservation: async (r) => {
      const created = await api.reservations.create(r);
      setState((s) => ({ ...s, reservations: [created, ...s.reservations] }));
      return created;
    },
    cycleReservationStatus: (id) =>
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) =>
          r.id === id ? { ...r, status: api.reservations.nextStatus(r.status) } : r
        ),
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
    checkout: async (customer) => {
      if (state.cart.length === 0) return null;
      const order = await api.orders.checkout(state.cart, customer);
      setState((s) => ({ ...s, cart: [], orders: [order, ...s.orders] }));
      return `ORD-${order.id.slice(-4).toUpperCase()}`;
    },
    cycleOrderStatus: (id) =>
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === id ? { ...o, status: api.orders.nextStatus(o.status) } : o)),
      })),
    addMessage: async (m) => {
      const created = await api.messages.send(m);
      setState((s) => ({ ...s, messages: [created, ...s.messages] }));
    },
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
