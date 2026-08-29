import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { Teachers, Testimonials } from "../components/People";
import { useSite } from "../store";
import { Reveal, SectionHead, fa, money, useCountdown } from "../ui";
import { IcArrow, IcCap, IcCart, IcChat, IcCheck, IcClock } from "../icons";

const DOT: Record<string, string> = { saffron: "bg-saffron", coral: "bg-coral", teal: "bg-teal", ink: "bg-ink" };

function Previews() {
  const { site } = useSite();
  const t = useCountdown();
  return (
    <section className="relative bg-paper bg-grid py-20 md:py-24 overflow-hidden">
      <div className="pointer-events-none absolute top-0 -right-32 w-[420px] h-[420px] rounded-full bg-saffron/20 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHead
          kicker="از کجا شروع کنم؟"
          title={
            <>
              سه در، <span className="text-coral">یک مسیر</span>
            </>
          }
          desc="هر جا که هستی — اول راه، وسط برنامه‌ریزی، یا بعد از اعلام نتایج — درِ مربوط به خودت را باز کن."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* consulting tile */}
          <Reveal className="lg:col-span-3">
            <Link
              to="/consulting"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-ink bg-grid-dark text-paper p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard-saffron"
            >
              <span className="pointer-events-none absolute -top-16 -left-8 font-display text-[11rem] leading-none text-outline-paper select-none">
                ؟
              </span>
              <div className="relative">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron text-ink text-xs font-bold border border-ink">
                  <IcChat className="w-4 h-4" />
                  مشاوره و انتخاب رشته
                </span>
                <h3 className="font-display text-3xl md:text-4xl mt-5 leading-snug">
                  ۱۵۰ انتخاب را با <span className="text-saffron">داده</span> بچین، نه با حدس
                </h3>
                <ul className="mt-6 space-y-2.5">
                  {site.services.slice(0, 4).map((sv) => (
                    <li key={sv.id} className="flex items-center justify-between gap-4 text-sm font-semibold text-paper/80">
                      <span className="flex items-center gap-2.5">
                        <IcCheck className="w-4.5 h-4.5 text-teal shrink-0" />
                        {sv.title}
                      </span>
                      <span className="text-saffron whitespace-nowrap">{money(sv.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative mt-8 pt-6 border-t-2 border-dashed border-inkline flex items-center justify-between gap-4 flex-wrap">
                <span className="flex items-center gap-2.5 text-sm font-bold text-paper/75">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-coral border border-ink">
                    <IcClock className="w-4.5 h-4.5" />
                  </span>
                  تا {t.label}: {fa(t.days)} روز
                </span>
                <span className="inline-flex items-center gap-2 font-bold text-saffron group-hover:gap-3.5 transition-all duration-300">
                  رزرو مشاوره
                  <IcArrow className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="lg:col-span-2 grid gap-6">
            {/* classes tile */}
            <Reveal delay={120}>
              <Link
                to="/classes"
                className="group block rounded-2xl border-2 border-ink bg-card p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink text-paper text-xs font-bold">
                    <IcCap className="w-4 h-4" />
                    کلاس‌های این ترم
                  </span>
                  <span className="text-xs font-bold text-muted">{fa(site.classes.length)} کلاس فعال</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {site.classes.slice(0, 3).map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-3 group-hover:border-ink/30 transition-colors"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${DOT[c.accent] ?? "bg-teal"} shrink-0`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-bold text-sm text-ink truncate">{c.title}</span>
                        <span className="block text-[11px] text-muted font-semibold mt-0.5">
                          {c.teacher} • {c.schedule}
                        </span>
                      </span>
                      <span className="font-display text-base text-ink whitespace-nowrap">{money(c.price)}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-coral group-hover:gap-3.5 transition-all duration-300">
                  همهٔ کلاس‌ها
                  <IcArrow className="w-4.5 h-4.5" />
                </span>
              </Link>
            </Reveal>

            {/* shop tile */}
            <Reveal delay={220}>
              <Link
                to="/shop"
                className="group flex items-center justify-between gap-5 rounded-2xl border-2 border-ink bg-saffron p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard"
              >
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink text-paper text-xs font-bold">
                    <IcCart className="w-4 h-4" />
                    قفسهٔ منابع
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-ink mt-4 leading-snug">
                    جزوه، کتاب تست،
                    <br />
                    فلش‌کارت و آزمون
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink/80 group-hover:gap-3.5 transition-all duration-300">
                    رفتن به فروشگاه
                    <IcArrow className="w-4.5 h-4.5" />
                  </span>
                </div>
                <div className="flex items-end shrink-0" dir="ltr">
                  {site.products.slice(0, 4).map((p, i) => (
                    <span
                      key={p.id}
                      className="grid place-items-center w-14 h-20 md:w-16 md:h-24 border-2 border-ink rounded-lg font-display text-2xl text-paper shadow-hard-sm"
                      style={{
                        background: p.color,
                        transform: `rotate(${(i - 1.5) * 5}deg) translateY(${Math.abs(i - 1.5) * 6}px)`,
                        marginLeft: i > 0 ? "-10px" : 0,
                      }}
                    >
                      {p.initial}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Previews />
      <Teachers />
      <Testimonials />
    </>
  );
}
