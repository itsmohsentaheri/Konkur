import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data";
import { fa } from "../ui";
import { IcCart, IcMenu, IcX, IcPencil } from "../icons";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5 group" aria-label="رتبه‌شو">
      <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-saffron border-2 border-ink shadow-hard-sm group-hover:-rotate-6 transition-transform duration-300">
        <IcPencil className="w-6 h-6 text-ink" />
        <span className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full bg-coral border-2 border-ink" />
      </span>
      <span className={`font-display text-3xl leading-none ${dark ? "text-paper" : "text-ink"}`}>
        رتبه<span className="text-coral">‌</span>شو
      </span>
    </a>
  );
}

export default function Nav({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b-2 transition-all duration-300 ${
        scrolled ? "border-ink bg-paper/95 backdrop-blur-sm shadow-[0_4px_0_0_rgba(22,27,46,0.08)]" : "border-transparent bg-paper"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo />
        <ul className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-[15px] font-semibold text-ink/80 hover:text-ink transition-colors after:absolute after:-bottom-1.5 after:right-0 after:h-[3px] after:w-0 after:bg-saffron after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href="#shop"
            aria-label="سبد خرید"
            className="relative grid place-items-center w-11 h-11 rounded-xl border-2 border-ink bg-card hover:bg-saffron hover:-translate-y-0.5 transition-all duration-300"
          >
            <IcCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 min-w-6 h-6 px-1 grid place-items-center rounded-full bg-coral text-paper text-xs font-bold border-2 border-ink toast-in">
                {fa(cartCount)}
              </span>
            )}
          </a>
          <a
            href="#consulting"
            className="hidden md:inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-ink text-paper font-bold text-[15px] border-2 border-ink hover:bg-coral hover:border-ink hover:-translate-y-0.5 shadow-hard-sm transition-all duration-300"
          >
            رزرو مشاوره
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="منو"
            className="lg:hidden grid place-items-center w-11 h-11 rounded-xl border-2 border-ink bg-card hover:bg-saffron transition-colors"
          >
            {open ? <IcX className="w-6 h-6" /> : <IcMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      {/* mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${open ? "max-h-96" : "max-h-0"}`}>
        <ul className="px-4 pb-5 pt-2 space-y-1 bg-paper border-t-2 border-ink/10">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg font-bold text-ink/85 hover:bg-saffron/40 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#consulting"
              onClick={() => setOpen(false)}
              className="block mt-2 text-center px-4 py-3 rounded-xl bg-ink text-paper font-bold"
            >
              رزرو مشاوره
            </a>
          </li>
        </ul>
      </div>
      {/* scroll progress */}
      <div className="absolute bottom-[-2px] right-0 h-[3px] bg-saffron transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </header>
  );
}
