import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHero, Reveal, fa, money, useCountdown } from "../ui";
import { useSite } from "../store";
import { useActivity, todayWeekIndex } from "../activity";
import {
  IcArrow,
  IcBook,
  IcCalendar,
  IcCap,
  IcCart,
  IcChat,
  IcCheck,
  IcClock,
  IcPencil,
  IcPlus,
  IcTarget,
  IcUsers,
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
      <div className="flex items-end justify-between gap-2 h-48" dir="rtl">
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
      <form onSubmit={submit} className="mt-6 flex gap-2.5">
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
      <p className="mt-3 text-[11px] font-semibold text-muted">ستون قرمز یعنی امروز — عددِ بالای هر ستون با هاور دیده می‌شود.</p>
    </Card>
  );
}

function ProfileCard() {
  const { profile, setProfile } = useActivity();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(profile);

  const save = () => {
    if (draft.name.trim().length < 2) return;
    setProfile({ ...draft, name: draft.name.trim() });
    setEdit(false);
  };

  const input =
    "w-full h-11 px-3.5 rounded-lg bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors";

  return (
    <Card
      title="پروفایل من"
      icon={<IcUsers className="w-4 h-4" />}
      action={
        <button
          onClick={() => (edit ? save() : (setDraft(profile), setEdit(true)))}
          className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border-2 border-ink text-xs font-bold transition-colors ${
            edit ? "bg-teal text-paper" : "bg-saffron text-ink hover:bg-saffrondeep hover:text-paper"
          }`}
        >
          {edit ? <IcCheck className="w-3.5 h-3.5" /> : <IcPencil className="w-3.5 h-3.5" />}
          {edit ? "ذخیره" : "ویرایش"}
        </button>
      }
    >
      {edit ? (
        <div className="space-y-3.5">
          <input className={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="نام و نام خانوادگی" />
          <select className={input} value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })}>
            {["تجربی", "ریاضی", "انسانی"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <input className={input} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} placeholder="رشته و دانشگاه هدف" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-coral text-paper font-display text-2xl border-2 border-ink shadow-hard-sm shrink-0">
              {profile.name.slice(0, 1)}
            </span>
            <div>
              <p className="font-display text-2xl text-ink leading-tight">{profile.name}</p>
              <p className="text-xs font-bold text-muted mt-1">داوطلب {profile.group} • کنکور ۱۴۰۵</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-paper border-2 border-dashed border-ink/20 px-4 py-3">
            <IcTarget className="w-5 h-5 text-coral shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-muted">هدف نهایی</p>
              <p className="text-sm font-bold text-ink">{profile.target || "هنوز تعیین نشده"}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function MyClasses() {
  const { site } = useSite();
  const { enrolledClassIds, unenroll } = useActivity();
  const mine = site.classes.filter((c) => enrolledClassIds.includes(c.id));

  return (
    <Card
      title="کلاس‌های من"
      icon={<IcCap className="w-4 h-4" />}
      action={
        <Link to="/classes" className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:text-ink transition-colors">
          کلاس جدید <IcArrow className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {mine.length === 0 ? (
        <div className="text-center py-8">
          <IcBook className="w-10 h-10 mx-auto text-muted/50" />
          <p className="mt-3 text-sm font-bold text-muted">هنوز در هیچ کلاسی ثبت‌نام نکرده‌ای.</p>
          <Link to="/classes" className="inline-block mt-4 h-11 px-5 rounded-xl bg-ink text-paper text-sm font-bold leading-[2.6rem] hover:bg-coral transition-colors">
            دیدن کلاس‌ها
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {mine.map((c) => {
            const progress = ((c.id * 17) % 55) + 25;
            return (
              <li key={c.id} className="rounded-xl border-2 border-ink/12 bg-paper/70 p-4 hover:border-ink/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[15px] text-ink">{c.title}</p>
                    <p className="text-xs font-semibold text-muted mt-1 flex items-center gap-1.5">
                      <IcCalendar className="w-3.5 h-3.5 text-teal" />
                      {c.teacher} • {c.schedule}
                    </p>
                  </div>
                  <button
                    onClick={() => unenroll(c.id)}
                    aria-label={`انصراف از ${c.title}`}
                    title="انصراف از کلاس"
                    className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink/20 text-muted hover:border-coral hover:text-coral hover:bg-coral/10 transition-colors shrink-0"
                  >
                    <IcX className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3.5">
                  <div className="flex justify-between text-[11px] font-bold text-muted mb-1.5">
                    <span>پیشروی دوره</span>
                    <span className="text-tealdark">{fa(`${progress}٪`)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-paper border border-ink/10 overflow-hidden">
                    <div className="h-full rounded-full bg-teal transition-[width] duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function MyReservations() {
  const { reservations } = useActivity();
  return (
    <Card
      title="رزروهای مشاوره"
      icon={<IcChat className="w-4 h-4" />}
      action={
        <Link to="/consulting" className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:text-ink transition-colors">
          رزرو جدید <IcArrow className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {reservations.length === 0 ? (
        <p className="text-center py-8 text-sm font-bold text-muted">هیچ رزروی نداری.</p>
      ) : (
        <ul className="space-y-3.5">
          {reservations.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink/12 bg-paper/70 px-4 py-3.5 hover:border-ink/40 transition-colors">
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink truncate">{r.service}</p>
                <p className="text-[11px] font-semibold text-muted mt-1" dir="ltr">
                  {fa(r.code)} • {r.date}
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

function CartCard() {
  const { cart, removeFromCart, checkout } = useActivity();
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((a, b) => a + b.price, 0);

  const doCheckout = () => {
    checkout();
    setPlaced(true);
    window.setTimeout(() => setPlaced(false), 3200);
  };

  return (
    <Card title="سبد خرید" icon={<IcCart className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(cart.length)} قلم</span>}>
      {cart.length === 0 ? (
        <div className="text-center py-6">
          <IcCart className="w-10 h-10 mx-auto text-muted/50" />
          <p className="mt-3 text-sm font-bold text-muted">سبدت خالی است.</p>
          <Link to="/shop" className="inline-block mt-4 h-11 px-5 rounded-xl bg-ink text-paper text-sm font-bold leading-[2.6rem] hover:bg-coral transition-colors">
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {cart.map((it, i) => (
              <li key={`${it.title}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink/12 bg-paper/70 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-ink truncate">{it.title}</p>
                  <p className="text-[11px] font-semibold text-muted mt-0.5">{money(it.price)} تومان</p>
                </div>
                <button
                  onClick={() => removeFromCart(i)}
                  aria-label="حذف از سبد"
                  className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink/20 text-muted hover:border-coral hover:text-coral hover:bg-coral/10 transition-colors shrink-0"
                >
                  <IcX className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/15">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-muted">جمع سبد</span>
              <span className="font-display text-2xl text-ink">
                {money(total)} <span className="text-xs font-body font-bold text-muted">تومان</span>
              </span>
            </div>
            <button
              onClick={doCheckout}
              className="w-full h-12 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-saffron hover:-translate-y-0.5 transition-all duration-300"
            >
              {placed ? "سفارش ثبت شد ✓" : "تسویه‌حساب و ثبت سفارش"}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

function MyOrders() {
  const { orders } = useActivity();
  return (
    <Card title="سفارش‌های من" icon={<IcBook className="w-4 h-4" />} action={<span className="text-xs font-bold text-muted">{fa(orders.length)} سفارش</span>}>
      {orders.length === 0 ? (
        <p className="text-center py-8 text-sm font-bold text-muted">هنوز سفارشی نداری.</p>
      ) : (
        <ul className="space-y-3.5">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl border-2 border-ink/12 bg-paper/70 px-4 py-3.5 hover:border-ink/40 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-sm text-ink">
                  {o.items.length} قلم • <span className="font-display">{money(o.total)}</span> تومان
                </p>
                <span className={chip(o.status)}>{o.status}</span>
              </div>
              <p className="text-[11px] font-semibold text-muted mt-1.5 truncate">{o.items.map((x) => x.title).join("، ")}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function StudentDashboard() {
  const { profile, enrolledClassIds, orders, reservations, study } = useActivity();
  const t = useCountdown();
  const weeklyHours = Math.round(study.reduce((a, b) => a + b, 0) / 60);

  const stats = [
    { label: "کلاس ثبت‌نام‌شده", value: fa(enrolledClassIds.length), icon: <IcCap className="w-5 h-5" />, cls: "bg-saffron text-ink" },
    { label: "ساعت مطالعه این هفته", value: fa(weeklyHours), icon: <IcClock className="w-5 h-5" />, cls: "bg-coral text-paper" },
    { label: "رزرو مشاوره", value: fa(reservations.length), icon: <IcChat className="w-5 h-5" />, cls: "bg-teal text-paper" },
    { label: "سفارش ثبت‌شده", value: fa(orders.length), icon: <IcCart className="w-5 h-5" />, cls: "bg-ink text-saffron" },
  ];

  return (
    <>
      <PageHero
        crumb="داشبورد دانش‌آموز"
        kicker="پنل دانش‌آموز"
        title={
          <>
            سلام {profile.name.split(" ")[0]}، <span className="text-saffron">ادامه بده!</span>
          </>
        }
        desc="کلاس‌هایت، برنامهٔ مطالعه، سفارش‌ها و رزروهای مشاوره — همه‌چیز همین‌جاست و با هر بار ثبت‌نام یا خرید، به‌روز می‌شود."
        chip={`${fa(t.days)} روز تا ${t.label}`}
      />

      <section className="relative bg-paper bg-grid py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((st, i) => (
              <Reveal key={st.label} delay={i * 90}>
                <div className="group flex items-center gap-4 bg-card border-2 border-ink rounded-2xl p-5 hover:-translate-y-1.5 hover:shadow-hard transition-all duration-300">
                  <span className={`grid place-items-center w-12 h-12 rounded-xl border-2 border-ink shrink-0 group-hover:-rotate-6 transition-transform duration-300 ${st.cls}`}>
                    {st.icon}
                  </span>
                  <div>
                    <p className="font-display text-3xl text-ink leading-none">{st.value}</p>
                    <p className="text-[11px] font-bold text-muted mt-1.5">{st.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* study + profile */}
          <div className="mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8 items-stretch">
            <Reveal delay={100}>
              <StudyChart />
            </Reveal>
            <Reveal delay={200}>
              <ProfileCard />
            </Reveal>
          </div>

          {/* classes + reservations */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch">
            <Reveal delay={120}>
              <MyClasses />
            </Reveal>
            <Reveal delay={220}>
              <MyReservations />
            </Reveal>
          </div>

          {/* cart + orders */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch">
            <Reveal delay={140}>
              <CartCard />
            </Reveal>
            <Reveal delay={240}>
              <MyOrders />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
