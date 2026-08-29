/**
 * لایهٔ دیتابیس — SQLite (فایل local)
 * برای مقیاس بزرگ، کافی است این فایل را با PostgreSQL/Prisma جایگزین کنید؛
 * امضای توابع تغییری نمی‌کند.
 */
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "ratbesho.db"));
db.pragma("journal_mode = WAL");

/* ---------- schema ---------- */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  grp TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  grp TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  items_json TEXT NOT NULL,
  total INTEGER NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  topic TEXT NOT NULL,
  msg TEXT NOT NULL,
  date TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  profile_json TEXT NOT NULL,
  cart_json TEXT NOT NULL,
  study_json TEXT NOT NULL,
  enrolled_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

/* ---------- helpers ---------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const faDate = () => new Intl.DateTimeFormat("fa-IR").format(new Date());

/* ---------- seed ---------- */
export function seed() {
  const userCount = db.prepare("SELECT COUNT(*) c FROM users").get().c;
  if (userCount === 0) {
    const insert = db.prepare(
      "INSERT INTO users (name, email, phone, grp, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)"
    );
    insert.run("مدیر رتبه‌شو", "admin@ratbesho.ir", "09120000000", "", "admin", bcrypt.hashSync("admin1405", 10));
    insert.run("نگار موسوی", "negar@test.ir", "09121234567", "تجربی", "student", bcrypt.hashSync("123456", 10));
  }

  const resCount = db.prepare("SELECT COUNT(*) c FROM reservations").get().c;
  if (resCount === 0) {
    const insert = db.prepare(
      "INSERT INTO reservations (id, code, name, phone, grp, service, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run(uid(), "RS-4821", "نگار موسوی", "09121234567", "تجربی", "مشاوره تخصصی انتخاب رشته", "۱۴۰۴/۱۰/۱۸", "انجام شده");
    insert.run(uid(), "RS-3107", "علی رضایی", "09351112233", "ریاضی", "تحلیل کارنامه و تراز", "۱۴۰۴/۱۰/۲۱", "تأیید شده");
    insert.run(uid(), "RS-5560", "هانیه کریمی", "09198887766", "انسانی", "پکیج همراهی کامل", "۱۴۰۴/۱۱/۰۲", "در انتظار");
  }

  const orderCount = db.prepare("SELECT COUNT(*) c FROM orders").get().c;
  if (orderCount === 0) {
    const insert = db.prepare(
      "INSERT INTO orders (id, customer, items_json, total, date, status) VALUES (?, ?, ?, ?, ?, ?)"
    );
    insert.run(
      uid(),
      "نگار موسوی",
      JSON.stringify([
        { title: "جزوه طلایی زیست (۳ جلد)", price: 890000, qty: 1 },
        { title: "فلش‌کارت لغات ۵۰۴ و کنکور", price: 180000, qty: 1 },
      ]),
      1070000,
      "۱۴۰۴/۱۰/۲۵",
      "ارسال شده"
    );
    insert.run(
      uid(),
      "امیر تهرانی",
      JSON.stringify([{ title: "پکیج ویدیویی جمع‌بندی ۴۰ روزه", price: 1450000, qty: 1 }]),
      1450000,
      "۱۴۰۴/۱۱/۰۱",
      "در حال پردازش"
    );
  }

  const msgCount = db.prepare("SELECT COUNT(*) c FROM messages").get().c;
  if (msgCount === 0) {
    const insert = db.prepare(
      "INSERT INTO messages (id, name, phone, topic, msg, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    insert.run(uid(), "مریم احمدی (مادر داوطلب)", "09121114455", "مشاوره انتخاب رشته", "دخترم امسال کنکور تجربی می‌ده. می‌خواستم بدانم جلسات مشاوره حضوری چه روزهایی برگزار می‌شود؟", "۱۴۰۴/۱۱/۰۳", 0);
    insert.run(uid(), "سروش ملکی", "09361239876", "کلاس‌های آموزشی", "کلاس فیزیک مفهومی استاد رستمی برای داوطلب ریاضی از چه سطحی شروع می‌شود؟", "۱۴۰۴/۱۱/۰۴", 0);
  }

  const actCount = db.prepare("SELECT COUNT(*) c FROM activity").get().c;
  if (actCount === 0) {
    db.prepare(
      "INSERT INTO activity (id, profile_json, cart_json, study_json, enrolled_json) VALUES (1, ?, ?, ?, ?)"
    ).run(
      JSON.stringify({ name: "نگار موسوی", group: "تجربی", target: "پزشکی — دانشگاه تهران" }),
      JSON.stringify([{ title: "بانک تست شیمی (۴٬۵۰۰ تست)", price: 420000, qty: 1 }]),
      JSON.stringify([240, 180, 300, 90, 260, 330, 150]),
      JSON.stringify([1, 4])
    );
  }

  const contentCount = db.prepare("SELECT COUNT(*) c FROM content").get().c;
  if (contentCount === 0) {
    db.prepare("INSERT INTO content (id, site_json) VALUES (1, ?)").run("{}");
  }
}

export { uid };
