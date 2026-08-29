import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { IcArrow, IcSpark } from "./icons";

/* ---------- persian digits & formatting ---------- */
const FA = "۰۱۲۳۴۵۶۷۸۹";
export const fa = (v: number | string): string =>
  String(v).replace(/\d/g, (d) => FA[+d]).replace(/,/g, "٬");

export const money = (n: number): string => fa(n.toLocaleString("en-US"));

/* ---------- reduced motion ---------- */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/* ---------- scroll reveal wrapper ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};
  return (
    <div ref={ref} id={id} className={`rv ${inView ? "in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---------- count-up number ---------- */
export function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setVal(target);
          return;
        }
        const start = performance.now();
        const dur = 1600;
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, reduced]);
  return (
    <span ref={ref}>
      {prefix}
      {fa(val.toLocaleString("en-US"))}
      {suffix}
    </span>
  );
}

/* ---------- countdown to the next Konkur ---------- */
const KONKUR_DATES = [
  { label: "آزمون سراسری ۱۴۰۵", at: new Date("2026-07-02T08:00:00+03:30") },
  { label: "آزمون سراسری ۱۴۰۶", at: new Date("2027-06-24T08:00:00+03:30") },
  { label: "آزمون سراسری ۱۴۰۷", at: new Date("2028-06-22T08:00:00+03:30") },
];

export function useCountdown() {
  const target = KONKUR_DATES.find((d) => d.at.getTime() > Date.now()) ?? KONKUR_DATES[KONKUR_DATES.length - 1];
  const calc = () => {
    const diff = Math.max(0, target.at.getTime() - Date.now());
    return {
      label: target.label,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

/* ---------- section heading ---------- */
export function SectionHead({
  kicker,
  title,
  desc,
  dark = false,
}: {
  kicker: string;
  title: ReactNode;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="max-w-2xl">
      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-block w-9 h-[3px] ${dark ? "bg-saffron" : "bg-coral"}`} />
        <span className={`text-sm font-bold tracking-wide ${dark ? "text-saffron" : "text-coral"}`}>{kicker}</span>
      </div>
      <h2
        className={`font-display text-4xl md:text-5xl leading-[1.15] ${dark ? "text-paper" : "text-ink"}`}
      >
        {title}
      </h2>
      {desc && <p className={`mt-4 text-base md:text-lg leading-8 ${dark ? "text-paper/70" : "text-muted"}`}>{desc}</p>}
    </Reveal>
  );
}

/* ---------- page header for sub-pages ---------- */
export function PageHero({
  crumb,
  kicker,
  title,
  desc,
  chip,
}: {
  crumb: string;
  kicker: string;
  title: ReactNode;
  desc?: string;
  chip?: string;
}) {
  return (
    <section className="relative bg-ink bg-grid-dark text-paper border-b-2 border-ink pt-[72px] overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-2 md:left-8 font-display text-[13rem] md:text-[18rem] leading-none text-outline-paper select-none"
      >
        {crumb.slice(0, 1)}
      </span>
      <div className="pointer-events-none absolute -top-28 -right-28 w-[380px] h-[380px] rounded-full bg-saffron/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 w-[260px] h-[260px] rounded-full bg-coral/10 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-9 pb-16 md:pt-12 md:pb-24">
        <Reveal>
          <nav aria-label="مسیر" className="flex items-center gap-2.5 text-xs font-bold text-paper/55">
            <Link to="/" className="hover:text-saffron transition-colors">
              خانه
            </Link>
            <IcArrow className="w-3.5 h-3.5" />
            <span className="text-paper/90">{crumb}</span>
          </nav>
        </Reveal>
        <div className="hero-line mt-7">
          <span style={{ animationDelay: "0.08s" }}>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-saffron/70 bg-ink2 text-saffron text-sm font-bold">
              <span className="pulse-dot w-2.5 h-2.5 rounded-full bg-saffron" />
              {kicker}
            </span>
          </span>
        </div>
        <h1 className="font-display text-[2.7rem] leading-[1.18] md:text-7xl md:leading-[1.15] mt-6 max-w-3xl">
          <span className="hero-line">
            <span style={{ animationDelay: "0.18s" }}>{title}</span>
          </span>
        </h1>
        {desc && (
          <Reveal delay={220} className="mt-5 max-w-2xl">
            <p className="text-base md:text-lg leading-8 text-paper/70">{desc}</p>
          </Reveal>
        )}
        {chip && (
          <Reveal delay={330} className="mt-8">
            <span className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-saffron text-ink border-2 border-ink shadow-hard-sm text-sm font-bold">
              <IcSpark className="w-5 h-5" />
              {chip}
            </span>
          </Reveal>
        )}
      </div>
      <div className="stripe-band h-3 border-t-2 border-ink" aria-hidden="true" />
    </section>
  );
}
