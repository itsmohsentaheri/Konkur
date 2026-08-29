import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../store";
import { useAuth } from "../auth";
import { fa } from "../ui";
import { Seo } from "../seo";
import { PRODUCT_FILTERS } from "../data";
import {
  IcArrow,
  IcBook,
  IcCap,
  IcCart,
  IcChat,
  IcCheck,
  IcGear,
  IcLock,
  IcPencil,
  IcPlus,
  IcSpark,
  IcStar,
  IcTarget,
  IcUsers,
  IcX,
} from "../icons";

const ADMIN_PASS = "admin1405";

/* ---------------- generic field machinery ---------------- */

type FieldType = "text" | "number" | "select" | "textarea" | "color";
type FieldDef = { key: string; label: string; type?: FieldType; options?: string[] };

const inputCls =
  "w-full h-11 px-3.5 rounded-lg bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors";

function Field({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const type: FieldType = def.type ?? "text";
  const label = <label className="block text-xs font-bold text-muted mb-1.5">{def.label}</label>;
  if (type === "select")
    return (
      <div>
        {label}
        <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {(def.options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  if (type === "textarea")
    return (
      <div>
        {label}
        <textarea
          className={`${inputCls} h-28 py-2.5 resize-none`}
          value={typeof value === "string" ? value : Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  if (type === "color")
    return (
      <div>
        {label}
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="w-11 h-11 rounded-lg border-2 border-ink/15 bg-paper cursor-pointer shrink-0"
            value={/^#[0-9a-fA-F]{6}$/.test(String(value)) ? String(value) : "#14a0a0"}
            onChange={(e) => onChange(e.target.value)}
          />
          <input className={inputCls} dir="ltr" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    );
  if (type === "number")
    return (
      <div>
        {label}
        <input
          type="number"
          className={inputCls}
          dir="ltr"
          value={value === undefined || value === null || value === "" ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      </div>
    );
  return (
    <div>
      {label}
      <input className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ---------------- collection configs ---------------- */

type CollKey = "classes" | "products" | "services" | "steps" | "teachers" | "testimonials" | "faqs" | "stats";

type CollDef = {
  key: CollKey;
  label: string;
  desc: string;
  icon: ReactNode;
  hasId?: boolean;
  fields: FieldDef[];
  blank: () => Record<string, unknown>;
  preview: (it: Record<string, unknown>) => { title: string; sub: string };
};

const COLLS: CollDef[] = [
  {
    key: "classes",
    label: "کلاس‌ها",
    desc: "کلاس‌های آموزشی صفحهٔ کلاس‌ها و صفحهٔ اصلی",
    icon: <IcCap className="w-5 h-5" />,
    hasId: true,
    fields: [
      { key: "title", label: "عنوان کلاس" },
      { key: "teacher", label: "استاد" },
      { key: "group", label: "گروه آزمایشی", type: "select", options: ["تجربی", "ریاضی", "انسانی", "عمومی"] },
      { key: "sessions", label: "تعداد جلسه", type: "number" },
      { key: "hours", label: "ساعت آموزش", type: "number" },
      { key: "price", label: "قیمت (تومان)", type: "number" },
      { key: "oldPrice", label: "قیمت قبل — اختیاری", type: "number" },
      { key: "capacity", label: "درصد تکمیل ظرفیت", type: "number" },
      { key: "rating", label: "امتیاز (از ۵)", type: "number" },
      { key: "students", label: "تعداد دانش‌آموز", type: "number" },
      { key: "schedule", label: "زمان‌بندی" },
      { key: "mode", label: "نحوهٔ برگزاری" },
      { key: "badge", label: "نشان — اختیاری" },
      { key: "accent", label: "رنگ تأکیدی", type: "select", options: ["saffron", "coral", "teal", "ink"] },
    ],
    blank: () => ({
      id: 0,
      title: "",
      teacher: "",
      group: "تجربی",
      sessions: 12,
      hours: 24,
      price: 1000000,
      oldPrice: 0,
      capacity: 20,
      rating: 4.5,
      students: 0,
      schedule: "شنبه‌ها ۱۶:۰۰",
      mode: "آنلاین زنده",
      badge: "",
      accent: "teal",
    }),
    preview: (it) => ({ title: String(it.title), sub: `${it.teacher} • ${it.group} • ${fa(Number(it.price).toLocaleString("en-US"))} تومان` }),
  },
  {
    key: "products",
    label: "محصولات",
    desc: "محصولات فروشگاه و قفسهٔ صفحهٔ اصلی",
    icon: <IcCart className="w-5 h-5" />,
    hasId: true,
    fields: [
      { key: "title", label: "نام محصول" },
      { key: "type", label: "نوع", type: "select", options: PRODUCT_FILTERS.slice(1) },
      { key: "price", label: "قیمت (تومان)", type: "number" },
      { key: "oldPrice", label: "قیمت قبل — اختیاری", type: "number" },
      { key: "rating", label: "امتیاز (از ۵)", type: "number" },
      { key: "sold", label: "تعداد فروش", type: "number" },
      { key: "meta", label: "توضیح کوتاه (مثلاً ۶۸۰ صفحه • تست نشان‌دار)" },
      { key: "badge", label: "نشان — اختیاری" },
      { key: "color", label: "رنگ جلد", type: "color" },
      { key: "initial", label: "حرف روی جلد" },
    ],
    blank: () => ({
      id: 0,
      title: "",
      type: "جزوه",
      price: 200000,
      oldPrice: 0,
      rating: 4.5,
      sold: 0,
      meta: "",
      badge: "",
      color: "#14a0a0",
      initial: "م",
    }),
    preview: (it) => ({ title: String(it.title), sub: `${it.type} • ${fa(Number(it.price).toLocaleString("en-US"))} تومان` }),
  },
  {
    key: "services",
    label: "خدمات مشاوره",
    desc: "کارت‌های خدمات صفحهٔ مشاوره",
    icon: <IcChat className="w-5 h-5" />,
    hasId: true,
    fields: [
      { key: "title", label: "عنوان خدمت" },
      { key: "duration", label: "مدت جلسه" },
      { key: "price", label: "قیمت (تومان)", type: "number" },
      { key: "badge", label: "نشان — اختیاری" },
      { key: "features", label: "امکانات (هر خط یک مورد)", type: "textarea" },
    ],
    blank: () => ({ id: 0, title: "", duration: "۶۰ دقیقه", price: 300000, badge: "", features: [] }),
    preview: (it) => ({
      title: String(it.title),
      sub: `${it.duration} • ${fa(Number(it.price).toLocaleString("en-US"))} تومان`,
    }),
  },
  {
    key: "steps",
    label: "مراحل همکاری",
    desc: "مراحل چهارگانهٔ ستون چسبان صفحهٔ مشاوره",
    icon: <IcTarget className="w-5 h-5" />,
    fields: [
      { key: "n", label: "شماره (مثلاً ۰۱)" },
      { key: "title", label: "عنوان مرحله" },
      { key: "desc", label: "توضیح", type: "textarea" },
    ],
    blank: () => ({ n: "۰۵", title: "", desc: "" }),
    preview: (it) => ({ title: `${it.n} — ${it.title}`, sub: String(it.desc) }),
  },
  {
    key: "teachers",
    label: "اساتید",
    desc: "کارت اساتید صفحهٔ اساتید و صفحهٔ اصلی",
    icon: <IcUsers className="w-5 h-5" />,
    fields: [
      { key: "name", label: "نام استاد" },
      { key: "field", label: "درس / تخصص" },
      { key: "credit", label: "اعتبارنامه (مثلاً رتبه ۲۳ منطقه)" },
      { key: "years", label: "سال تدریس", type: "number" },
      { key: "students", label: "تعداد دانش‌آموز", type: "number" },
      { key: "quote", label: "جملهٔ استاد", type: "textarea" },
      { key: "color", label: "رنگ کارت", type: "color" },
      { key: "initial", label: "حرف آواتار" },
    ],
    blank: () => ({ name: "", field: "", credit: "", years: 5, students: 0, quote: "", color: "#14a0a0", initial: "ا" }),
    preview: (it) => ({ title: String(it.name), sub: String(it.field) }),
  },
  {
    key: "testimonials",
    label: "قبولی‌ها",
    desc: "نظرات داوطلبان قبول‌شده",
    icon: <IcStar className="w-5 h-5" />,
    fields: [
      { key: "name", label: "نام داوطلب" },
      { key: "rank", label: "رتبه (مثلاً رتبه ۱۴۲ منطقه ۱)" },
      { key: "major", label: "رشته و دانشگاه" },
      { key: "quote", label: "متن نظر", type: "textarea" },
    ],
    blank: () => ({ name: "", rank: "", major: "", quote: "" }),
    preview: (it) => ({ title: String(it.name), sub: `${it.rank} • ${it.major}` }),
  },
  {
    key: "faqs",
    label: "سوالات متداول",
    desc: "سوالات صفحهٔ تماس و سوالات",
    icon: <IcPencil className="w-5 h-5" />,
    fields: [
      { key: "q", label: "سوال" },
      { key: "a", label: "پاسخ", type: "textarea" },
    ],
    blank: () => ({ q: "", a: "" }),
    preview: (it) => ({ title: String(it.q), sub: String(it.a) }),
  },
  {
    key: "stats",
    label: "آمار صفحه اصلی",
    desc: "چهار عدد آماری زیر هدر صفحهٔ اصلی",
    icon: <IcSpark className="w-5 h-5" />,
    fields: [
      { key: "label", label: "عنوان" },
      { key: "value", label: "عدد", type: "number" },
      { key: "suffix", label: "پسوند (مثلاً + یا ٪)" },
    ],
    blank: () => ({ label: "", value: 0, suffix: "" }),
    preview: (it) => ({ title: String(it.label), sub: `${fa(Number(it.value).toLocaleString("en-US"))}${it.suffix}` }),
  },
];

const SETTINGS_FIELDS: FieldDef[] = [
  { key: "heroBadge", label: "نشان بالای صفحه اصلی" },
  { key: "heroTitle1", label: "تیتر — خط اول" },
  { key: "heroTitle2Pre", label: "تیتر — خط دوم (قبل از هایلایت)" },
  { key: "heroHighlight", label: "متن هایلایت‌شده با ماژیک" },
  { key: "heroDesc", label: "توضیح زیر تیتر", type: "textarea" },
  { key: "phone", label: "تلفن" },
  { key: "email", label: "ایمیل" },
  { key: "address", label: "آدرس دفتر", type: "textarea" },
];

/* ---------------- collection CRUD tab ---------------- */

function CollectionTab({ conf }: { conf: CollDef }) {
  const { site, set } = useSite();
  const items = site[conf.key] as Record<string, unknown>[];
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [confirm, setConfirm] = useState<number | null>(null);

  const open = (idx: number | "new") => {
    setDraft(idx === "new" ? conf.blank() : { ...(items[idx] as object) });
    setEditing(idx);
  };

  const save = () => {
    const parsed: Record<string, unknown> = { ...draft };
    conf.fields.forEach((f) => {
      if (f.type === "number") parsed[f.key] = Number(parsed[f.key]) || 0;
    });
    if (parsed.features !== undefined && typeof parsed.features === "string")
      parsed.features = (parsed.features as string).split("\n").map((x) => x.trim()).filter(Boolean);
    if (conf.hasId) {
      const existingId = typeof editing === "number" ? Number(items[editing].id) : 0;
      parsed.id = existingId || items.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
    }
    const next = editing === "new" ? [...items, parsed] : items.map((x, i) => (i === editing ? parsed : x));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (set as any)(conf.key, next);
    setEditing(null);
  };

  const del = (i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (set as any)(conf.key, items.filter((_, j) => j !== i));
    setConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl text-ink flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-saffron border-2 border-ink">{conf.icon}</span>
            {conf.label}
          </h2>
          <p className="text-sm text-muted font-semibold mt-2">
            {conf.desc} — {fa(items.length)} مورد
          </p>
        </div>
        <button
          onClick={() => open("new")}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-sm hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
        >
          <IcPlus className="w-5 h-5" />
          افزودن مورد جدید
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <p className="text-center text-muted font-semibold bg-card border-2 border-dashed border-ink/20 rounded-xl py-10">
            هنوز موردی اضافه نشده — روی «افزودن مورد جدید» بزن.
          </p>
        )}
        {items.map((it, i) => {
          const p = conf.preview(it);
          return (
            <div
              key={i}
              className="flex items-center gap-4 bg-card border-2 border-ink/15 rounded-xl px-5 py-4 hover:border-ink transition-colors"
            >
              <span className="font-display text-xl text-muted w-8 text-center shrink-0">{fa(i + 1)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink truncate">{p.title}</p>
                <p className="text-xs text-muted font-semibold mt-0.5 truncate">{p.sub}</p>
              </div>
              <button
                onClick={() => open(i)}
                className="h-10 px-4 rounded-lg bg-paper border-2 border-ink text-sm font-bold hover:bg-saffron transition-colors shrink-0"
              >
                ویرایش
              </button>
              {confirm === i ? (
                <span className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => del(i)}
                    className="h-10 px-4 rounded-lg bg-coral text-paper border-2 border-ink text-sm font-bold"
                  >
                    حذف شود
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="h-10 px-3 rounded-lg bg-paper border-2 border-ink text-sm font-bold"
                  >
                    انصراف
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirm(i)}
                  className="h-10 px-4 rounded-lg bg-paper border-2 border-coral text-coral text-sm font-bold hover:bg-coral hover:text-paper transition-colors shrink-0"
                >
                  حذف
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editing !== null && (
        <div
          className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-[2px] flex items-end md:items-center justify-center md:p-6"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="toast-in w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border-2 border-ink rounded-t-2xl md:rounded-2xl shadow-hard p-6 md:p-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-ink">
                {editing === "new" ? `افزودن ${conf.label}` : `ویرایش ${conf.label}`}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="grid place-items-center w-10 h-10 rounded-lg border-2 border-ink bg-card hover:bg-coral hover:text-paper transition-colors"
                aria-label="بستن"
              >
                <IcX className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {conf.fields.map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Field def={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
                </div>
              ))}
            </div>
            <div className="mt-7 flex items-center gap-3">
              <button
                onClick={save}
                className="flex-1 h-13 py-3.5 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-0.5 transition-all duration-300"
              >
                ذخیره تغییرات
              </button>
              <button
                onClick={() => setEditing(null)}
                className="h-13 py-3.5 px-6 rounded-xl bg-card border-2 border-ink font-bold hover:bg-paper transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- ticker & settings tabs ---------------- */

function TickerTab() {
  const { site, set } = useSite();
  const [text, setText] = useState(site.ticker.join("\n"));
  const [saved, setSaved] = useState(false);
  const save = () => {
    set("ticker", text.split("\n").map((t) => t.trim()).filter(Boolean));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div>
      <h2 className="font-display text-3xl text-ink flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-saffron border-2 border-ink">
          <IcSpark className="w-5 h-5" />
        </span>
        نوار قبولی‌ها
      </h2>
      <p className="text-sm text-muted font-semibold mt-2">هر خط یک قبولی — این متن‌ها در نوار متحرک زیر هدر نمایش داده می‌شوند.</p>
      <textarea
        className="mt-6 w-full h-64 p-4 rounded-xl bg-card border-2 border-ink/15 text-sm font-semibold leading-8 outline-none focus:border-ink transition-colors resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        dir="rtl"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          className="h-12 px-6 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-sm hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
        >
          ذخیرهٔ نوار
        </button>
        {saved && (
          <span className="toast-in inline-flex items-center gap-2 text-sm font-bold text-tealdark">
            <IcCheck className="w-4.5 h-4.5" />
            ذخیره شد و روی سایت اعمال شد
          </span>
        )}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { site, set } = useSite();
  const [draft, setDraft] = useState<Record<string, unknown>>({ ...site.settings });
  const [saved, setSaved] = useState(false);
  const save = () => {
    set("settings", draft as typeof site.settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return (
    <div>
      <h2 className="font-display text-3xl text-ink flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-saffron border-2 border-ink">
          <IcGear className="w-5 h-5" />
        </span>
        تنظیمات سایت
      </h2>
      <p className="text-sm text-muted font-semibold mt-2">متن‌های صفحهٔ اصلی و اطلاعات تماس — تغییرات بلافاصله اعمال می‌شوند.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4 bg-card border-2 border-ink/15 rounded-2xl p-6 md:p-7">
        {SETTINGS_FIELDS.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <Field def={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          className="h-12 px-6 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-sm hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
        >
          ذخیرهٔ تنظیمات
        </button>
        {saved && (
          <span className="toast-in inline-flex items-center gap-2 text-sm font-bold text-tealdark">
            <IcCheck className="w-4.5 h-4.5" />
            تنظیمات ذخیره شد
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------- overview ---------------- */

function Overview({ go }: { go: (t: string) => void }) {
  const { site, reset } = useSite();
  const [confirmReset, setConfirmReset] = useState(false);
  const cards = COLLS.map((c) => ({
    id: c.key,
    label: c.label,
    icon: c.icon,
    count: (site[c.key] as unknown[]).length,
  }));
  return (
    <div>
      <h2 className="font-display text-3xl text-ink">داشبورد</h2>
      <p className="text-sm text-muted font-semibold mt-2">
        روی هر بخش بزن تا محتوا را ویرایش کنی — تغییرات بلافاصله روی سایت اعمال و در مرورگر ذخیره می‌شوند.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            className="group text-right bg-card border-2 border-ink rounded-2xl p-6 hover:-translate-y-1.5 hover:shadow-hard transition-all duration-300"
            style={{ transitionDelay: `${i * 20}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-ink text-saffron group-hover:bg-saffron group-hover:text-ink group-hover:-rotate-6 transition-all duration-300">
                {c.icon}
              </span>
              <span className="font-display text-4xl text-ink">{fa(c.count)}</span>
            </div>
            <p className="font-bold text-ink mt-4">{c.label}</p>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-coral mt-1.5 group-hover:gap-3 transition-all duration-300">
              ویرایش <IcArrow className="w-3.5 h-3.5" />
            </p>
          </button>
        ))}
        <button
          onClick={() => go("ticker")}
          className="group text-right bg-ink border-2 border-ink rounded-2xl p-6 text-paper hover:-translate-y-1.5 hover:shadow-hard-saffron transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-saffron text-ink">
              <IcSpark className="w-5 h-5" />
            </span>
            <span className="font-display text-4xl">{fa(site.ticker.length)}</span>
          </div>
          <p className="font-bold mt-4">نوار قبولی‌ها</p>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron mt-1.5 group-hover:gap-3 transition-all duration-300">
            ویرایش <IcArrow className="w-3.5 h-3.5" />
          </p>
        </button>
        <button
          onClick={() => go("settings")}
          className="group text-right bg-saffron border-2 border-ink rounded-2xl p-6 text-ink hover:-translate-y-1.5 hover:shadow-hard transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-ink text-saffron">
              <IcGear className="w-5 h-5" />
            </span>
            <span className="font-display text-4xl">{fa(8)}</span>
          </div>
          <p className="font-bold mt-4">تنظیمات سایت</p>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/70 mt-1.5 group-hover:gap-3 transition-all duration-300">
            ویرایش <IcArrow className="w-3.5 h-3.5" />
          </p>
        </button>
      </div>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-ink/25 bg-saffron/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm font-semibold leading-7 text-ink/75">
          می‌خواهی همه‌چیز به حالت اولیه برگردد؟ همهٔ تغییرات پاک و محتوای پیش‌فرض سایت برمی‌گردد.
        </p>
        {confirmReset ? (
          <span className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
              className="h-11 px-5 rounded-xl bg-coral text-paper border-2 border-ink font-bold text-sm"
            >
              بله، بازنشانی کن
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="h-11 px-4 rounded-xl bg-card border-2 border-ink font-bold text-sm"
            >
              انصراف
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="h-11 px-5 rounded-xl bg-ink text-paper border-2 border-ink font-bold text-sm hover:bg-coral transition-colors shrink-0"
          >
            بازنشانی به پیش‌فرض
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- login & dashboard shell ---------------- */

function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASS) {
      sessionStorage.setItem("rs-admin", "1");
      onOk();
    } else {
      setErr(true);
    }
  };
  return (
    <section className="pt-[72px] min-h-screen bg-ink bg-grid-dark grid place-items-center px-4 py-16">
      <form
        onSubmit={submit}
        className={`toast-in w-full max-w-md bg-paper border-2 border-ink rounded-2xl shadow-hard-saffron p-8 ${err ? "animate-[shake_0.4s]" : ""}`}
      >
        <span className="grid place-items-center w-14 h-14 rounded-2xl bg-saffron border-2 border-ink shadow-hard-sm">
          <IcGear className="w-7 h-7 text-ink" />
        </span>
        <h1 className="font-display text-3xl text-ink mt-5">پنل مدیریت رتبه‌شو</h1>
        <p className="text-sm font-semibold text-muted mt-2 leading-7">
          برای ویرایش محتوای سایت، رمز عبور را وارد کن.
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(false);
          }}
          placeholder="رمز عبور"
          className="mt-5 w-full h-13 px-4 rounded-xl bg-paper border-2 border-ink/20 text-sm font-bold outline-none focus:border-ink transition-colors"
          dir="ltr"
        />
        {err && <p className="text-xs font-bold text-coral mt-2">رمز اشتباه است؛ دوباره تلاش کن.</p>}
        <button
          type="submit"
          className="mt-5 w-full h-13 py-3.5 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-0.5 transition-all duration-300"
        >
          ورود به پنل
        </button>
        <p className="text-[11px] font-semibold text-muted mt-4 text-center">
          رمز پیش‌فرض: <span dir="ltr" className="font-bold text-ink">admin1405</span>
        </p>
        <p className="text-center mt-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-ink transition-colors">
            <IcArrow className="w-3.5 h-3.5" />
            بازگشت به سایت
          </Link>
        </p>
      </form>
    </section>
  );
}

type TabId = "overview" | CollKey | "ticker" | "settings";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("overview");
  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: "overview", label: "داشبورد", icon: <IcTarget className="w-5 h-5" /> },
    ...COLLS.map((c) => ({ id: c.key as TabId, label: c.label, icon: c.icon })),
    { id: "ticker", label: "نوار قبولی‌ها", icon: <IcSpark className="w-5 h-5" /> },
    { id: "settings", label: "تنظیمات سایت", icon: <IcGear className="w-5 h-5" /> },
  ];
  const active = COLLS.find((c) => c.key === tab);
  return (
    <section className="pt-[72px] bg-paper bg-grid min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 grid lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* sidebar */}
        <aside className="bg-ink bg-grid-dark text-paper border-2 border-ink rounded-2xl p-4 lg:sticky lg:top-24">
          <div className="px-3 pb-4 border-b-2 border-dashed border-inkline">
            <p className="font-display text-2xl leading-tight">
              پنل <span className="text-saffron">مدیریت</span>
            </p>
            <p className="text-[11px] font-semibold text-paper/55 mt-1.5">تغییرات همان لحظه روی سایت اعمال می‌شود</p>
          </div>
          <nav className="mt-4 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  tab === t.id ? "bg-saffron text-ink" : "text-paper/75 hover:bg-ink2 hover:text-paper"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t-2 border-dashed border-inkline space-y-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-paper text-ink font-bold text-sm border-2 border-ink hover:bg-saffron transition-colors"
            >
              مشاهدهٔ سایت
              <IcArrow className="w-4 h-4" />
            </Link>
            <button
              onClick={onLogout}
              className="w-full h-11 rounded-xl border-2 border-inkline text-paper/70 font-bold text-sm hover:bg-coral hover:text-paper hover:border-ink transition-colors"
            >
              خروج از پنل
            </button>
          </div>
        </aside>

        {/* content */}
        <div key={tab} className="page-in min-w-0">
          {tab === "overview" && <Overview go={(t) => setTab(t as TabId)} />}
          {active && <CollectionTab conf={active} />}
          {tab === "ticker" && <TickerTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </section>
  );
}

function NeedAdmin() {
  return (
    <section className="pt-[72px] min-h-screen bg-ink bg-grid-dark grid place-items-center px-4 py-16">
      <div className="max-w-md w-full bg-card border-2 border-ink rounded-2xl shadow-hard-saffron p-8 text-center">
        <span className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-coral text-paper border-2 border-ink">
          <IcLock className="w-8 h-8" />
        </span>
        <h1 className="font-display text-3xl text-ink mt-5">دسترسی فقط برای ادمین</h1>
        <p className="text-sm font-semibold text-muted mt-2 leading-7">
          برای ویرایش محتوای سایت باید با حساب مدیر وارد شوی. اگر حساب دانش‌آموز داری، این بخش برای تو نیست.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center justify-center w-full h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-saffron hover:-translate-y-0.5 transition-all duration-300"
        >
          ورود با حساب ادمین
        </Link>
      </div>
    </section>
  );
}

export default function Admin() {
  const { user, logout } = useAuth();
  if (!user || user.role !== "admin") return <NeedAdmin />;
  return (
    <>
      <Seo title="پنل مدیریت محتوا | رتبه‌شو" description="پنل ویرایش محتوای سایت رتبه‌شو" path="/admin" noindex />
      <Dashboard
        onLogout={() => {
          void logout();
        }}
      />
    </>
  );
}
