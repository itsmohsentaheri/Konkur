import Consulting from "../components/Consulting";
import CrossLinks from "../components/CrossLinks";
import { PageHero, fa } from "../ui";
import { useSite } from "../store";

export default function ConsultingPage() {
  const { site } = useSite();
  return (
    <>
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
