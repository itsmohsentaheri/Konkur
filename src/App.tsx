import { useCallback, useEffect, useRef, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { SiteProvider } from "./store";
import { ActivityProvider, useActivity, type OrderItem } from "./activity";
import { IcCart } from "./icons";
import Home from "./pages/Home";
import ClassesPage from "./pages/ClassesPage";
import ConsultingPage from "./pages/ConsultingPage";
import ShopPage from "./pages/ShopPage";
import TeachersPage from "./pages/TeachersPage";
import ContactPage from "./pages/ContactPage";
import Admin from "./pages/Admin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Shell({ onAdd }: { onAdd: (item: OrderItem) => void }) {
  const location = useLocation();
  return (
    <main key={location.pathname} className="page-in">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/shop" element={<ShopPage onAdd={onAdd} />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function Inner() {
  const activity = useActivity();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const addToCart = useCallback(
    (item: OrderItem) => {
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
      <Nav cartCount={activity.cart.length} />
      <Shell onAdd={addToCart} />
      <Footer />
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
      <ActivityProvider>
        <HashRouter>
          <ScrollToTop />
          <Inner />
        </HashRouter>
      </ActivityProvider>
    </SiteProvider>
  );
}
