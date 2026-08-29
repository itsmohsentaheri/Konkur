import { useCallback, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Classes from "./components/Classes";
import Consulting from "./components/Consulting";
import Products from "./components/Products";
import { Teachers, Testimonials } from "./components/People";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { IcCart } from "./icons";

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const addToCart = useCallback((name: string) => {
    setCartCount((c) => c + 1);
    setToast(`«${name}» به سبد خرید اضافه شد`);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <div className="noise-layer" aria-hidden="true" />
      <Nav cartCount={cartCount} />
      <main>
        <Hero />
        <Classes />
        <Consulting />
        <Products onAdd={addToCart} />
        <Teachers />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 inset-x-0 z-[80] flex justify-center px-4 pointer-events-none">
          <div className="toast-in flex items-center gap-3 bg-ink text-paper pl-5 pr-4 py-3.5 rounded-xl border-2 border-saffron shadow-hard-sm font-bold text-sm">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-saffron text-ink">
              <IcCart className="w-5 h-5" />
            </span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
