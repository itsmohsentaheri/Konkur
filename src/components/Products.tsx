import { useMemo, useState } from "react";
import { PRODUCT_FILTERS } from "../data";
import { useSite } from "../store";
import { Reveal, SectionHead, fa, money } from "../ui";
import { IcBook, IcCart, IcHeadset, IcPlus, IcShield, IcStar, IcTruck, IcUsers } from "../icons";

export default function Products({ onAdd }: { onAdd: (name: string) => void }) {
  const { site } = useSite();
  const [filter, setFilter] = useState("همه");
  const list = useMemo(
    () => (filter === "همه" ? site.products : site.products.filter((p) => p.type === filter)),
    [filter, site.products]
  );

  return (
    <section id="shop" className="relative bg-paper py-20 md:py-28 scroll-mt-20 overflow-hidden">
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-coral/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:items-end">
          <SectionHead
            kicker="محصولات کنکوری"
            title={
              <>
                مهماتِ <span className="text-coral">شبِ آزمون</span>
              </>
            }
            desc="جزوه، کتاب تست، فلش‌کارت و آزمون‌های شبیه‌ساز — همه با آخرین تغییرات کنکور ۱۴۰۵ ویرایش شده‌اند و آپدیت دیجیتال رایگان دارند."
          />
          <Reveal delay={150} className="flex flex-wrap gap-2">
            {PRODUCT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-10 px-4 rounded-full border-2 border-ink text-sm font-bold transition-all duration-300 ${
                  filter === f
                    ? "bg-coral text-paper shadow-hard-sm -translate-y-0.5"
                    : "bg-card text-ink hover:bg-saffron/50 hover:-translate-y-0.5"
                }`}
              >
                {f}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p, i) => (
            <Reveal key={`${filter}-${p.id}`} delay={(i % 4) * 100}>
              <article className="group h-full bg-card border-2 border-ink rounded-2xl overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-hard transition-all duration-400">
                {/* css cover */}
                <div className="relative h-44 overflow-hidden border-b-2 border-ink" style={{ background: p.color }}>
                  <div
                    className="absolute inset-0 opacity-[0.14]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(-45deg, transparent 0 14px, #f4f6f9 14px 16px)",
                    }}
                  />
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-ink/85 text-paper text-[11px] font-bold">
                    {p.type}
                  </span>
                  {p.badge && (
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-saffron text-ink text-[11px] font-bold border border-ink">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute -bottom-7 -left-4 font-display text-[8.5rem] leading-none text-paper/25 group-hover:text-paper/40 group-hover:-rotate-6 transition-all duration-500">
                    {p.initial}
                  </span>
                  <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 text-paper/90 text-xs font-bold">
                    <IcBook className="w-4 h-4" />
                    {p.meta.split("•")[0].trim()}
                  </div>
                </div>
                {/* body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-xl leading-snug text-ink group-hover:text-coral transition-colors duration-300">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2.5 text-xs font-bold text-muted">
                    <span className="inline-flex items-center gap-1 text-saffrondeep">
                      <IcStar className="w-3.5 h-3.5" />
                      {fa(p.rating)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IcUsers className="w-3.5 h-3.5" />
                      {fa(p.sold.toLocaleString("en-US"))} فروش
                    </span>
                  </div>
                  <div className="pt-4 border-t-2 border-dashed border-ink/15 flex items-center justify-between gap-2 mt-auto">
                    <div>
                      {p.oldPrice && <p className="text-[11px] text-muted line-through font-medium">{money(p.oldPrice)}</p>}
                      <p className="font-display text-xl text-ink leading-none">
                        {money(p.price)} <span className="text-[10px] font-body font-bold text-muted">تومان</span>
                      </p>
                    </div>
                    <button
                      onClick={() => onAdd(p.title)}
                      aria-label={`افزودن ${p.title} به سبد`}
                      className="grid place-items-center w-11 h-11 rounded-xl bg-ink text-paper border-2 border-ink hover:bg-coral hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      <IcPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* guarantee strip */}
        <Reveal delay={150} className="mt-14">
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-0 bg-ink border-2 border-ink rounded-2xl overflow-hidden divide-y-2 md:divide-y-0 md:divide-x-2 divide-inkline">
            {[
              { icon: <IcShield className="w-7 h-7" />, t: "ضمانت بازگشت ۷ روزه", d: "اگر راضی نبودی، بدون سوال پولت برمی‌گردد" },
              { icon: <IcTruck className="w-7 h-7" />, t: "ارسال فوری", d: "نسخه دیجیتال بلافاصله، چاپی تا ۴۸ ساعت" },
              { icon: <IcHeadset className="w-7 h-7" />, t: "پشتیبانی ۲۴/۷", d: "تیم پشتیبانی حتی شب‌های آزمون بیدار است" },
            ].map((g, i) => (
              <div key={g.t} className="flex items-center gap-4 px-7 py-5 flex-1 hover:bg-ink2 transition-colors duration-300 group">
                <span className="grid place-items-center w-13 h-13 p-3 rounded-xl bg-saffron text-ink border-2 border-inkline shrink-0 group-hover:-rotate-6 transition-transform duration-300">
                  {g.icon}
                </span>
                <div>
                  <p className="font-display text-lg text-paper leading-tight">
                    {fa(i + 1)}. {g.t}
                  </p>
                  <p className="text-xs text-paper/60 font-semibold mt-1">{g.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <a
            href="#consulting"
            className="inline-flex items-center gap-2.5 h-13 px-7 py-3 rounded-xl bg-card border-2 border-ink font-bold text-ink hover:bg-saffron hover:-translate-y-0.5 transition-all duration-300"
          >
            <IcCart className="w-5 h-5" />
            نمی‌دانی کدام منابع برای تو مناسب است؟ مشاورهٔ رایگان بگیر
          </a>
        </Reveal>
      </div>
    </section>
  );
}
