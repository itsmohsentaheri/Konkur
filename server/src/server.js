/**
 * ═══════════════════════════════════════════════════════════════
 *  رتبه‌شو — REST API (Express + SQLite + JWT)
 *  اجرا:  cd server && npm install && npm start   →  http://localhost:4000
 * ═══════════════════════════════════════════════════════════════
 */
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, seed, uid, faDate } from "./db.js";

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "ratbesho-dev-secret-change-me-in-production";
const TOKEN_TTL = "7d";

seed();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* ─────────────── helpers ─────────────── */
const strip = (u) => ({ name: u.name, email: u.email, phone: u.phone, group: u.grp ?? "", role: u.role });
const sign = (u) => jwt.sign({ email: u.email, role: u.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });
const httpError = (status, message) => Object.assign(new Error(message), { status });

function auth(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next(httpError(401, "ابتدا وارد حساب خود شوید"));
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(httpError(401, "نشست شما منقضی شده؛ دوباره وارد شوید"));
  }
}
const adminOnly = (req, _res, next) =>
  req.user?.role === "admin" ? next() : next(httpError(403, "دسترسی فقط برای مدیر مجاز است"));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ─────────────── schemas (zod) ─────────────── */
const SignupSchema = z.object({
  name: z.string().min(3, "نام و نام خانوادگی را کامل بنویس"),
  email: z.string().email("ایمیل معتبر وارد کن"),
  phone: z.string().min(10, "شماره موبایل معتبر نیست"),
  group: z.string(),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});
const LoginSchema = z.object({ identifier: z.string().min(3), password: z.string().min(1) });
const ReservationSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  group: z.string(),
  service: z.string(),
});
const OrderSchema = z.object({
  customer: z.string().min(1),
  items: z.array(z.object({ title: z.string(), price: z.number(), qty: z.number() })).min(1),
});
const MessageSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10),
  topic: z.string(),
  msg: z.string().min(10),
});
const StatusSchema = z.object({ status: z.string().min(1) });

/* ═══════════════ AUTH ═══════════════ */
app.post("/api/v1/auth/signup", wrap((req, res) => {
  const data = SignupSchema.parse(req.body);
  const email = data.email.trim().toLowerCase();
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) throw httpError(409, "این ایمیل قبلاً ثبت شده؛ وارد شو");
  db.prepare("INSERT INTO users (name, email, phone, grp, role, password_hash) VALUES (?, ?, ?, ?, 'student', ?)")
    .run(data.name.trim(), email, data.phone.trim(), data.group, bcrypt.hashSync(data.password, 10));
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  res.status(201).json({ token: sign(user), user: strip(user) });
}));

app.post("/api/v1/auth/login", wrap((req, res) => {
  const { identifier, password } = LoginSchema.parse(req.body);
  const id = identifier.trim().toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE email = ? OR phone = ?").get(id, identifier.trim());
  if (!user) throw httpError(401, "حسابی با این ایمیل یا موبایل پیدا نشد");
  if (!bcrypt.compareSync(password, user.password_hash)) throw httpError(401, "رمز عبور اشتباه است");
  res.json({ token: sign(user), user: strip(user) });
}));

app.get("/api/v1/auth/me", auth, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.user.email);
  if (!user) throw httpError(404, "کاربر پیدا نشد");
  res.json({ user: strip(user) });
});

app.post("/api/v1/auth/logout", (_req, res) => res.json({ ok: true }));

/* ═══════════════ CONTENT (CMS) ═══════════════ */
app.get("/api/v1/content", (_req, res) => {
  const row = db.prepare("SELECT site_json FROM content WHERE id = 1").get();
  res.json({ site: JSON.parse(row?.site_json ?? "{}") });
});

app.put("/api/v1/content", auth, adminOnly, wrap((req, res) => {
  const site = req.body?.site;
  if (!site || typeof site !== "object") throw httpError(400, "بدنهٔ درخواست معتبر نیست");
  db.prepare("UPDATE content SET site_json = ? WHERE id = 1").run(JSON.stringify(site));
  res.json({ ok: true });
}));

app.post("/api/v1/content/reset", auth, adminOnly, (_req, res) => {
  db.prepare("UPDATE content SET site_json = ? WHERE id = 1").run("{}");
  res.json({ site: {} });
});

/* ═══════════════ RESERVATIONS ═══════════════ */
app.get("/api/v1/reservations", auth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM reservations ORDER BY created_at DESC").all();
  res.json(rows.map((r) => ({ ...r, id: r.id, group: r.grp })));
});

