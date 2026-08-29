import { STATS, TICKER } from "../data";
import { CountUp, Reveal, fa, useCountdown } from "../ui";
import { IcArrow, IcPlay, IcSpark, IcTarget, IcChart } from "../icons";

const LETTERS = ["الف", "ب", "ج", "د"];
const ANSWERS = [1, 3, 0, 2, 2, 1, 3, 0];

function AnswerSheet() {
  return (
    <div className="relative">
      {/* floating chips */}
      <div className="floaty absolute -top-5 -right-4 md:-right-8 z-10 flex items-center gap-2 bg-teal text-paper px-4 py-2.5 rounded-xl border-2 border-ink shadow-hard-sm">
        <IcChart className="w-5 h-5" />
        <span className="font-bold text-sm">درصد کل: {fa("۷۶٪")}</span>
      </div>
      <div className="floaty2 absolute -bottom-6 -left-3 md:-left-7 z-10 flex items-center gap-2 bg-saffron text-ink px-4 py-2.5 rounded-xl border-2 border-ink shadow-hard-sm">
        <IcTarget className="w-5 h-5" />
        <span className="font-bold text-sm">تراز: {fa("۹٬۸۴۰")}</span>
      </div>

      <div className="relative bg-card border-2 border-ink rounded-2xl shadow-hard p-5 md:p-7 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500">
        {/* header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-ink/25">
          <div>
            <p className="font-display text-2xl leading-none">پاسخ‌برگ سراسری</p>
            <p className="text-xs text-muted mt-1.5 font-medium">گروه آزمایشی: علوم تجربی</p>
          </div>
          <div className="text-left">
            <p className="text-[11px] text-muted font-medium">شماره داوطلبی</p>
            <p className="font-display text-xl text-coral leading-none mt-1">{fa("1405-8732")}</p>
          </div>
        </div>
        {/* candidate row */}
        <div className="flex items-center gap-2 py-3 text-sm border-b border-ink/10">
          <span className="text-muted whitespace-nowrap">نام داوطلب:</span>
          <span className="flex-1 border-b-2 border-dotted border-ink/30 font-bold">شما، رتبهٔ بعدی ما!</span>
        </div>
        {/* bubbles */}
        <div className="py-4 space-y-2.5" dir="rtl">
          {ANSWERS.map((ans, r) => (
            <div key={r} className="flex items-center justify-between gap-3">
              <span className="w-7 h-7 grid place-items-center rounded-lg bg-paper border border-ink/15 text-xs font-bold">
                {fa(r + 1)}
              </span>
              <div className="flex items-center gap-2.5 flex-1 justify-center">
                {LETTERS.map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted font-medium">{l}</span>
                    <span
                      className={i === ans ? "bubble bubble-anim" : "bubble"}
                      style={i === ans ? { animationDelay: `${r * 0.55}s` } : undefined}
                    />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* footer stats */}
        <div className="pt-4 border-t-2 border-dashed border-ink/25 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>پیشروی در بودجه‌بندی</span>
              <span className="text-tealdark">{fa("۷۸٪")}</span>
            </div>
            <div className="h-2.5 rounded-full bg-paper border border-ink/15 overflow-hidden">
              <div className="h-full w-[78%] rounded-full bg-teal animate-[grow_1.6s_cubic-bezier(.2,.7,.2,1)_both]" />
            </div>
          </div>
          {/* barcode */}
          <div className="flex items-end gap-[3px] h-7 opacity-80" dir="ltr">
            {[3, 1, 2, 1, 3, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1].map((w, i) => (
              <span key={i} className="bg-ink rounded-[1px]" style={{ width: w, height: "100%" }} />
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes grow { from { width: 0 } }`}</style>
    </div>
  );
}

function Countdown() {
  const t = useCountdown();
  const cells = [
    { v: t.days, label: "روز" },
    { v: t.hours, label: "ساعت" },
    { v: t.minutes, label: "دقیقه" },
    { v: t.seconds, label: "ثانیه" },
  ];
  return (
    <div className="bg-ink bg-grid-dark border-y-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-paper">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-coral border-2 border-paper/20">
            <IcSpark className="w-6 h-6" />
          </span>
          <div>
            <p className="font-display text-2xl leading-none">تا {t.label}</p>
            <p className="text-xs text-paper/60 mt-1 font-medium">هر روز یک قدم نزدیک‌تر — برنامه‌ات را از امروز بچین</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 md:gap-3" dir="ltr">
          {cells.map((c, i) => (
            <div key={c.label} className="flex items-center gap-2.5 md:gap-3">
              <div className="text-center bg-ink2 border-2 border-inkline rounded-xl px-4 md:px-5 py-3 min-w-[76px] md:min-w-[88px]">
                <span key={c.v} className="tick-num block font-display text-3xl md:text-4xl text-saffron leading-none tabular-nums">
                  {fa(String(c.v).padStart(2, "0"))}
                </span>
                <span className="block text-[11px] text-paper/60 font-semibold mt-1.5">{c.label}</span>
              </div>
              {i < 3 && <span className="font-display text-2xl text-saffron/70">:</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="marquee relative z-10 bg-saffron border-y-2 border-ink py-3 overflow-hidden -rotate-1 scale-[1.02]">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap mx-5 text-ink font-bold text-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 ml-3 text-coral" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5 14 9l6.5 2L14 13l-2 6.5L10 13l-6.5-2L10 9l2-6.5Z" />
            </svg>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <>
      <section id="top" className="relative bg-grid pt-[72px] overflow-hidden">
        {/* ambient ink blob at corner */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-saffron/25 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-teal/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-[1.08fr_0.92fr] gap-14 lg:gap-10 items-center py-14 lg:py-24">
          {/* copy */}
          <div>
            <div className="hero-line">
              <span style={{ animationDelay: "0.05s" }}>
                <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-ink bg-card shadow-hard-sm text-sm font-bold">
                  <span className="pulse-dot w-2.5 h-2.5 rounded-full bg-coral" />
                  ثبت‌نام ترم جدید فعال است
                </span>
              </span>
            </div>
            <h1 className="font-display text-[2.9rem] leading-[1.18] md:text-7xl md:leading-[1.16] text-ink mt-6">
              <span className="hero-line">
                <span style={{ animationDelay: "0.15s" }}>انتخاب رشته،</span>
              </span>
              <span className="hero-line">
                <span style={{ animationDelay: "0.3s" }}>
                  قمار نیست؛ <span className="hl on">نقشهٔ راه</span> است
                </span>
              </span>
            </h1>
            <Reveal delay={250} className="mt-6 max-w-xl">
              <p className="text-lg leading-9 text-muted">
                کلاس‌های تخصصی، مشاورهٔ خصوصی انتخاب رشته و منابع دست‌اول — همه زیر یک سقف، تا{" "}
                <strong className="text-ink font-bold">رتبه‌ات را با داده و برنامه بگیری</strong>، نه با شانس.
              </p>
            </Reveal>
            <Reveal delay={380} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#consulting"
                className="group inline-flex items-center gap-3 h-14 px-7 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-1 transition-all duration-300"
              >
                رزرو مشاوره رایگان
                <IcArrow className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </a>
              <a
                href="#classes"
                className="group inline-flex items-center gap-3 h-14 px-6 rounded-xl bg-card text-ink font-bold text-lg border-2 border-ink hover:bg-saffron/40 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-coral text-paper border-2 border-ink group-hover:scale-110 transition-transform">
                  <IcPlay className="w-4 h-4" />
                </span>
                مشاهده کلاس‌ها
              </a>
            </Reveal>
            <Reveal delay={480} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-[2px] border-2 border-ink rounded-xl bg-ink/15 overflow-hidden">
              {STATS.map((s) => (
                <div key={s.label} className="bg-card px-4 py-5 text-center hover:bg-saffron/25 transition-colors duration-300">
                  <p className="font-display text-3xl md:text-4xl text-ink leading-none">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs font-bold text-muted mt-2">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
          {/* answer sheet */}
          <Reveal delay={300} className="lg:pl-6">
            <AnswerSheet />
          </Reveal>
        </div>
        <Countdown />
      </section>
      <Ticker />
    </>
  );
}
