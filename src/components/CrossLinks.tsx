import { Link } from "react-router-dom";
import { Reveal } from "../ui";
import { IcArrow } from "../icons";

export default function CrossLinks({
  items,
}: {
  items: { to: string; title: string; desc: string; tone: "ink" | "saffron" }[];
}) {
  return (
    <section className="bg-paper pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <Reveal key={it.to} delay={i * 120}>
            <Link
              to={it.to}
              className={`group flex items-center justify-between gap-6 rounded-2xl border-2 border-ink p-7 md:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hard ${
                it.tone === "ink" ? "bg-ink text-paper" : "bg-saffron text-ink"
              }`}
            >
              <div>
                <h3 className="font-display text-2xl md:text-3xl leading-snug">{it.title}</h3>
                <p className={`text-sm font-semibold mt-2.5 leading-7 ${it.tone === "ink" ? "text-paper/65" : "text-ink/70"}`}>
                  {it.desc}
                </p>
              </div>
              <span
                className={`grid place-items-center w-12 h-12 rounded-xl border-2 border-ink shrink-0 group-hover:-translate-x-1.5 transition-transform duration-300 ${
                  it.tone === "ink" ? "bg-saffron text-ink" : "bg-ink text-paper"
                }`}
              >
                <IcArrow className="w-5 h-5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