app.post("/api/v1/reservations", auth, wrap((req, res) => {
  const data = ReservationSchema.parse(req.body);
  const row = {
    id: uid(),
    code: `RS-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name,
    phone: data.phone,
    grp: data.group,
    service: data.service,
    date: faDate(),
    status: "در انتظار",
  };
  db.prepare("INSERT INTO reservations (id, code, name, phone, grp, service, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(row.id, row.code, row.name, row.phone, row.grp, row.service, row.date, row.status);
  res.status(201).json({ ...row, group: row.grp });
}));

app.patch("/api/v1/reservations/:id", auth, adminOnly, wrap((req, res) => {
  const { status } = StatusSchema.parse(req.body);
  db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ ok: true });
}));

/* ═══════════════ ORDERS ═══════════════ */
app.get("/api/v1/orders", auth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  res.json(rows.map((o) => ({ ...o, items: JSON.parse(o.items_json) })));
});

app.post("/api/v1/orders", auth, wrap((req, res) => {
  const data = OrderSchema.parse(req.body);
  const total = data.items.reduce((a, b) => a + b.price * b.qty, 0);
  const row = {
    id: uid(),
    customer: data.customer,
    items: data.items,
    total,
    date: faDate(),
    status: "در حال پردازش",
  };
  db.prepare("INSERT INTO orders (id, customer, items_json, total, date, status) VALUES (?, ?, ?, ?, ?, ?)")
    .run(row.id, row.customer, JSON.stringify(row.items), row.total, row.date, row.status);
  res.status(201).json(row);
}));

app.patch("/api/v1/orders/:id", auth, adminOnly, wrap((req, res) => {
  const { status } = StatusSchema.parse(req.body);
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ ok: true });
}));

/* ═══════════════ MESSAGES ═══════════════ */
app.get("/api/v1/messages", auth, adminOnly, (_req, res) => {
  const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows.map((m) => ({ ...m, read: Boolean(m.read) })));
});

app.post("/api/v1/messages", wrap((req, res) => {
  const data = MessageSchema.parse(req.body);
  const row = { id: uid(), ...data, date: faDate(), read: false };
  db.prepare("INSERT INTO messages (id, name, phone, topic, msg, date, read) VALUES (?, ?, ?, ?, ?, ?, 0)")
    .run(row.id, row.name, row.phone, row.topic, row.msg, row.date);
  res.status(201).json(row);
}));

app.patch("/api/v1/messages/:id", auth, adminOnly, (req, res) => {
  db.prepare("UPDATE messages SET read = 1 WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

app.delete("/api/v1/messages/:id", auth, adminOnly, (req, res) => {
  db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

/* ═══════════════ ACTIVITY (dashboard state) ═══════════════ */
app.get("/api/v1/activity", auth, (_req, res) => {
  const row = db.prepare("SELECT * FROM activity WHERE id = 1").get();
  res.json({
    profile: JSON.parse(row?.profile_json ?? "{}"),
    cart: JSON.parse(row?.cart_json ?? "[]"),
    study: JSON.parse(row?.study_json ?? "[]"),
    enrolledClassIds: JSON.parse(row?.enrolled_json ?? "[]"),
  });
});

app.put("/api/v1/activity", auth, wrap((req, res) => {
  const { profile, cart, study, enrolledClassIds } = req.body ?? {};
  db.prepare("UPDATE activity SET profile_json = ?, cart_json = ?, study_json = ?, enrolled_json = ? WHERE id = 1")
    .run(
      JSON.stringify(profile ?? {}),
      JSON.stringify(cart ?? []),
      JSON.stringify(study ?? []),
      JSON.stringify(enrolledClassIds ?? [])
    );
  res.json({ ok: true });
}));

/* ═══════════════ NEWSLETTER ═══════════════ */
app.post("/api/v1/newsletter", wrap((req, res) => {
  const email = String(req.body?.contact ?? "").trim();
  if (!email) throw httpError(400, "ایمیل یا موبایل را وارد کنید");
  db.prepare("INSERT INTO newsletter (email) VALUES (?)").run(email);
  res.status(201).json({ ok: true });
}));

/* ═══════════════ health & errors ═══════════════ */
app.get("/api/v1/health", (_req, res) =>
  res.json({ ok: true, service: "ratbesho-api", time: new Date().toISOString() })
);

app.use((_req, res) => res.status(404).json({ message: "مسیر پیدا نشد" }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: "دادهٔ ارسالی معتبر نیست", issues: err.issues.map((i) => i.message) });
  }
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "خطای داخلی سرور" });
});

app.listen(PORT, () => {
  console.log(`🚀  ratbesho-api running →  http://localhost:${PORT}/api/v1/health`);
});
