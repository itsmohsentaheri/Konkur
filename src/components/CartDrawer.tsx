import { useState } from "react";
import { Link } from "react-router-dom";
import { useActivity } from "../activity";
import { useAuth } from "../auth";
import { fa, money } from "../ui";
import { IcArrow, IcCart, IcCheck, IcMinus, IcPlus, IcTrash, IcUser, IcX } from "../icons";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const activity = useActivity();
  const { user } = useAuth();
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const total = activity.cart.reduce((a, b) => a + b.price * b.qty, 0);

  const doCheckout = async () => {
    if (!user || activity.cart.length === 0 || busy) return;
    setBusy(true);
    const code = await activity.checkout(user.name);
    setBusy(false);
    setOrderCode(code);
  };

  const close = () => {
    setOrderCode(null);
    onClose();
  };

  return (
    <>
      {/* overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-ink/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      {/* panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[65] w-full max-w-md bg-paper border-r-2 border-ink flex flex-col transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="سبد خرید"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b-2 border-ink bg-saffron">
          <h2 className="flex items-center gap-3 font-display text-2xl text-ink">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink text-saffron border-2 border-ink">
              <IcCart className="w-5 h-5" />
            </span>
            سبد خرید
            {activity.cartCount > 0 && (
              <span className="text-sm font-body font-bold bg-ink text-paper rounded-full px-2.5 py-0.5">
                {fa(activity.cartCount)} قلم
              </span>
            )}
          </h2>
          <button
            onClick={close}
            aria-label="بستن سبد"
            className="grid place-items-center w-10 h-10 rounded-xl border-2 border-ink bg-card hover:bg-coral hover:-translate-y-0.5 transition-all duration-300"
          >
            <IcX className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {orderCode ? (
            <div className="text-center pt-10">
              <span className="toast-in grid place-items-center w-20 h-20 mx-auto rounded-2xl bg-teal text-paper border-2 border-ink shadow-hard-sm">
                <IcCheck className="w-10 h-10" />
              </span>
              <h3 className="font-display text-3xl text-ink mt-6">سفارشت ثبت شد!</h3>
              <p className="text-muted font-semibold mt-3 leading-8">
                کد پیگیری: <span className="font-display text-xl text-coral" dir="ltr">{fa(orderCode)}</span>
                <br />
                وضعیتش را از داشبوردت پیگیری کن.
              </p>
              <div className="mt-7 space-y-3">
                <Link
                  to="/dashboard/student"
                  onClick={close}
                  className="flex items-center justify-center gap-2 h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink hover:bg-coral transition-colors"
                >
                  رفتن به داشبورد
                  <IcArrow className="w-4.5 h-4.5" />
                </Link>
                <button onClick={close} className="w-full h-12 rounded-xl bg-card border-2 border-ink font-bold hover:bg-saffron/50 transition-colors">
                  ادامهٔ خرید
                </button>
              </div>
            </div>
          ) : activity.cart.length === 0 ? (
            <div className="text-center pt-14">
              <span className="grid place-items-center w-20 h-20 mx-auto rounded-2xl bg-card border-2 border-dashed border-ink/30 text-muted">
                <IcCart className="w-9 h-9" />
              </span>
              <h3 className="font-display text-2xl text-ink mt-5">سبدت خالیه!</h3>
              <p className="text-sm font-semibold text-muted mt-2 leading-7">جزوه، کتاب تست و منابع کنکوری منتظرتن.</p>
              <Link
                to="/shop"
                onClick={close}
                className="mt-6 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-saffron text-ink font-bold border-2 border-ink shadow-hard-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                دیدن محصولات
                <IcArrow className="w-4.5 h-4.5" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {activity.cart.map((item) => (
                <li key={item.title} className="bg-card border-2 border-ink rounded-2xl p-4 flex gap-4 items-center hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink leading-6 truncate">{item.title}</p>
                    <p className="font-display text-lg text-coral mt-1 leading-none">
                      {money(item.price)} <span className="text-[10px] font-body font-bold text-muted">تومان</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => activity.changeQty(item.title, -1)}
                      aria-label="کم کردن"
                      className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink bg-paper hover:bg-saffron transition-colors"
                    >
                      <IcMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-display text-lg text-ink">{fa(item.qty)}</span>
                    <button
                      onClick={() => activity.changeQty(item.title, 1)}
                      aria-label="زیاد کردن"
                      className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink bg-paper hover:bg-saffron transition-colors"
                    >
                      <IcPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => activity.removeFromCart(item.title)}
                    aria-label="حذف"
                    className="grid place-items-center w-8 h-8 rounded-lg border-2 border-ink/20 text-muted hover:border-coral hover:text-coral hover:bg-coral/10 transition-colors shrink-0"
                  >
                    <IcTrash className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!orderCode && activity.cart.length > 0 && (
          <footer className="border-t-2 border-ink bg-card px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-muted">جمع سبد</span>
              <span className="font-display text-2xl text-ink leading-none">
                {money(total)} <span className="text-xs font-body font-bold text-muted">تومان</span>
              </span>
            </div>
            {user ? (
              <button
                onClick={doCheckout}
                className="w-full h-14 rounded-xl bg-ink text-paper font-bold text-lg border-2 border-ink shadow-hard-saffron hover:-translate-y-1 transition-all duration-300"
              >
                تسویه‌حساب به نام {user.name}
              </button>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-coral">برای ثبت سفارش اول وارد حسابت شو.</p>
                <Link
                  to="/auth"
                  onClick={close}
                  className="flex items-center justify-center gap-2 h-13 py-3.5 rounded-xl bg-ink text-paper font-bold border-2 border-ink hover:bg-coral transition-colors"
                >
                  <IcUser className="w-5 h-5" />
                  ورود / ثبت‌نام
                </Link>
              </div>
            )}
          </footer>
        )}
      </aside>
    </>
  );
}
