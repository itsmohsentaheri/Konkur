import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero, Reveal, fa, money, useCountdown } from "../ui";
import { useSite } from "../store";
import { useActivity, todayWeekIndex } from "../activity";
import { Seo } from "../seo";
import { useAuth } from "../auth";
import {
  IcArrow,
  IcCap,
  IcCart,
  IcChat,
  IcCheck,
  IcClock,
  IcGrid,
  IcMinus,
  IcPencil,
  IcPlus,
  IcTarget,
  IcTrash,
  IcUser,
  IcX,
} from "../icons";

const DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

const STATUS_STYLE: Record<string, string> = {
  "در انتظار": "bg-saffron/25 text-saffrondeep border-saffrondeep/40",
  "تأیید شده": "bg-teal/15 text-tealdark border-teal/50",
  "انجام شده": "bg-ink/10 text-ink border-ink/30",
  "در حال پردازش": "bg-saffron/25 text-saffrondeep border-saffrondeep/40",
  "ارسال شده": "bg-teal/15 text-tealdark border-teal/50",
  "تحویل شده": "bg-ink/10 text-ink border-ink/30",
};
const chip = (s: string) =>
  `inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${STATUS_STYLE[s] ?? "bg-paper border-ink/20 text-muted"}`;

type TabId = "overview" | "classes" | "shop" | "bookings" | "profile";
const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "نمای کلی", icon: <IcGrid className="w-4.5 h-4.5" /> },
  { id: "classes", label: "کلاس‌های من", icon: <IcCap className="w-4.5 h-4.5" /> },
  { id: "shop", label: "خریدها و سبد", icon: <IcCart className="w-4.5 h-4.5" /> },
  { id: "bookings", label: "رزرو مشاوره", icon: <IcChat className="w-4.5 h-4.5" /> },
  { id: "profile", label: "پروفایل", icon: <IcUser className="w-4.5 h-4.5" /> },
];

function Card({ title, icon, action, children }: { title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-card border-2 border-ink rounded-2xl overflow-hidden flex flex-col">
      <header className="flex items-center justify-between gap-3 px-6 py-4 border-b-2 border-dashed border-ink/15 bg-paper/60">
        <h2 className="flex items-center gap-2.5 font-display text-xl text-ink">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-saffron">{icon}</span>
          {title}
        </h2>
        {action}
      </header>
      <div className="p-6 flex-1">{children}</div>
    </section>
  );
}

