import { useState, type FormEvent } from "react";
import { NAV_LINKS } from "../data";
import { fa } from "../ui";
import { Logo } from "./Nav";
import {
  IcArrow,
  IcCheck,
  IcInstagram,
  IcMail,
  IcPhone,
  IcPin,
  IcTelegram,
  IcWhatsapp,
  IcYoutube,
} from "../icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "ok" | "err">("idle");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^09\d{9}$/.test(email.trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubState("err");
      return;
    }
    setSubState("ok");
  };

  return (
    <footer className="bg-ink bg-grid-dark text-paper border-t-2 border-ink">
      {/* CTA band */}
      <div className="border-b border-inkline">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              آماده‌ای <span className="text-saffron">مسیرت</span> را شروع کنی؟
            </h2>
            <p className="text-paper/60 font-semibold mt-2">
              همین امروز یک جلسه مشاورهٔ رایگان بگیر و نقشهٔ راهت را ببین.
            </p>
          </div>
          <a
            href="#consulting"
            className="group inline-flex items-center gap-3 h-14 px-8 rounded-xl bg-saffron text-ink font-bold text-lg border-2 border-ink shadow-hard-sm hover:-translate-y-1 transition-all duration-300 shrink-0"
          >
            شروع با مشاوره رایگان
            <IcArrow className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] gap-10">
        <div>
          <Logo dark />
          <p className="mt-5 text-sm leading-8 text-paper/65 font-medium max-w-xs">
            تیم تخصصی مشاوره، کلاس و منابع کنکور. از اولین جلسهٔ مطالعه تا لحظهٔ ثبت انتخاب رشته، کنارتیم.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: <IcInstagram className="w-5 h-5" />, label: "اینستاگرام", href: "#top" },
              { icon: <IcTelegram className="w-5 h-5" />, label: "تلگرام", href: "#top" },
              { icon: <IcYoutube className="w-5 h-5" />, label: "یوتیوب", href: "#top" },
              { icon: <IcWhatsapp className="w-5 h-5" />, label: "واتس‌اپ", href: "#top" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid place-items-center w-11 h-11 rounded-xl border-2 border-inkline bg-ink2 hover:bg-saffron hover:text-ink hover:border-ink hover:-translate-y-1 transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="دسترسی سریع">
          <h3 className="font-display text-xl text-saffron">دسترسی سریع</h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-paper/70 hover:text-saffron transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-coral group-hover:w-4 transition-all duration-300" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="خدمات">
          <h3 className="font-display text-xl text-saffron">خدمات ما</h3>
          <ul className="mt-5 space-y-3 text-sm font-semibold text-paper/70">
            {[
              "مشاوره انتخاب رشته",
              "برنامه‌ریزی هفتگی",
              "تحلیل کارنامه",
              "کلاس‌های گروهی",
              "آزمون‌های شبیه‌ساز",
            ].map((s) => (
              <li key={s}>
                <a href="#consulting" className="group inline-flex items-center gap-2 hover:text-saffron transition-colors">
                  <span className="w-2 h-2 rounded-full bg-teal group-hover:w-4 transition-all duration-300" />
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-display text-xl text-saffron">در تماس باشیم</h3>
          <ul className="mt-5 space-y-3.5 text-sm font-semibold text-paper/70">
            <li className="flex items-start gap-3">
              <IcPin className="w-5 h-5 text-coral shrink-0 mt-0.5" />
              تهران، ونک، خیابان ملاصدرا، مجتمع آموزشی رتبه‌شو، طبقه ۳
            </li>
            <li className="flex items-center gap-3">
              <IcPhone className="w-5 h-5 text-coral shrink-0" />
              <a href="tel:02191002405" dir="ltr" className="hover:text-saffron transition-colors">
                {fa("021-9100-2405")}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <IcMail className="w-5 h-5 text-coral shrink-0" />
              <a href="mailto:hello@ratbesho.ir" dir="ltr" className="hover:text-saffron transition-colors">
                hello@ratbesho.ir
              </a>
            </li>
          </ul>
          <form onSubmit={subscribe} className="mt-6" noValidate>
            <p className="text-xs font-bold text-paper/50 mb-2">عضویت در کانال اطلاع‌رسانی تخفیف‌ها و آزمون‌ها:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubState("idle");
                }}
                placeholder="موبایل یا ایمیل"
                className="flex-1 min-w-0 h-12 px-4 rounded-xl bg-ink2 border-2 border-inkline text-sm font-semibold text-paper placeholder:text-paper/35 outline-none focus:border-saffron transition-colors"
              />
              <button
                type="submit"
                className="grid place-items-center w-12 h-12 rounded-xl bg-saffron text-ink border-2 border-ink hover:bg-coral hover:text-paper transition-colors shrink-0"
                aria-label="عضویت"
              >
                {subState === "ok" ? <IcCheck className="w-5 h-5" /> : <IcArrow className="w-5 h-5" />}
              </button>
            </div>
            {subState === "ok" && (
              <p className="toast-in text-xs font-bold text-teal mt-2">عضو شدی! اولین تخفیف همین هفته می‌رسد.</p>
            )}
            {subState === "err" && (
              <p className="text-xs font-bold text-coral mt-2">یک شماره موبایل یا ایمیل معتبر وارد کن.</p>
            )}
          </form>
        </div>
      </div>

      <div className="border-t border-inkline">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-paper/45">
          <p>© {fa(1405)} رتبه‌شو — تمام حقوق محفوظ است.</p>
          <p>
            ساخته‌شده با <span className="text-coral">♥</span> برای داوطلبانی که جدی‌اند
          </p>
        </div>
      </div>
    </footer>
  );
}
