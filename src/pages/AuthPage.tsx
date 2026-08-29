import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useActivity } from "../activity";
import { fa } from "../ui";
import { Seo } from "../seo";
import { Logo } from "../components/Nav";
import { IcArrow, IcChat, IcCheck, IcClock, IcSpark, IcUser } from "../icons";

const GROUPS = ["تجربی", "ریاضی", "انسانی", "زبان"];

const inputCls =
  "w-full h-13 px-4 rounded-xl bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors";

type Mode = "login" | "signup";

export default function AuthPage() {
  const { user, login, signup } = useAuth();
  const activity = useActivity();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", group: GROUPS[0], password: "" });

  const syncProfile = (name: string, group: string) => {
    if (group) activity.setProfile({ ...activity.profile, name, group });
    else activity.setProfile({ ...activity.profile, name });
  };

  // وقتی ورود/ثبت‌نام موفق بود، بر اساس نقشِ واقعی کاربر به داشبورد درست برو
  useEffect(() => {
    if (busy && user) {
      const t = window.setTimeout(
        () => navigate(user.role === "admin" ? "/dashboard/admin" : "/dashboard/student"),
        400
      );
      return () => window.clearTimeout(t);
    }
  }, [busy, user, navigate]);

  const submitSignup = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await signup(signupForm);
    if (res) {
      setErr(res);
      return;
    }
    syncProfile(signupForm.name.trim(), signupForm.group);
    setBusy(true);
  };

  const finishLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await login(loginForm);
    if (res) {
      setErr(res);
      return;
    }
    setBusy(true);
  };

  return (
    <section className="min-h-screen bg-ink bg-grid-dark text-paper flex">
      <Seo
        title="ورود و ثبت‌نام | رتبه‌شو"
        description="ورود به حساب کاربری یا ثبت‌نام در رتبه‌شو برای دسترسی به داشبورد دانش‌آموز، پیگیری سفارش‌ها و رزرو مشاوره."
        path="/auth"
        noindex
      />
      {/* brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between w-[46%] p-12 overflow-hidden border-l-2 border-inkline">
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-saffron/15 blur-3xl" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-6 font-display text-[20rem] leading-none text-outline-paper select-none"
        >
          ر
        </span>
        <div className="relative">
          <Logo dark />
          <h1 className="font-display text-5xl leading-[1.2] mt-10">
            درسته که کنکور
            <br />
            <span className="text-saffron">مسابقه‌ست،</span>
            <br />
            ولی تنها نیستی.
          </h1>
          <p className="text-paper/70 leading-8 mt-5 max-w-md">
            با یک حساب، به داشبورد اختصاصی‌ات وصل می‌شی؛ کلاس‌هات، رزرو مشاوره، سفارش‌ها و ساعت مطالعه‌ات همه‌جا همراهته.
          </p>
        </div>
        <ul className="relative space-y-3.5">
          {[
            { icon: <IcChat className="w-4.5 h-4.5" />, text: "رزرو مشاوره و پیگیری وضعیتش در داشبورد" },
            { icon: <IcClock className="w-4.5 h-4.5" />, text: "ثبت ساعت مطالعه و دیدن نمودار هفته" },
            { icon: <IcCheck className="w-4.5 h-4.5" />, text: "سبد خرید و تسویه‌حساب با یک کلیک" },
          ].map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-sm font-semibold text-paper/85">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-saffron text-ink border-2 border-ink shrink-0">{f.icon}</span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>

      {/* form panel */}
      <div className="flex-1 flex items-center justify-center bg-paper bg-grid text-ink px-4 py-16 relative">
        <span aria-hidden="true" className="pointer-events-none absolute -top-10 right-8 font-display text-[10rem] leading-none text-ink/5 select-none">
          ؟
        </span>
        <div className="w-full max-w-md relative">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="bg-card border-2 border-ink rounded-2xl shadow-hard overflow-hidden">
            {/* mode tabs */}
            <div className="grid grid-cols-2 border-b-2 border-ink">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setErr(null);
                  }}
                  className={`py-4 font-display text-xl transition-colors duration-300 ${
                    mode === m ? "bg-saffron text-ink" : "bg-card text-muted hover:text-ink"
                  }`}
                >
                  {m === "login" ? "ورود" : "ثبت‌نام"}
                </button>
              ))}
            </div>

            <div className="p-7 md:p-8">
              {mode === "login" ? (
                <form onSubmit={finishLogin} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">ایمیل یا موبایل</label>
                    <input
                      className={inputCls}
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="negar@test.ir"
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">رمز عبور</label>
                    <input
                      type="password"
                      className={inputCls}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {err && <p className="text-sm font-bold text-coral bg-coral/10 border border-coral/40 rounded-lg px-3 py-2">{err}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-14 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60"
                  >
                    {busy ? "در حال ورود…" : "ورود به داشبورد"}
                  </button>
                </form>
              ) : (
                <form onSubmit={submitSignup} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">نام و نام خانوادگی</label>
                    <input
                      className={inputCls}
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="مثلاً نگار موسوی"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">ایمیل</label>
                    <input
                      className={inputCls}
                      dir="ltr"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">موبایل</label>
                    <input
                      className={inputCls}
                      dir="ltr"
                      inputMode="numeric"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      placeholder="09123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">گروه آزمایشی</label>
                    <div className="grid grid-cols-4 gap-2">
                      {GROUPS.map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setSignupForm({ ...signupForm, group: g })}
                          className={`h-11 rounded-xl border-2 border-ink text-sm font-bold transition-all duration-200 ${
                            signupForm.group === g ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-saffron/40"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">رمز عبور (حداقل ۶ کاراکتر)</label>
                    <input
                      type="password"
                      className={inputCls}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      placeholder="••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  {err && <p className="text-sm font-bold text-coral bg-coral/10 border border-coral/40 rounded-lg px-3 py-2">{err}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-14 rounded-xl bg-coral text-paper font-bold text-lg border-2 border-ink shadow-hard hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60"
                  >
                    {busy ? "در حال ساخت حساب…" : "ساخت حساب و شروع"}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-5 border-t-2 border-dashed border-ink/15 text-center">
                <p className="text-[11px] font-semibold text-muted leading-6">
                  حساب نمونهٔ دانش‌آموز: <span dir="ltr" className="font-bold text-ink">negar@test.ir</span> / <span dir="ltr" className="font-bold text-ink">123456</span>
                  <br />
                  حساب ادمین: <span dir="ltr" className="font-bold text-ink">admin@ratbesho.ir</span> / <span dir="ltr" className="font-bold text-ink">admin1405</span>
                </p>
                <Link
                  to="/"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-coral hover:text-ink transition-colors"
                >
                  <IcArrow className="w-4 h-4 rotate-180" />
                  بازگشت به سایت
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] font-semibold text-muted mt-5 flex items-center justify-center gap-1.5">
            <IcSpark className="w-4 h-4 text-saffrondeep" />
            {fa("۴٬۲۰۰")} داوطلب همین حالا توی رتبه‌شو حساب دارند
          </p>
        </div>
      </div>
    </section>
  );
}
