import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SITE, type SiteData } from "./data";

const KEY = "ratbesho-site-v1";

type Store = {
  site: SiteData;
  set: <K extends keyof SiteData>(key: K, value: SiteData[K]) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);

function load(): SiteData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SITE;
    const saved = JSON.parse(raw) as Partial<SiteData>;
    return {
      ...DEFAULT_SITE,
      ...saved,
      settings: { ...DEFAULT_SITE.settings, ...(saved.settings ?? {}) },
    };
  } catch {
    return DEFAULT_SITE;
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteData>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(site));
    } catch {
      /* storage unavailable */
    }
  }, [site]);

  const set = <K extends keyof SiteData>(key: K, value: SiteData[K]) =>
    setSite((s) => ({ ...s, [key]: value }));

  const reset = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
    setSite(DEFAULT_SITE);
  };

  return <Ctx.Provider value={{ site, set, reset }}>{children}</Ctx.Provider>;
}

export function useSite(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
