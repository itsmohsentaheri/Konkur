import { useState } from "react";
import { FAQS } from "../data";
import { Reveal, SectionHead, fa } from "../ui";
import { IcChat, IcPhone, IcTelegram, IcWhatsapp } from "../icons";

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="relative bg-paper py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead
            kicker="سوالات متداول"
            title={
              <>
                چیزی هست که <span className="text-coral">نپرسیده باشی؟</span>
              </>
            }
            desc="پرتکرارترین سوالات داوطلبان و والدینشان را اینجا جمع کرده‌ایم. اگر جوابت را پیدا نکردی، یک پیام کافی است."
          />
          <Reveal delay={200} className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:02191002405"
              className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl bg-ink text-paper font-bold text-sm border-2 border-ink hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
            >
              <IcPhone className="w-4.5 h-4.5" />
              {fa("021-9100-2405")}
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl bg-card text-ink font-bold text-sm border-2 border-ink hover:bg-saffron/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <IcWhatsapp className="w-4.5 h-4.5 text-teal" />
              واتس‌اپ
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 h-12 px-5 rounded-xl bg-card text-ink font-bold text-sm border-2 border-ink hover:bg-saffron/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <IcTelegram className="w-4.5 h-4.5 text-teal" />
              تلگرام
            </a>
          </Reveal>
        </div>

        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={(i % 3) * 90}>
                <div
                  className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-ink bg-card shadow-hard-sm" : "border-ink/15 bg-card hover:border-ink/40"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-right px-6 py-5"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`font-display text-xl w-8 text-center shrink-0 ${isOpen ? "text-coral" : "text-muted"}`}
                      >
                        {fa(i + 1)}.
                      </span>
                      <span className="font-bold text-[15px] md:text-base text-ink leading-7">{f.q}</span>
                    </span>
                    <span
                      className={`relative grid place-items-center w-9 h-9 rounded-xl border-2 border-ink shrink-0 transition-all duration-400 ${
                        isOpen ? "bg-coral rotate-45" : "bg-saffron"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className={`acc-body ${isOpen ? "open" : ""}`}>
                    <div>
                      <p className="px-6 pb-6 pr-[4.5rem] text-[15px] leading-8 text-muted font-medium flex items-start gap-3">
                        <IcChat className="w-5 h-5 text-teal shrink-0 mt-1.5" />
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
