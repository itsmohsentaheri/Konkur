import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type { SiteData } from "./data";

/**
 * Provider محتوای سایت (CMS)
 * خواندن و نوشتن فقط از طریق api — هیچ دسترسی مستقیمی به storage نیست.
 */
type Store = {
  site: SiteData;
  set: <K extends keyof SiteData>(key: K, value: SiteData[K]) => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteData>(() => api.content.get());

  useEffect(() => {
    void api.content.save(site);
  }, [site]);

  const set = <K extends keyof SiteData>(key: K, value: SiteData[K]) =>
    setSite((s) => ({ ...s, [key]: value }));

  const reset = () => {
    void api.content.reset();
    setSite(api.content.get());
  };

  return <Ctx.Provider value={{ site, set, reset }}>{children}</Ctx.Provider>;
}

export function useSite(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
