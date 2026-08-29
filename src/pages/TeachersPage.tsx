import CrossLinks from "../components/CrossLinks";
import { Teachers, Testimonials } from "../components/People";
import { PageHero, fa } from "../ui";
import { useSite } from "../store";
import { Seo, jsonLd } from "../seo";

export default function TeachersPage() {
  const { site } = useSite();
  return (
    <>
      <Seo
        title="اساتید رتبه‌برتر کنکور و روایت قبولی‌ها | رتبه‌شو"
        description="آشنایی با اساتید رتبه‌شو؛ کسانی که خودشان رتبه‌های برتر کنکور بوده‌اند و مسیر قبولی را قدم‌به‌قدم پیموده‌اند."
        path="/teachers"
        jsonLd={jsonLd.breadcrumb([["خانه", "/"], ["اساتید و قبولی‌ها", "/teachers"]])}
      />
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
