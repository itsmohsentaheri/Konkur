import Consulting from "../components/Consulting";
import CrossLinks from "../components/CrossLinks";
import { PageHero, fa } from "../ui";
import { Seo, jsonLd } from "../seo";
import { useSite } from "../store";

export default function ConsultingPage() {
  const { site } = useSite();
  return (
    <>
      <Seo
        title="مشاوره کنکور و انتخاب رشته تخصصی | رتبه‌شو"
        description="مشاوره خصوصی انتخاب رشته، تحلیل کارنامه و تراز، برنامه‌ریزی مطالعه و پکیج همراهی کامل تا اعلام نتایج — جلسه اول رایگان."
        path="/consulting"
        jsonLd={[jsonLd.breadcrumb([["خانه", "/"], ["مشاوره و انتخاب رشته", "/consulting"]]), jsonLd.services(site.services)]}
      />
      <PageHero
        crumb="مشاوره"
        kicker="مشاوره و انتخاب رشته"
        title={
          <>
            ۱۵۰ انتخاب، <span className="text-saffron">صفر</span> استرس
          </>
        }
        desc="انتخاب رشته یعنی بازی با داده: ظرفیت‌ها، ترازها، بومی‌گزینی و علاقهٔ خودت. ما تک‌تک انتخاب‌ها را با منطق می‌چینیم."
        chip={`${fa(site.services.length)} خدمت فعال • جلسهٔ اول رایگان`}
      />
      <Consulting />
      <div className="pt-20 md:pt-24">
        <CrossLinks
          items={[
            {
              to: "/classes",
              title: "کلاس‌های تخصصی گروه‌ها",
              desc: "زیست، شیمی، ریاضی و فیزیک با اساتیدی که خودشان رتبهٔ برتر بوده‌اند.",
              tone: "ink",
            },
            {
              to: "/shop",
              title: "منابعی که مشاوره‌ات را کامل می‌کند",
              desc: "جزوه‌های طلایی و بانک‌های تستی که در جلسات مشاوره پیشنهاد می‌شوند.",
              tone: "saffron",
            },
          ]}
        />
      </div>
    </>
  );
}
