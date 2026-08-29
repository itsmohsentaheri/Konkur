import { useState, type FormEvent } from "react";
import FAQ from "../components/FAQ";
import { PageHero, Reveal, fa } from "../ui";
import { useSite } from "../store";
import { useActivity } from "../activity";
import { Seo, jsonLd } from "../seo";
import { IcCheck, IcClock, IcMail, IcPhone, IcPin, IcSpark } from "../icons";

const TOPICS = ["مشاوره انتخاب رشته", "کلاس‌های آموزشی", "محصولات و فروشگاه", "همکاری با رتبه‌شو", "سایر موضوعات"];

const inputCls =
  "w-full h-13 px-4 rounded-xl bg-paper border-2 border-ink/15 text-sm font-semibold outline-none focus:border-ink transition-colors";

export default function ContactPage() {
  const { site } = useSite();
  const activity = useActivity();
  const [form, setForm] = useState({ name: "", phone: "", topic: TOPICS[0], msg: "" });
  const [err, setErr] = useState<{ name?: string; phone?: string; msg?: string }>({});
  const [code, setCode] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof err = {};
    if (form.name.trim().length < 3) errs.name = "نام و نام خانوادگی را کامل بنویس";
    if (!/^09\d{9}$/.test(form.phone.trim())) errs.phone = "موبایل باید مثل ۰۹۱۲۳۴۵۶۷۸۹ باشد";
    if (form.msg.trim().length < 10) errs.msg = "پیام را کمی کامل‌تر بنویس (حداقل ۱۰ حرف)";
    setErr(errs);
    if (Object.keys(errs).length) return;
    void activity.addMessage({
      name: form.name.trim(),
      phone: form.phone.trim(),
      topic: form.topic,
      msg: form.msg.trim(),
    });
    setCode(`CT-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const infos = [
    { icon: <IcPin className="w-6 h-6" />, title: "دفتر مرکزی", value: site.settings.address },
    { icon: <IcPhone className="w-6 h-6" />, title: "تلفن پشتیبانی", value: fa(site.settings.phone), ltr: true },
    { icon: <IcMail className="w-6 h-6" />, title: "ایمیل", value: site.settings.email, ltr: true },
    { icon: <IcClock className="w-6 h-6" />, title: "ساعات پاسخگویی", value: "شنبه تا پنجشنبه، ۹ تا ۲۱" },
  ];

  return (
    <>
      <Seo
        title="تماس با رتبه‌شو و سوالات متداول کنکور"
        description="راه‌های ارتباطی با تیم رتبه‌شو؛ ارسال پیام، رزرو مشاوره تلفنی و پاسخ سوالات متداول داوطلبان کنکور و انتخاب رشته."
        path="/contact"
        jsonLd={[jsonLd.breadcrumb([["خانه", "/"], ["تماس با ما", "/contact"]]), jsonLd.faqs(site.faqs)]}
      />
      <PageHero
        crumb="تماس"
        kicker="تماس با رتبه‌شو"
        title={
          <>
            یک پیام کافی است؛ <span className="text-saffron">بقیه‌اش با ما</span>
          </>
        }
        desc="سوالی داری، جایی گیر کرده‌ای یا می‌خواهی حضوری صحبت کنی؟ فرم را پر کن یا مستقیم زنگ بزن — در کمتر از ۲۴ ساعت جواب می‌گیری."
        chip="پاسخ‌گویی در کمتر از ۲۴ ساعت"
      />

      <section className="relative bg-paper bg-grid py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* info cards */}
          <div className="space-y-5">
            {infos.map((info, i) => (
              <Reveal key={info.title} delay={i * 110}>
                <div className="group flex items-center gap-5 bg-card border-2 border-ink rounded-2xl p-6 hover:-translate-y-1 hover:shadow-hard transition-all duration-300">
                  <span className="grid place-items-center w-14 h-14 rounded-xl bg-ink text-saffron border-2 border-ink shrink-0 group-hover:bg-saffron group-hover:text-ink group-hover:-rotate-6 transition-all duration-300">
                    {info.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xl text-ink leading-tight">{info.title}</p>
                    <p className="text-sm font-semibold text-muted mt-1.5 leading-7" dir={info.ltr ? "ltr" : undefined}>
                      {info.value}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={440}>
              <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-saffron/15 p-6 text-sm font-semibold leading-8 text-ink/75 flex gap-3.5">
                <IcSpark className="w-6 h-6 text-saffrondeep shrink-0 mt-1" />
                <span>
                  برای مشاورهٔ فوری تلفنی، هر روز از ساعت ۹ تا ۲۱ پاسخگو هستیم. جلسهٔ اول مشاوره{" "}
                  <strong className="text-ink">کاملاً رایگان</strong> است.
                </span>
              </div>
            </Reveal>
          </div>

          {/* message form */}
          <Reveal delay={150}>
            <div className="bg-card border-2 border-ink rounded-2xl shadow-hard p-7 md:p-9">
              {code ? (
                <div className="text-center py-10">
                  <span className="toast-in grid place-items-center w-20 h-20 mx-auto rounded-2xl bg-teal text-paper border-2 border-ink shadow-hard-sm">
                    <IcCheck className="w-10 h-10" />
                  </span>
                  <h3 className="font-display text-3xl text-ink mt-6">پیامت رسید!</h3>
                  <p className="text-muted font-semibold mt-3 leading-8">
                    کد پیگیری تو: <span className="font-display text-xl text-coral" dir="ltr">{fa(code)}</span>
                    <br />
                    حداکثر تا ۲۴ ساعت آینده باهات تماس می‌گیریم.
                  </p>
                  <button
                    onClick={() => {
                      setCode(null);
                      setForm({ name: "", phone: "", topic: TOPICS[0], msg: "" });
                    }}
                    className="mt-7 h-12 px-6 rounded-xl bg-ink text-paper font-bold border-2 border-ink hover:bg-coral transition-colors"
                  >
                    ارسال پیام جدید
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h3 className="font-display text-3xl text-ink">فرستادن پیام</h3>
                  <p className="text-sm font-semibold text-muted mt-2">همهٔ فیلدها لازم هستند.</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1.5">نام و نام خانوادگی</label>
                      <input
                        className={inputCls}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="مثلاً نگار موسوی"
                      />
                      {err.name && <p className="text-xs font-bold text-coral mt-1.5">{err.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1.5">شماره موبایل</label>
                      <input
                        className={inputCls}
                        dir="ltr"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="09123456789"
                      />
                      {err.phone && <p className="text-xs font-bold text-coral mt-1.5">{err.phone}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted mb-1.5">موضوع</label>
                      <select
                        className={inputCls}
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      >
                        {TOPICS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted mb-1.5">پیام شما</label>
                      <textarea
                        className={`${inputCls} h-32 py-3 resize-none`}
                        value={form.msg}
                        onChange={(e) => setForm({ ...form, msg: e.target.value })}
                        placeholder="شرایطت، سوالت یا هر چیزی که لازم می‌دانی بدانیم…"
                      />
                      {err.msg && <p className="text-xs font-bold text-coral mt-1.5">{err.msg}</p>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-7 w-full h-14 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-1 transition-all duration-300"
                  >
                    ارسال پیام
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <FAQ />
    </>
  );
}
