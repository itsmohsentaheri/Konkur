/**
 * تایپ‌های دامنه‌ای رتبه‌شو (Domain Types)
 * این تایپ‌ها قرارداد مشترک فرانت‌اند و بک‌اند هستند.
 * وقتی بک‌اند واقعی (NestJS/Express/...) ساخته شد، دقیقاً همین تایپ‌ها
 * در سمت سرور هم استفاده می‌شوند تا دو طرف همیشه هماهنگ بمانند.
 */

/* ---------- auth ---------- */
export type Role = "student" | "admin";
export type User = {
  name: string;
  email: string;
  phone: string;
  group: string;
  role: Role;
};
export type StoredUser = User & { password: string };
export type SignupInput = { name: string; email: string; phone: string; group: string; password: string };
export type LoginInput = { identifier: string; password: string };

/* ---------- shop & orders ---------- */
export type OrderItem = { title: string; price: number; qty: number };
export type Order = {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: string;
};

/* ---------- consulting ---------- */
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

/* ---------- support ---------- */
export type Message = {
  id: string;
  name: string;
  phone: string;
  topic: string;
  msg: string;
  date: string;
  read: boolean;
};

/* ---------- student ---------- */
export type Profile = { name: string; group: string; target: string };

export type ActivityState = {
  profile: Profile;
  reservations: Reservation[];
  orders: Order[];
  cart: OrderItem[];
  messages: Message[];
  /** minutes studied per weekday — شنبه تا جمعه */
  study: number[];
  enrolledClassIds: number[];
};

/* ---------- api errors ---------- */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };
