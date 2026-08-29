import Classes from "../components/Classes";
import CrossLinks from "../components/CrossLinks";
import { PageHero, fa } from "../ui";
import { Seo, jsonLd } from "../seo";
import { useSite } from "../store";

export default function ClassesPage() {
  const { site } = useSite();
  return (
    <>
      <Seo
        title="کلاس‌های آموزشی کنکور ۱۴۰۵ | رتبه‌شو"
        description="کلاس‌های تخصصی زیست، شیمی، ریاضی، فیزیک، ادبیات و عربی برای داوطلبان تجربی، ریاضی و انسانی با اساتید رتبه‌برتر کنکور."
        path="/classes"
        jsonLd={[jsonLd.breadcrumb([["خانه", "/"], ["کلاس‌ها", "/classes"]]), jsonLd.courses(site.classes)]}
      />
      <PageHero
        crumb="کلاس‌ها"
        kicker="کلاس‌های آموزشی"
        title={
          <>
            کلاسی که <span className="text-saffron">نقطهٔ عطف</span> می‌شه
          </>
        }
        desc="دروس تخصصی هر سه گروه آزمایشی با اساتید رتبه‌برتر؛ جلسات ضبط می‌شوند و جزوه‌ها قبل از کلاس در اختیارتان است."
        chip={`${fa(site.classes.length)} کلاس فعال • ثبت‌نام ترم جدید`}
      />
      <Classes />
      <CrossLinks
        items={[
          {
            to: "/consulting",
            title: "قبل از ثبت‌نام، مسیرت را ببین",
            desc: "یک جلسه مشاورهٔ رایگان تا مطمئن شوی این کلاس‌ها همان چیزی است که لازم داری.",
            tone: "ink",
          },
          {
            to: "/shop",
            title: "منابع و جزوه‌های مکمل",
            desc: "جزوه، کتاب تست و آزمون‌های شبیه‌ساز که کنار این کلاس‌ها معجزه می‌کنند.",
            tone: "saffron",
          },
        ]}
      />
    </>
  );
}
