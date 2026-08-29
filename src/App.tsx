import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { SiteProvider } from "./store";
import { ActivityProvider, useActivity } from "./activity";
import { AuthProvider } from "./auth";
import { IcCart, IcPencil } from "./icons";

/**
 * کداسپلیتینگ سطح روت: هر صفحه در یک chunk جدا بیلد می‌شود
 * تا کاربر فقط کد همان صفحه‌ای که باز کرده را دانلود کند (مهم برای Core Web Vitals و سئو).
 */
const Home = lazy(() => import("./pages/Home"));
const ClassesPage = lazy(() => import("./pages/ClassesPage"));
const ConsultingPage = lazy(() => import("./pages/ConsultingPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const TeachersPage = lazy(() => import("./pages/TeachersPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Admin = lazy(() => import("./pages/Admin"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PageLoader() {
  return (
    <div className="min-h-[70vh] grid place-items-center bg-paper">
      <div className="text-center">
        <span className="relative inline-grid place-items-center w-16 h-16 rounded-2xl bg-saffron border-2 border-ink shadow-hard-sm">
          <IcPencil className="w-8 h-8 text-ink animate-pulse" />
          <span className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-coral border-2 border-ink pulse-dot" />
        </span>
        <p className="font-display text-2xl text-ink mt-5">در حال آوردن صفحه…</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

type AddItem = { title: string; price: number };

function Shell({ onAdd }: { onAdd: (item: AddItem) => void }) {
  const location = useLocation();
  return (
    <main key={location.pathname} className="page-in">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/consulting" element={<ConsultingPage />} />
          <Route path="/shop" element={<ShopPage onAdd={onAdd} />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
}

function Inner() {
  const activity = useActivity();
  const [toast, setToast] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const addToCart = useCallback(
    (item: AddItem) => {
      activity.addToCart(item);
      setToast(`«${item.title}» به سبد خرید اضافه شد`);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 2600);
    },
    [activity]
  );

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <div className="noise-layer" aria-hidden="true" />
      <Nav cartCount={activity.cartCount} onOpenCart={() => setCartOpen(true)} />
      <Shell onAdd={addToCart} />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
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

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <ActivityProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Inner />
          </BrowserRouter>
        </ActivityProvider>
      </AuthProvider>
    </SiteProvider>
  );
}
