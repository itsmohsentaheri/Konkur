import { useEffect } from "react";
import type { ClassItem, Faq, Product, Service } from "./data";

/**
 * ═══════════════ بستهٔ سئوی رتبه‌شو ═══════════════
 * هر صفحه با <Seo /> عنوان، توضیحات، canonical، Open Graph و
 * دادهٔ ساختاریافتهٔ JSON-LD مخصوص خودش را تزریق می‌کند.
 * در مهاجرت به SSR (مثلاً Next.js) همین داده‌ها سمت سرور رندر می‌شوند.
 */
export const ORIGIN = "https://ratbesho.ir";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: object | object[];
};

export function Seo({ title, description, path, noindex = false, jsonLd }: SeoProps) {
  useEffect(() => {
    const url = ORIGIN + path;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("property", "og:site_name", "رتبه‌شو");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "fa_IR");
    upsertMeta("property", "og:image", `${ORIGIN}/og-cover.jpg`);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertCanonical(url);
  }, [title, description, path, noindex]);

  if (!jsonLd) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── سازنده‌های JSON-LD (schema.org) ── */
export const jsonLd = {
  breadcrumb: (items: [string, string][]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: ORIGIN + path,
    })),
  }),

  courses: (classes: ClassItem[]) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "کلاس‌های آموزشی کنکور رتبه‌شو",
    itemListElement: classes.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.title,
        description: `${c.teacher} — ${c.schedule} — ${c.sessions} جلسه ${c.mode}`,
        provider: { "@type": "Organization", name: "رتبه‌شو", sameAs: ORIGIN },
        offers: { "@type": "Offer", price: c.price, priceCurrency: "IRR" },
      },
    })),
  }),

  products: (products: Product[]) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محصولات کنکوری رتبه‌شو",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.title,
        description: p.meta,
        aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.sold },
        offers: { "@type": "Offer", price: p.price, priceCurrency: "IRR", availability: "https://schema.org/InStock" },
      },
    })),
  }),

  services: (services: Service[]) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "خدمات مشاوره و انتخاب رشته رتبه‌شو",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: `${s.duration} — ${s.features.join("؛ ")}`,
        provider: { "@type": "Organization", name: "رتبه‌شو", sameAs: ORIGIN },
        offers: { "@type": "Offer", price: s.price, priceCurrency: "IRR" },
      },
    })),
  }),

  faqs: (faqs: Faq[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }),
};
