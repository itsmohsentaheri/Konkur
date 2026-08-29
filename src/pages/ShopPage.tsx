import Products from "../components/Products";
import CrossLinks from "../components/CrossLinks";
import { PageHero, fa } from "../ui";
import { useSite } from "../store";

export default function ShopPage({ onAdd }: { onAdd: (item: { title: string; price: number }) => void }) {
  const { site } = useSite();
  return (
    <>
      <PageHero
        crumb="فروشگاه"
        kicker="محصولات کنکوری"
        title={
          <>
            مهماتِ <span className="text-saffron">شبِ آزمون</span>
          </>
        }
        desc="جزوه، کتاب تست، فلش‌کارت و آزمون‌های شبیه‌ساز — همه با آخرین تغییرات کنکور ویرایش شده‌اند و آپدیت دیجیتال رایگان دارند."
        chip={`${fa(site.products.length)} محصول • ضمانت بازگشت ۷ روزه`}
      />
      <Products onAdd={onAdd} />
      <CrossLinks
        items={[
          {
            to: "/consulting",
            title: "نمی‌دانی کدام منبع برای توست؟",
            desc: "در یک جلسهٔ مشاورهٔ کوتاه، لیست منابع اختصاصی‌ات را بگیر.",
            tone: "ink",
          },
          {
            to: "/classes",
            title: "کلاس‌هایی که این منابع را زنده می‌کنند",
            desc: "با تدریس اساتید رتبه‌برتر، هر صفحهٔ جزوه معنا پیدا می‌کند.",
            tone: "saffron",
          },
        ]}
      />
    </>
  );
}
