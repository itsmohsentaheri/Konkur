import { useRef, useState, type FormEvent } from "react";
import { useSite } from "../store";
import { useActivity } from "../activity";
import { useAuth } from "../auth";
import { Reveal, SectionHead, fa, money } from "../ui";
import { IcCheck, IcChat, IcClock, IcPhone, IcSpark } from "../icons";

type FormState = { name: string; phone: string; group: string; service: string };

export default function Consulting() {
  const { site } = useSite();
  const activity = useActivity();
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    group: user?.group || "تجربی",
    service: site.services[0]?.title ?? "",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<string | null>(null);

  const pickService = (title: string) => {
    setForm((f) => ({ ...f, service: title }));
    setDone(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().length < 3) errs.name = "نام و نام خانوادگی را کامل وارد کنید";
    if (!/^09\d{9}$/.test(form.phone.trim())) errs.phone = "شماره موبایل باید مثل ۰۹۱۲۳۴۵۶۷۸۹ باشد";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = `RS-${Math.floor(1000 + Math.random() * 9000)}`;
    activity.addReservation({
      code,
      name: form.name.trim(),
      phone: form.phone.trim(),
      group: form.group,
      service: form.service,
    });
    setDone(code);
  };

  return (
    <section id="consulting" className="relative bg-ink bg-grid-dark py-20 md:py-28 scroll-mt-20 text-paper">
      <div className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-saffron/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:items-end">
          <SectionHead
            dark
            kicker="مشاوره و انتخاب رشته"
            title={
              <>
                ۱۵۰ انتخاب، <span className="text-saffron">صفر</span> استرس
              </>
            }
            desc="انتخاب رشته یعنی بازی با داده: ظرفیت‌ها، ترازها، بومی‌گزینی و علاقهٔ خودت. ما کنارت می‌نشینیم و تک‌تک انتخاب‌ها را با منطق می‌چینیم."
          />
          <Reveal delay={200} className="flex items-center gap-3 bg-ink2 border-2 border-inkline rounded-xl px-5 py-4 w-fit">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-saffron text-ink">
              <IcChat className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold text-sm">مشاوره اولیه رایگان</p>
              <p className="text-xs text-paper/60 mt-0.5">۱۵ دقیقه تلفنی • بدون تعهد</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid lg:grid-cols-[0.92fr_1.08fr] gap-12">
          {/* sticky side */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-8">
            <ol className="space-y-1">
              {site.steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 120}>
                  <li className="group flex gap-5 p-5 rounded-xl border-2 border-transparent hover:border-inkline hover:bg-ink2 transition-all duration-300">
                    <span className="font-display text-4xl text-saffron leading-none w-12 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-xl">{s.title}</h3>
                      <p className="text-sm leading-7 text-paper/65 mt-1.5">{s.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={200}>
              <figure className="relative rounded-2xl overflow-hidden border-2 border-inkline shadow-hard-saffron">
                <div className="overflow-hidden max-h-[340px] bg-ink2">
                  <img
                    src="https://image.qwenlm.ai/generated-images/6d7b6d69-9e75-4d94-b5e7-bfe448513ed4/_result.png"
                    alt="میز مطالعه داوطلب کنکور با جزوه و ماژیک هایلایت"
                    className="w-full h-[340px] object-cover kenburns"
                    loading="lazy"
                  />
                </div>
                <figcaption className="absolute bottom-0 inset-x-0 bg-ink/85 backdrop-blur-sm px-5 py-3.5 flex items-center gap-3">
                  <IcSpark className="w-5 h-5 text-saffron shrink-0" />
                  <p className="text-sm font-bold">
                    «هر انتخاب رشته، یک تصمیم ۴۰ ساله است؛ با حدس و گمان جلو نرو.»
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* services + form */}
          <div className="space-y-5">
            {site.services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 100}>
                <article
                  className={`relative bg-ink2 border-2 rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 ${
                    s.badge ? "border-saffron shadow-hard-saffron" : "border-inkline hover:border-saffron/60"
                  }`}
                >
                  {s.badge && (
                    <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-saffron text-ink text-xs font-bold border-2 border-ink">
                      {s.badge}
                    </span>
                  )}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl">{s.title}</h3>
                      <p className="inline-flex items-center gap-1.5 text-sm text-paper/60 font-semibold mt-1.5">
                        <IcClock className="w-4 h-4 text-saffron" />
                        {s.duration}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-display text-3xl text-saffron leading-none">
                        {money(s.price)}
                        <span className="text-xs text-paper/60 font-body font-bold mr-1.5">تومان</span>
                      </p>
                      <button
                        onClick={() => pickService(s.title)}
                        className="mt-3 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-paper text-ink text-sm font-bold border-2 border-ink hover:bg-saffron hover:-translate-y-0.5 transition-all duration-300"
                      >
                        رزرو این جلسه
                      </button>
                    </div>
                  </div>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-paper/80 font-medium">
                        <span className="grid place-items-center w-5 h-5 rounded-full bg-teal/25 text-teal shrink-0 mt-0.5">
                          <IcCheck className="w-3 h-3" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}

            {/* booking form */}
            <Reveal delay={120}>
              <div ref={formRef} className="relative bg-saffron border-2 border-ink rounded-2xl p-6 md:p-8 shadow-hard scroll-mt-28">
                <span className="absolute -top-4 right-6 px-4 py-1.5 rounded-full bg-coral text-paper text-xs font-bold border-2 border-ink">
                  ظرفیت این هفته: {fa(7)} جلسه
                </span>
                {done ? (
                  <div className="text-center py-8">
                    <span className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-teal text-paper border-2 border-ink">
                      <IcCheck className="w-8 h-8" />
                    </span>
                    <h3 className="font-display text-3xl text-ink mt-5">درخواستت ثبت شد!</h3>
                    <p className="text-ink/75 font-semibold mt-2 leading-7">
                      کد پیگیری: <span className="font-display text-xl text-coral">{fa(done)}</span>
                      <br />
                      کارشناسان ما تا ۲ ساعت دیگر با {fa(form.phone)} تماس می‌گیرند.
                    </p>
                    <button
                      onClick={() => {
                        setDone(null);
                        setForm({
                          name: user?.name ?? "",
                          phone: user?.phone ?? "",
                          group: user?.group || "تجربی",
                          service: site.services[0]?.title ?? "",
                        });
                      }}
                      className="mt-6 h-11 px-6 rounded-xl bg-ink text-paper font-bold border-2 border-ink hover:bg-coral transition-colors"
                    >
                      ثبت درخواست جدید
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <h3 className="font-display text-3xl text-ink flex items-center gap-3">
                      <IcPhone className="w-7 h-7" />
                      فرم رزرو مشاوره
                    </h3>
                    <p className="text-ink/70 font-semibold text-sm mt-1.5">
                      فرم را پر کن؛ خودمان تماس می‌گیریم — نه خبری از تماس‌های مزاحم!
                    </p>
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-sm font-bold text-ink">نام و نام خانوادگی</span>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="مثلا: سارا رضایی"
                          className={`mt-1.5 w-full h-12 px-4 rounded-xl bg-paper border-2 font-semibold text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-ink ${
                            errors.name ? "border-coral" : "border-ink/30"
                          }`}
                        />
                        {errors.name && <span className="text-xs font-bold text-coral mt-1 block">{errors.name}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-ink">شماره موبایل</span>
                        <input
                          type="tel"
                          dir="ltr"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="09xxxxxxxxx"
                          className={`mt-1.5 w-full h-12 px-4 rounded-xl bg-paper border-2 font-semibold text-ink text-left placeholder:text-muted/60 outline-none transition-colors focus:border-ink ${
                            errors.phone ? "border-coral" : "border-ink/30"
                          }`}
                        />
                        {errors.phone && <span className="text-xs font-bold text-coral mt-1 block">{errors.phone}</span>}
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-ink">گروه آزمایشی</span>
                        <select
                          value={form.group}
                          onChange={(e) => setForm({ ...form, group: e.target.value })}
                          className="mt-1.5 w-full h-12 px-4 rounded-xl bg-paper border-2 border-ink/30 font-semibold text-ink outline-none focus:border-ink transition-colors"
                        >
                          {["تجربی", "ریاضی", "انسانی", "هنر", "زبان"].map((g) => (
                            <option key={g}>{g}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-sm font-bold text-ink">نوع خدمات</span>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="mt-1.5 w-full h-12 px-4 rounded-xl bg-paper border-2 border-ink/30 font-semibold text-ink outline-none focus:border-ink transition-colors"
                        >
                          {site.services.map((s) => (
                            <option key={s.id}>{s.title}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 w-full h-14 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink hover:bg-coral hover:-translate-y-0.5 shadow-hard-sm transition-all duration-300"
                    >
                      ارسال درخواست — مشاوره اولیه رایگان
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
