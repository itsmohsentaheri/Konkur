import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

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
