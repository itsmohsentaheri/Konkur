import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageHero, Reveal, fa, money } from "../ui";
import { useSite } from "../store";
import { useActivity } from "../activity";
import { IcArrow, IcCart, IcChat, IcCheck, IcGear, IcMail, IcTarget, IcTrash, IcTrend, IcUsers } from "../icons";

/* ---------------- login gate (same session as content panel) ---------------- */
function Gate({ onOk }: { onOk: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (code === "admin1405") {
      sessionStorage.setItem("rs-admin", "1");
      onOk();
    } else {
      setErr(true);
      setCode("");
    }
  };

  return (
    <section className="min-h-[80vh] bg-paper bg-grid flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md bg-card border-2 border-ink rounded-2xl shadow-hard p-8 text-center">
        <span className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-ink text-saffron border-2 border-ink">
          <IcGear className="w-8 h-8" />
        </span>
        <h1 className="font-display text-3xl text-ink mt-5">اتاق فرمان رتبه‌شو</h1>
        <p className="text-sm font-semibold text-muted mt-2 leading-7">برای ورود به داشبورد مدیریت، کد دسترسی را وارد کن.</p>
        <form onSubmit={submit} className="mt-6">
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErr(false);
            }}
            placeholder="کد دسترسی"
            dir="ltr"
            className={`w-full h-13 px-4 rounded-xl bg-paper border-2 text-center font-display text-2xl tracking-widest outline-none transition-colors ${
              err ? "border-coral animate-[shake_0.45s_ease]" : "border-ink/20 focus:border-ink"
            }`}
          />
          {err && <p className="text-xs font-bold text-coral mt-2.5">کد اشتباه است؛ دوباره تلاش کن.</p>}
          <button type="submit" className="mt-5 w-full h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink shadow-hard-saffron hover:-translate-y-0.5 transition-all duration-300">
            ورود به داشبورد
          </button>
        </form>
        <p className="mt-5 text-[11px] font-semibold text-muted">
          رمز نمونه برای دمو: <span className="font-bold text-saffrondeep" dir="ltr">admin1405</span>
        </p>
      </div>
    </section>
  );
}

/* ---------------- little helpers ---------------- */
const STATUS_CLS: Record<string, string> = {
  "در انتظار": "bg-saffron text-ink border-ink",
  "تأیید شده": "bg-teal text-paper border-ink",
  "انجام شده": "bg-ink text-paper border-ink",
  "در حال پردازش": "bg-saffron text-ink border-ink",
  "ارسال شده": "bg-teal text-paper border-ink",
  "تحویل شده": "bg-ink text-paper border-ink",
};

function Kpi({ label, value, sub, icon, tone }: { label: string; value: string; sub: string; icon: ReactNode; tone: string }) {
  return (
    <div className={`group border-2 border-ink rounded-2xl p-5 hover:-translate-y-1.5 transition-all duration-300 ${tone}`}>
      <div className="flex items-center justify-between">
        <span className="grid place-items-center w-11 h-11 rounded-xl border-2 border-ink bg-paper/10 group-hover:-rotate-6 transition-transform duration-300">
          {icon}
        </span>
        <IcTrend className="w-5 h-5 opacity-50" />
      </div>
      <p className="font-display text-4xl leading-none mt-4">{value}</p>
      <p className="text-sm font-bold mt-2">{label}</p>
      <p className="text-[11px] font-semibold opacity-70 mt-1">{sub}</p>
    </div>
  );
}

