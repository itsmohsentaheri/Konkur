import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../data";
import { fa } from "../ui";
import { IcCart, IcGear, IcGrid, IcMenu, IcUser, IcX, IcPencil } from "../icons";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="رتبه‌شو">
      <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-saffron border-2 border-ink shadow-hard-sm group-hover:-rotate-6 transition-transform duration-300">
        <IcPencil className="w-6 h-6 text-ink" />
        <span className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full bg-coral border-2 border-ink" />
      </span>
      <span className={`font-display text-3xl leading-none ${dark ? "text-paper" : "text-ink"}`}>
        رتبه<span className="text-coral">‌</span>شو
      </span>
    </Link>
  );
}

export default function Nav({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false);
  const [dash, setDash] = useState(false);
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

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative text-[15px] transition-colors after:absolute after:-bottom-1.5 after:right-0 after:h-[3px] after:bg-saffron after:transition-all after:duration-300 ${
      isActive ? "font-bold text-ink after:w-full" : "font-semibold text-ink/75 hover:text-ink hover:after:w-full"
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b-2 transition-all duration-300 ${
        scrolled ? "border-ink bg-paper/95 backdrop-blur-sm shadow-[0_4px_0_0_rgba(22,27,46,0.08)]" : "border-transparent bg-paper"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
        <Logo />
        <ul className="hidden lg:flex items-center gap-6 xl:gap-7">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="relative" onMouseEnter={() => setDash(true)} onMouseLeave={() => setDash(false)}>
            <button
              onClick={() => setDash((v) => !v)}
              aria-expanded={dash}
              className={`flex items-center gap-1.5 text-[15px] transition-colors ${dash ? "font-bold text-ink" : "font-semibold text-ink/75 hover:text-ink"}`}
            >
              <IcGrid className="w-4.5 h-4.5" />
              داشبوردها
              <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 transition-transform duration-300 ${dash ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={`absolute top-full right-0 pt-3 transition-all duration-300 ${dash ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
            >
              <div className="w-56 bg-card border-2 border-ink rounded-xl shadow-hard-sm overflow-hidden divide-y-2 divide-ink/10">
                <Link to="/dashboard/student" onClick={() => setDash(false)} className="flex items-center gap-3 px-4 py-3.5 hover:bg-saffron/40 transition-colors">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-saffron border-2 border-ink">
                    <IcUser className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink leading-tight">داشبورد دانش‌آموز</span>
                    <span className="block text-[10px] font-semibold text-muted mt-0.5">کلاس‌ها، سفارش‌ها و رزروها</span>
                  </span>
                </Link>
                <Link to="/dashboard/admin" onClick={() => setDash(false)} className="flex items-center gap-3 px-4 py-3.5 hover:bg-saffron/40 transition-colors">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-ink text-saffron border-2 border-ink">
                    <IcGear className="w-4.5 h-4.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink leading-tight">داشبورد ادمین</span>
                    <span className="block text-[10px] font-semibold text-muted mt-0.5">آمار، صندوق و وضعیت‌ها</span>
                  </span>
                </Link>
              </div>
            </div>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/student"
            aria-label="سبد خرید و داشبورد دانش‌آموز"
            className="relative grid place-items-center w-11 h-11 rounded-xl border-2 border-ink bg-card hover:bg-saffron hover:-translate-y-0.5 transition-all duration-300"
          >
            <IcCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 min-w-6 h-6 px-1 grid place-items-center rounded-full bg-coral text-paper text-xs font-bold border-2 border-ink toast-in">
                {fa(cartCount)}
              </span>
            )}
          </Link>
          <Link
            to="/consulting"
            className="hidden md:inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-ink text-paper font-bold text-[15px] border-2 border-ink hover:bg-coral hover:-translate-y-0.5 shadow-hard-sm transition-all duration-300"
          >
            رزرو مشاوره
          </Link>
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
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${open ? "max-h-[420px]" : "max-h-0"}`}>
        <ul className="px-4 pb-5 pt-2 space-y-1 bg-paper border-t-2 border-ink/10">
          <li>
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-saffron/50 font-bold text-ink" : "font-bold text-ink/85 hover:bg-saffron/40"}`
              }
            >
              خانه
            </NavLink>
          </li>
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-saffron/50 font-bold text-ink" : "font-bold text-ink/85 hover:bg-saffron/40"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/dashboard/student"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-ink bg-saffron text-ink font-bold text-sm"
            >
              <IcUser className="w-4.5 h-4.5" />
              داشبورد دانش‌آموز
            </Link>
            <Link
              to="/dashboard/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ink text-paper font-bold text-sm border-2 border-ink"
            >
              <IcGear className="w-4.5 h-4.5 text-saffron" />
              داشبورد ادمین
            </Link>
          </li>
          <li>
            <Link
              to="/consulting"
              onClick={() => setOpen(false)}
              className="block mt-2 text-center px-4 py-3 rounded-xl border-2 border-ink bg-card text-ink font-bold"
            >
              رزرو مشاوره
            </Link>
          </li>
        </ul>
      </div>
      {/* scroll progress */}
      <div className="absolute bottom-[-2px] right-0 h-[3px] bg-saffron transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </header>
  );
}
