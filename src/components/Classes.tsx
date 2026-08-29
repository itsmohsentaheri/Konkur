import { useMemo, useState } from "react";
import { CLASSES, CLASS_FILTERS } from "../data";
import { Reveal, SectionHead, fa, money } from "../ui";
import { IcCalendar, IcCap, IcClock, IcFlame, IcStar, IcUsers, IcVideo, IcArrow } from "../icons";

const ACCENTS: Record<string, string> = {
  saffron: "bg-saffron",
  coral: "bg-coral",
  teal: "bg-teal",
  ink: "bg-ink",
};

export default function Classes() {
  const [filter, setFilter] = useState<(typeof CLASS_FILTERS)[number]>("همه");
  const list = useMemo(() => (filter === "همه" ? CLASSES : CLASSES.filter((c) => c.group === filter)), [filter]);

  return (
    <section id="classes" className="relative bg-paper py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <SectionHead
            kicker="کلاس‌های آموزشی"
            title={
              <>
                کلاسی که <span className="text-coral">نقطهٔ عطف</span> می‌شه
              </>
            }
            desc="دروس تخصصی هر سه گروه آزمایشی، با اساتید رتبه‌برتر و پشتیبانی تا شب آزمون. جلسات ضبط می‌شوند و جزوه‌ها قبل از کلاس در اختیارتان است."
          />
          <Reveal delay={150} className="flex flex-wrap gap-2.5">
            {CLASS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-11 px-5 rounded-xl border-2 border-ink font-bold text-sm transition-all duration-300 ${
                  filter === f
                    ? "bg-ink text-paper shadow-hard-sm -translate-y-0.5"
                    : "bg-card text-ink hover:bg-saffron/50 hover:-translate-y-0.5"
                }`}
              >
                {f}
                {f !== "همه" && (
                  <span className={`mr-2 text-xs ${filter === f ? "text-saffron" : "text-muted"}`}>
                    {fa(CLASSES.filter((c) => c.group === f).length)}
                  </span>
                )}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {list.map((c, i) => (
            <Reveal key={`${filter}-${c.id}`} delay={(i % 3) * 120}>
              <article className="group relative h-full bg-card border-2 border-ink rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-hard transition-all duration-400">
                <div className={`h-2.5 ${ACCENTS[c.accent]}`} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-ink/15 text-xs font-bold text-ink/70">
                      <IcCap className="w-4 h-4" />
                      {c.group} • {fa(c.sessions)} جلسه
                    </span>
                    {c.badge ? (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-paper ${
                          c.badge === "پرطرفدار" || c.badge === "ظرفیت محدود" ? "bg-coral" : "bg-teal"
                        }`}
                      >
                        <IcFlame className="w-3.5 h-3.5" />
                        {c.badge}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-saffrondeep font-bold text-sm">
                        <IcStar className="w-4 h-4" />
                        {fa(c.rating)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl md:text-[1.7rem] text-ink mt-4 leading-snug group-hover:text-coral transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="text-sm font-semibold text-muted mt-1.5">{c.teacher}</p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px] font-semibold text-ink/70">
                    <span className="inline-flex items-center gap-1.5">
                      <IcCalendar className="w-4 h-4 text-teal" />
                      {c.schedule}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IcVideo className="w-4 h-4 text-teal" />
                      {c.mode}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IcClock className="w-4 h-4 text-teal" />
                      {fa(c.hours)} ساعت
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-muted">
                        <IcUsers className="w-4 h-4" />
                        {fa(c.students.toLocaleString("en-US"))} دانش‌آموز
                      </span>
                      <span className={c.capacity >= 85 ? "text-coral" : "text-tealdark"}>
                        تکمیل ظرفیت: {fa(`${c.capacity}٪`)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-paper border border-ink/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.capacity >= 85 ? "bg-coral" : "bg-teal"} transition-[width] duration-1000`}
                        style={{ width: `${c.capacity}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t-2 border-dashed border-ink/15 flex items-center justify-between gap-3 mt-auto">
                    <div>
                      {c.oldPrice && (
                        <p className="text-xs text-muted line-through font-medium">{money(c.oldPrice)}</p>
                      )}
                      <p className="font-display text-2xl text-ink leading-none">
                        {money(c.price)} <span className="text-xs font-body font-bold text-muted">تومان</span>
                      </p>
                    </div>
                    <a
                      href="#consulting"
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-ink text-paper text-sm font-bold border-2 border-ink group-hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
                    >
                      ثبت‌نام
                      <IcArrow className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="text-muted font-semibold">
            دنبال درس خاصی می‌گردی؟{" "}
            <a href="#consulting" className="text-coral font-bold underline decoration-2 underline-offset-4 hover:text-ink transition-colors">
              با مشاورهامون صحبت کن
            </a>{" "}
            تا بهترین ترکیب کلاس را برایت بچینند.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
