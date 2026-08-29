import CrossLinks from "../components/CrossLinks";
import { Teachers, Testimonials } from "../components/People";
import { PageHero, fa } from "../ui";
import { useSite } from "../store";

export default function TeachersPage() {
  const { site } = useSite();
  return (
    <>
      <PageHero
        crumb="اساتید"
        kicker="اساتید و قبولی‌ها"
        title={
          <>
            کسانی که خودشان <span className="text-saffron">از این مسیر</span> رد شده‌اند
          </>
        }
        desc="همهٔ اساتید رتبه‌شو، خودشان رتبه‌های برتر کنکور بوده‌اند؛ یعنی مسیری را که پیشنهاد می‌دهند، قدم‌به‌قدم پیموده‌اند."
        chip={`${fa(site.teachers.length)} استاد • ${fa(site.testimonials.length)} روایت قبولی`}
      />
      <Teachers />
      <Testimonials />
      <div className="pt-20 md:pt-24">
        <CrossLinks
          items={[
            {
              to: "/classes",
              title: "با این اساتید سر کلاس بنشین",
              desc: "برنامهٔ کلاس‌های ترم جدید همین حالا فعال است؛ ظرفیت‌ها محدودند.",
              tone: "ink",
            },
            {
              to: "/consulting",
              title: "مشاوره با تیم رتبه‌ساز",
              desc: "جلسهٔ اول رایگان است؛ نقشهٔ راهت را بگیر و بعد تصمیم بگیر.",
              tone: "saffron",
            },
          ]}
        />
      </div>
    </>
  );
}