/* ---------------- study chart ---------------- */
function StudyChart() {
  const { study, logStudy } = useActivity();
  const [mins, setMins] = useState("");
  const max = Math.max(...study, 60);
  const today = todayWeekIndex();
  const total = study.reduce((a, b) => a + b, 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const m = parseInt(mins, 10);
    if (!Number.isFinite(m) || m <= 0 || m > 1200) return;
    logStudy(m);
    setMins("");
  };

  return (
    <Card
      title="مطالعهٔ این هفته"
      icon={<IcClock className="w-4 h-4" />}
      action={<span className="text-xs font-bold text-muted">{fa(Math.round(total / 60))} ساعت در مجموع</span>}
    >
      <div className="flex items-end justify-between gap-2 h-44" dir="rtl">
        {study.map((m, i) => (
          <div key={DAYS[i]} className="flex-1 h-full flex flex-col items-center group">
            <div className="flex-1 w-full flex items-end justify-center relative">
              <span className="absolute -top-1 text-[11px] font-bold text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                {fa(Math.round(m / 60))}س
              </span>
              <div
                title={`${DAYS[i]}: ${fa(m)} دقیقه`}
                className={`w-full max-w-9 rounded-t-lg border-2 border-ink transition-all duration-700 ease-out cursor-pointer hover:opacity-85 ${
                  i === today ? "bg-coral" : "bg-saffron"
                }`}
                style={{ height: `${Math.max(5, (m / max) * 100)}%` }}
              />
            </div>
            <span className={`mt-2 text-[11px] font-bold shrink-0 ${i === today ? "text-coral" : "text-muted"}`}>{DAYS[i]}</span>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-5 flex gap-2.5">
        <input
          value={mins}
          onChange={(e) => setMins(e.target.value)}
          inputMode="numeric"
          placeholder="چند دقیقه امروز درس خوندی؟"
          className="flex-1 min-w-0 h-12 px-4 rounded-xl bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-ink text-paper text-sm font-bold border-2 border-ink hover:bg-coral transition-colors shrink-0"
        >
          <IcPlus className="w-4 h-4" />
          ثبت برای امروز
        </button>
      </form>
    </Card>
  );
}

/* ---------------- overview ---------------- */
function Overview({ go }: { go: (t: TabId) => void }) {
  const activity = useActivity();
  const t = useCountdown();
  const weekHours = Math.round(activity.study.reduce((a, b) => a + b, 0) / 60);
  const spent = activity.orders.reduce((a, b) => a + b.total, 0);

  const kpis = [
    { label: "کلاس فعال", value: fa(activity.enrolledClassIds.length), icon: <IcCap className="w-5 h-5" />, tab: "classes" as TabId, tone: "bg-ink text-paper" },
    { label: "ساعت مطالعهٔ هفته", value: fa(weekHours), icon: <IcClock className="w-5 h-5" />, tab: "classes" as TabId, tone: "bg-saffron text-ink" },
    { label: "رزرو مشاوره", value: fa(activity.reservations.length), icon: <IcChat className="w-5 h-5" />, tab: "bookings" as TabId, tone: "bg-coral text-paper" },
    { label: "مجموع خرید", value: money(spent), icon: <IcCart className="w-5 h-5" />, tab: "shop" as TabId, tone: "bg-teal text-paper" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 90}>
            <button
              onClick={() => go(k.tab)}
              className={`w-full text-right border-2 border-ink rounded-2xl p-5 hover:-translate-y-1.5 hover:shadow-hard transition-all duration-300 ${k.tone}`}
            >
              <span className="grid place-items-center w-11 h-11 rounded-xl border-2 border-ink bg-paper/15">{k.icon}</span>
              <p className="font-display text-3xl leading-none mt-4">{k.value}</p>
              <p className="text-sm font-bold mt-1.5 opacity-90">{k.label}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
        <Reveal delay={120}>
          <StudyChart />
        </Reveal>
        <Reveal delay={220}>
          <Card title="تا روز سرنوشت" icon={<IcTarget className="w-4 h-4" />} action={<span className={chip("در انتظار")}>{t.label}</span>}>
            <div className="grid grid-cols-4 gap-3 text-center" dir="ltr">
              {[
                { v: t.days, l: "روز" },
                { v: t.hours, l: "ساعت" },
                { v: t.minutes, l: "دقیقه" },
                { v: t.seconds, l: "ثانیه" },
              ].map((x) => (
                <div key={x.l} className="bg-ink text-paper rounded-xl border-2 border-ink py-4">
                  <p className="font-display text-3xl text-saffron leading-none">{fa(x.v)}</p>
                  <p className="text-[11px] font-bold mt-1.5 text-paper/70">{x.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <Link
                to="/classes"
                className="flex items-center justify-between rounded-xl border-2 border-ink/15 bg-paper px-4 py-3 hover:border-ink hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-sm font-bold text-ink">کلاس جدید پیدا کن</span>
                <IcArrow className="w-4.5 h-4.5 text-coral" />
              </Link>
              <Link
                to="/shop"
                className="flex items-center justify-between rounded-xl border-2 border-ink/15 bg-paper px-4 py-3 hover:border-ink hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-sm font-bold text-ink">منابع و جزوه‌ها</span>
                <IcArrow className="w-4.5 h-4.5 text-coral" />
              </Link>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------------- classes tab ---------------- */
function ClassesTab() {
  const { site } = useSite();
  const activity = useActivity();
  const mine = site.classes.filter((c) => activity.enrolledClassIds.includes(c.id));

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
      <Card title="کلاس‌هایی که ثبت‌نام کرده‌ای" icon={<IcCap className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(mine.length)} کلاس</span>}>
        {mine.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-bold text-muted">هنوز کلاسی انتخاب نکردی.</p>
            <Link to="/classes" className="mt-4 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-ink text-paper font-bold border-2 border-ink hover:bg-coral transition-colors">
              دیدن کلاس‌ها <IcArrow className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {mine.map((c) => (
              <li key={c.id} className="border-2 border-ink/15 rounded-xl bg-paper p-4 hover:border-ink hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-ink leading-snug">{c.title}</p>
                    <p className="text-xs font-semibold text-muted mt-1">{c.teacher} • {c.schedule}</p>
                  </div>
                  <button
                    onClick={() => activity.unenroll(c.id)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-coral border-2 border-coral/40 rounded-lg px-2.5 py-1.5 hover:bg-coral hover:text-paper transition-colors"
                  >
                    <IcX className="w-3.5 h-3.5" />
                    انصراف
                  </button>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-bold text-muted mb-1">
                    <span>پیشروی دوره</span>
                    <span>{fa(`${c.capacity}٪`)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-card border border-ink/10 overflow-hidden">
                    <div className="h-full bg-teal rounded-full transition-[width] duration-1000" style={{ width: `${c.capacity}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Reveal delay={150}>
        <StudyChart />
      </Reveal>
    </div>
  );
}

/* ---------------- shop tab ---------------- */
function ShopTab() {
  const activity = useActivity();
  const { user } = useAuth();
  const total = activity.cart.reduce((a, b) => a + b.price * b.qty, 0);

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
      <Card title="سبد خرید فعلی" icon={<IcCart className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(activity.cartCount)} قلم</span>}>
        {activity.cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-bold text-muted">سبدت خالیه.</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-saffron text-ink font-bold border-2 border-ink hover:-translate-y-0.5 transition-all duration-300">
              رفتن به فروشگاه <IcArrow className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3.5">
              {activity.cart.map((item) => (
                <li key={item.title} className="flex items-center gap-3 border-2 border-ink/15 rounded-xl bg-paper p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{item.title}</p>
                    <p className="text-xs font-semibold text-muted mt-0.5">{money(item.price)} تومان</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => activity.changeQty(item.title, -1)} aria-label="کم کردن" className="grid place-items-center w-7 h-7 rounded-lg border-2 border-ink bg-card hover:bg-saffron transition-colors">
                      <IcMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-display text-base">{fa(item.qty)}</span>
                    <button onClick={() => activity.changeQty(item.title, 1)} aria-label="زیاد کردن" className="grid place-items-center w-7 h-7 rounded-lg border-2 border-ink bg-card hover:bg-saffron transition-colors">
                      <IcPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => activity.removeFromCart(item.title)} aria-label="حذف" className="grid place-items-center w-7 h-7 rounded-lg border-2 border-ink/20 text-muted hover:text-coral hover:border-coral transition-colors shrink-0">
                    <IcTrash className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/15 flex items-center justify-between">
              <span className="font-bold text-muted text-sm">جمع</span>
              <span className="font-display text-2xl text-ink">{money(total)} <span className="text-xs font-body font-bold text-muted">تومان</span></span>
            </div>
            <button
              onClick={() => user && activity.checkout(user.name)}
              className="mt-4 w-full h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-saffron hover:-translate-y-1 transition-all duration-300"
            >
              تسویه‌حساب
            </button>
          </>
        )}
      </Card>

      <Card title="سفارش‌های قبلی" icon={<IcCheck className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(activity.orders.length)} سفارش</span>}>
        {activity.orders.length === 0 ? (
          <p className="text-center py-8 font-bold text-muted">سفارشی نداری.</p>
        ) : (
          <ul className="space-y-4">
            {activity.orders.map((o) => (
              <li key={o.id} className="border-2 border-ink/15 rounded-xl bg-paper p-4 hover:border-ink transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-muted" dir="ltr">{fa(o.id.slice(-6).toUpperCase())}</p>
                  <span className={chip(o.status)}>{o.status}</span>
                </div>
                <p className="text-sm font-bold text-ink mt-2 leading-6">
                  {o.items.map((x) => x.title).join("، ")}
                </p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[11px] font-semibold text-muted">{o.date}</span>
                  <span className="font-display text-lg text-coral">{money(o.total)} <span className="text-[10px] font-body font-bold text-muted">تومان</span></span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ---------------- bookings tab ---------------- */
function BookingsTab() {
  const activity = useActivity();
  const mine = activity.reservations.filter((r) => r.name === activity.profile.name);

  return (
    <Card title="رزروهای مشاورهٔ من" icon={<IcChat className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(mine.length)} رزرو</span>}>
      {mine.length === 0 ? (
        <div className="text-center py-10">
          <p className="font-bold text-muted">هنوز مشاوره‌ای رزرو نکردی.</p>
          <Link to="/consulting" className="mt-4 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-coral text-paper font-bold border-2 border-ink hover:-translate-y-0.5 transition-all duration-300">
            رزرو اولین مشاوره <IcArrow className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {mine.map((r) => (
            <li key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-ink/15 rounded-xl bg-paper p-4 hover:border-ink transition-colors">
              <div>
                <p className="font-display text-lg text-ink leading-snug">{r.service}</p>
                <p className="text-xs font-semibold text-muted mt-1">
                  گروه {r.group} • <span dir="ltr">{fa(r.code)}</span> • {r.date}
                </p>
              </div>
              <span className={chip(r.status)}>{r.status}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ---------------- profile tab ---------------- */
function ProfileTab() {
  const activity = useActivity();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(activity.profile);
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (draft.name.trim().length < 2) return;
    activity.setProfile({ ...draft, name: draft.name.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const input = "w-full h-12 px-4 rounded-xl bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors";

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card title="اطلاعات داوطلبی" icon={<IcPencil className="w-4 h-4" />} action={saved ? <span className="text-xs font-bold text-tealdark">ذخیره شد ✓</span> : undefined}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5">نام و نام خانوادگی</label>
            <input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5">گروه آزمایشی</label>
            <div className="grid grid-cols-4 gap-2">
              {["تجربی", "ریاضی", "انسانی", "زبان"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setDraft({ ...draft, group: g })}
                  className={`h-11 rounded-xl border-2 border-ink text-sm font-bold transition-all ${draft.group === g ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-saffron/40"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted mb-1.5">رشته و دانشگاه هدف</label>
            <input className={input} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} placeholder="مثلاً پزشکی — دانشگاه تهران" />
          </div>
          <button onClick={save} className="w-full h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-saffron hover:-translate-y-1 transition-all duration-300">
            ذخیرهٔ تغییرات
          </button>
        </div>
      </Card>
      <Card title="حساب کاربری" icon={<IcUser className="w-4 h-4" />}>
        <dl className="space-y-3.5">
          {[
            { k: "نام", v: user?.name ?? "—" },
            { k: "ایمیل", v: user?.email ?? "—", ltr: true },
            { k: "موبایل", v: user?.phone || "—", ltr: true },
            { k: "نقش", v: user?.role === "admin" ? "مدیر" : "داوطلب" },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between border-2 border-ink/10 rounded-xl bg-paper px-4 py-3">
              <dt className="text-xs font-bold text-muted">{row.k}</dt>
              <dd className="text-sm font-bold text-ink" dir={row.ltr ? "ltr" : undefined}>{row.v}</dd>
            </div>
          ))}
        </dl>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-5 w-full h-12 rounded-xl border-2 border-coral text-coral font-bold hover:bg-coral hover:text-paper transition-colors"
        >
          خروج از حساب
        </button>
      </Card>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function StudentDashboard() {
  const { user } = useAuth();
  const activity = useActivity();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    if (!user) navigate("/auth", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <Seo title="داشبورد من | رتبه‌شو" description="داشبورد شخصی دانش‌آموز رتبه‌شو" path="/dashboard/student" noindex />
      <PageHero
        crumb="داشبورد من"
        kicker={user.role === "admin" ? "پنل مدیریت" : "داشبورد دانش‌آموز"}
        title={
          <>
            سلام {activity.profile.name.split(" ")[0]}، <span className="text-saffron">آماده‌ای؟</span>
          </>
        }
        desc="کلاس‌ها، رزرو مشاوره، خریدها و ساعت مطالعه‌ات — همه این‌جا، همیشه همراهت."
        chip="همه‌چیز زنده و همگام است"
      />

      <section className="relative bg-paper bg-grid py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* tab bar */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 inline-flex items-center gap-2.5 h-12 px-5 rounded-xl border-2 border-ink font-bold text-sm transition-all duration-300 ${
                  tab === t.id ? "bg-ink text-paper shadow-hard-sm -translate-y-0.5" : "bg-card text-ink hover:bg-saffron/50 hover:-translate-y-0.5"
                }`}
              >
                <span className={tab === t.id ? "text-saffron" : "text-coral"}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div key={tab} className="page-in mt-8">
            {tab === "overview" && <Overview go={setTab} />}
            {tab === "classes" && <ClassesTab />}
            {tab === "shop" && <ShopTab />}
            {tab === "bookings" && <BookingsTab />}
            {tab === "profile" && <ProfileTab />}
          </div>
        </div>
      </section>
    </>
  );
}
