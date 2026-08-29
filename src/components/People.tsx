import { TEACHERS, TESTIMONIALS } from "../data";
import { Reveal, SectionHead, fa } from "../ui";
import { IcCap, IcStar, IcUsers } from "../icons";

export function Teachers() {
  return (
    <section id="teachers" className="relative bg-paper bg-grid py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHead
          kicker="اساتید رتبه‌ساز"
          title={
            <>
              کسانی که خودشان <span className="text-coral">از این مسیر</span> رد شده‌اند
            </>
          }
          desc="همه اساتید رتبه‌شو، خودشان رتبه‌های برتر کنکور بوده‌اند؛ یعنی مسیری را که پیشنهاد می‌دهند، قدم‌به‌قدم پیموده‌اند."
        />
        <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {TEACHERS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 110}>
              <article className="group relative h-full bg-card border-2 border-ink rounded-2xl p-6 hover:-translate-y-2 hover:shadow-hard transition-all duration-400 overflow-hidden">
                <span
                  className="absolute -top-10 -left-10 w-28 h-28 rounded-full opacity-15 group-hover:scale-150 transition-transform duration-700"
                  style={{ background: t.color }}
                />
                <div className="flex items-center gap-4">
                  <span
                    className="relative grid place-items-center w-16 h-16 rounded-2xl border-2 border-ink text-paper font-display text-3xl shadow-hard-sm group-hover:-rotate-6 transition-transform duration-300"
                    style={{ background: t.color }}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink leading-tight">{t.name}</h3>
                    <p className="text-sm font-bold mt-1" style={{ color: t.color }}>
                      {t.field}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-bold text-muted mt-4 inline-flex items-center gap-1.5 bg-paper border border-ink/10 rounded-full px-3 py-1.5">
                  <IcStar className="w-3.5 h-3.5 text-saffrondeep" />
                  {t.credit}
                </p>
                <blockquote className="mt-4 text-sm leading-7 text-ink/80 font-medium border-r-[3px] pr-3" style={{ borderColor: t.color }}>
                  «{t.quote}»
                </blockquote>
                <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/15 flex items-center justify-between text-xs font-bold text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <IcCap className="w-4 h-4 text-teal" />
                    {fa(t.years)} سال تدریس
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IcUsers className="w-4 h-4 text-teal" />
                    {fa(t.students.toLocaleString("en-US"))} دانش‌آموز
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="relative bg-ink bg-grid-dark py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/4 w-[400px] h-[400px] rounded-full bg-coral/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <SectionHead
          dark
          kicker="قبولی‌های امسال"
          title={
            <>
              اسمِ بعدی این لیست، <span className="text-saffron">اسم توست</span>
            </>
          }
          desc="چند پیام از داوطلبانی که پارسال همین موقع، جای تو بودند و الان سر کلاس دانشگاه نشسته‌اند."
        />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 130}>
              <article className="group relative h-full bg-ink2 border-2 border-inkline rounded-2xl p-7 hover:border-saffron hover:-translate-y-1.5 transition-all duration-400">
                <span className="absolute top-5 left-6 font-display text-7xl text-saffron/25 leading-none select-none group-hover:text-saffron/50 transition-colors duration-500">
                  ”
                </span>
                <div className="flex items-center gap-4">
                  <span className="grid place-items-center w-13 h-13 p-3.5 rounded-xl bg-saffron text-ink font-display text-2xl border-2 border-ink shrink-0">
                    {t.name.slice(0, 1)}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-paper leading-tight">{t.name}</h3>
                    <p className="text-saffron text-sm font-bold mt-1">{t.rank}</p>
                    <p className="text-paper/55 text-xs font-semibold mt-0.5">{t.major}</p>
                  </div>
                </div>
                <p className="mt-5 text-[15px] leading-8 text-paper/80 font-medium">{t.quote}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