function Panel({ title, icon, children, aside }: { title: string; icon: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="bg-card border-2 border-ink rounded-2xl overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-6 py-4 border-b-2 border-dashed border-ink/15 bg-paper/60">
        <h2 className="flex items-center gap-2.5 font-display text-xl text-ink">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-saffron">{icon}</span>
          {title}
        </h2>
        {aside}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

/* ---------------- charts ---------------- */
function ReservationsChart({ live }: { live: number }) {
  const base = [14, 22, 19, 28, 26, 34];
  const months = ["مرداد", "شهریور", "مهر", "آبان", "آذر", "دی"];
  const data = [...base.slice(0, -1), base[base.length - 1] + live];
  const max = Math.max(...data);
  return (
    <Panel
      title="روند رزرو مشاوره"
      icon={<IcTrend className="w-4 h-4" />}
      aside={<span className="text-xs font-bold text-muted">۶ ماه اخیر • ستون آخر زنده است</span>}
    >
      <div className="flex items-end justify-between gap-3 h-52" dir="rtl">
        {data.map((v, i) => (
          <div key={months[i]} className="flex-1 h-full flex flex-col items-center group">
            <div className="flex-1 w-full flex items-end justify-center relative">
              <span className="absolute -top-1 text-xs font-display text-ink opacity-0 group-hover:opacity-100 transition-opacity">{fa(v)}</span>
              <div
                className={`w-full max-w-12 rounded-t-lg border-2 border-ink transition-all duration-700 ease-out ${
                  i === data.length - 1 ? "bg-coral" : "bg-saffron"
                } group-hover:opacity-85`}
                style={{ height: `${(v / max) * 100}%` }}
              />
            </div>
            <span className="mt-2 text-[11px] font-bold text-muted shrink-0">{months[i]}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CapacityPanel() {
  const { site } = useSite();
  return (
    <Panel
      title="ظرفیت کلاس‌ها"
      icon={<IcUsers className="w-4 h-4" />}
      aside={
        <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:text-ink transition-colors">
          ویرایش کلاس‌ها <IcArrow className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <ul className="space-y-4">
        {site.classes.slice(0, 6).map((c) => (
          <li key={c.id}>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-ink truncate ml-3">{c.title}</span>
              <span className={c.capacity >= 85 ? "text-coral" : "text-tealdark"}>{fa(`${c.capacity}٪`)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper border border-ink/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ${c.capacity >= 85 ? "bg-coral" : "bg-teal"}`}
                style={{ width: `${c.capacity}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ---------------- tables ---------------- */
function ReservationsTable() {
  const { reservations, cycleReservationStatus } = useActivity();
  return (
    <Panel
      title="رزروهای مشاوره"
      icon={<IcChat className="w-4 h-4" />}
      aside={<span className="text-xs font-bold text-muted">روی وضعیت کلیک کن تا تغییر کند</span>}
    >
      {reservations.length === 0 ? (
        <p className="text-center py-6 text-sm font-bold text-muted">هنوز رزروی ثبت نشده.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="text-right text-[11px] font-bold text-muted border-b-2 border-ink/10">
                <th className="pb-3 font-bold">کد</th>
                <th className="pb-3 font-bold">داوطلب</th>
                <th className="pb-3 font-bold">گروه</th>
                <th className="pb-3 font-bold">خدمت</th>
                <th className="pb-3 font-bold">تاریخ</th>
                <th className="pb-3 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-ink/8 hover:bg-saffron/10 transition-colors">
                  <td className="py-3 font-display text-saffrondeep" dir="ltr">{fa(r.code)}</td>
                  <td className="py-3 font-bold text-ink">{r.name}</td>
                  <td className="py-3 text-muted font-semibold">{r.group}</td>
                  <td className="py-3 text-muted font-semibold">{r.service}</td>
                  <td className="py-3 text-muted font-semibold">{r.date}</td>
                  <td className="py-3">
                    <button
                      onClick={() => cycleReservationStatus(r.id)}
                      className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold hover:-translate-y-0.5 active:translate-y-0 transition-transform ${STATUS_CLS[r.status] ?? ""}`}
                    >
                      {r.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function OrdersTable() {
  const { orders, cycleOrderStatus } = useActivity();
  return (
    <Panel
      title="سفارش‌های فروشگاه"
      icon={<IcCart className="w-4 h-4" />}
      aside={<span className="text-xs font-bold text-muted">{fa(orders.length)} سفارش</span>}
    >
      {orders.length === 0 ? (
        <p className="text-center py-6 text-sm font-bold text-muted">سفارشی نیست.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="text-right text-[11px] font-bold text-muted border-b-2 border-ink/10">
                <th className="pb-3 font-bold">خریدار</th>
                <th className="pb-3 font-bold">اقلام</th>
                <th className="pb-3 font-bold">مبلغ</th>
                <th className="pb-3 font-bold">تاریخ</th>
                <th className="pb-3 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/8 hover:bg-saffron/10 transition-colors">
                  <td className="py-3 font-bold text-ink">{o.customer}</td>
                  <td className="py-3 text-muted font-semibold max-w-56 truncate">{o.items.map((x) => x.title).join("، ")}</td>
                  <td className="py-3 font-display text-ink whitespace-nowrap">
                    {money(o.total)} <span className="text-[10px] font-body font-bold text-muted">تومان</span>
                  </td>
                  <td className="py-3 text-muted font-semibold">{o.date}</td>
                  <td className="py-3">
                    <button
                      onClick={() => cycleOrderStatus(o.id)}
                      className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold hover:-translate-y-0.5 active:translate-y-0 transition-transform ${STATUS_CLS[o.status] ?? ""}`}
                    >
                      {o.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function Inbox() {
  const { messages, markRead, deleteMessage } = useActivity();
  const unread = messages.filter((m) => !m.read).length;
  return (
    <Panel
      title="صندوق پیام‌ها"
      icon={<IcMail className="w-4 h-4" />}
      aside={
        unread > 0 ? (
          <span className="px-3 py-1 rounded-full bg-coral text-paper text-xs font-bold border-2 border-ink">{fa(unread)} خوانده‌نشده</span>
        ) : (
          <span className="text-xs font-bold text-tealdark">همه خوانده شده</span>
        )
      }
    >
      {messages.length === 0 ? (
        <p className="text-center py-6 text-sm font-bold text-muted">پیامی نیست.</p>
      ) : (
        <ul className="space-y-3.5">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border-2 p-4 transition-colors ${m.read ? "border-ink/10 bg-paper/60" : "border-ink/30 bg-saffron/10"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {!m.read && <span className="w-2.5 h-2.5 rounded-full bg-coral pulse-dot shrink-0" />}
                  <p className="font-bold text-sm text-ink truncate">{m.name}</p>
                  <span className="hidden sm:inline text-[10px] font-bold text-tealdark bg-teal/10 border border-teal/40 rounded-full px-2 py-0.5 shrink-0">
                    {m.topic}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!m.read && (
                    <button
                      onClick={() => markRead(m.id)}
                      title="خواندم"
                      className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink/20 text-muted hover:border-teal hover:text-tealdark hover:bg-teal/10 transition-colors"
                    >
                      <IcCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(m.id)}
                    title="حذف"
                    className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink/20 text-muted hover:border-coral hover:text-coral hover:bg-coral/10 transition-colors"
                  >
                    <IcTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] leading-7 text-ink/75 font-medium mt-2.5">{m.msg}</p>
              <p className="text-[11px] font-semibold text-muted mt-2" dir="ltr">
                {fa(m.phone)} • {m.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------------- page ---------------- */
function Dashboard() {
  const { site } = useSite();
  const { reservations, orders, messages } = useActivity();

  const revenue = orders.reduce((a, b) => a + b.total, 0);
  const unread = messages.filter((m) => !m.read).length;
  const avgCapacity = Math.round(site.classes.reduce((a, c) => a + c.capacity, 0) / Math.max(1, site.classes.length));

  return (
    <>
      <PageHero
        crumb="داشبورد ادمین"
        kicker="پنل مدیریت"
        title={
          <>
            اتاق فرمان <span className="text-saffron">رتبه‌شو</span>
          </>
        }
        desc="رزروها، سفارش‌ها و پیام‌ها به‌صورت زنده از فرم‌های سایت می‌آیند؛ وضعیت‌ها را با یک کلیک تغییر بده."
        chip="همهٔ داده‌ها زنده‌اند"
      />

      <section className="relative bg-paper bg-grid py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <Reveal>
              <Kpi label="رزرو مشاوره" value={fa(reservations.length)} sub="از ابتدای فصل" icon={<IcChat className="w-5 h-5" />} tone="bg-ink text-paper shadow-hard-saffron" />
            </Reveal>
            <Reveal delay={90}>
              <Kpi label="فروش فروشگاه" value={money(revenue)} sub="تومان • مجموع سفارش‌ها" icon={<IcCart className="w-5 h-5" />} tone="bg-card text-ink hover:shadow-hard" />
            </Reveal>
            <Reveal delay={180}>
              <Kpi label="پیام خوانده‌نشده" value={fa(unread)} sub="در صندوق پشتیبانی" icon={<IcMail className="w-5 h-5" />} tone="bg-coral text-paper hover:shadow-hard" />
            </Reveal>
            <Reveal delay={270}>
              <Kpi label="میانگین ظرفیت کلاس‌ها" value={fa(`${avgCapacity}٪`)} sub={`${fa(site.classes.length)} کلاس فعال`} icon={<IcTarget className="w-5 h-5" />} tone="bg-card text-ink hover:shadow-hard" />
            </Reveal>
          </div>

          {/* charts row */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch">
            <Reveal delay={120}>
              <ReservationsChart live={reservations.length} />
            </Reveal>
            <Reveal delay={220}>
              <CapacityPanel />
            </Reveal>
          </div>

          {/* reservations + inbox */}
          <div className="mt-10 grid xl:grid-cols-[1.25fr_1fr] gap-8 items-start">
            <Reveal delay={140}>
              <ReservationsTable />
            </Reveal>
            <Reveal delay={240}>
              <Inbox />
            </Reveal>
          </div>

          {/* orders */}
          <div className="mt-10">
            <Reveal delay={160}>
              <OrdersTable />
            </Reveal>
          </div>

          {/* footer actions */}
          <Reveal delay={200} className="mt-12 flex flex-wrap items-center justify-between gap-5 bg-ink border-2 border-ink rounded-2xl p-7">
            <div>
              <h3 className="font-display text-2xl text-paper">می‌خواهی محتوای سایت را هم تغییر بدهی؟</h3>
              <p className="text-sm font-semibold text-paper/60 mt-1.5">کلاس‌ها، محصولات، خدمات، اساتید و سوالات — همه در پنل مدیریت محتوا قابل ویرایش‌اند.</p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2.5 h-13 px-7 py-3.5 rounded-xl bg-saffron text-ink font-bold border-2 border-ink shadow-hard-sm hover:-translate-y-1 transition-all duration-300"
            >
              <IcGear className="w-5 h-5" />
              پنل مدیریت محتوا
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rs-admin") === "1");
  if (!authed) return <Gate onOk={() => setAuthed(true)} />;
  return <Dashboard />;
}
