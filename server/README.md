# رتبه‌شو — بک‌اند (Node.js + Express + SQLite)

API سرور سایت رتبه‌شو. فرانت‌اند (React) از طریق لایهٔ `src/api/client.ts` به این سرور وصل می‌شود.

## راه‌اندازی

```bash
cd server
npm install
npm start        # یا برای توسعه با hot-reload:
npm run dev
```

سرور روی `http://localhost:4000` اجرا می‌شود. برای تست:

```
http://localhost:4000/api/v1/health
```

## وصل کردن فرانت‌اند

در ریشهٔ پروژه:

```bash
cp .env.example .env
# مطمئن شو این خط هست:
#   VITE_API_BASE_URL=http://localhost:4000/api/v1
npm run dev
```

اگر `.env` وجود نداشته باشد، سایت در **حالت دمو** (localStorage) اجرا می‌شود و بدون سرور هم کامل کار می‌کند.

## حساب‌های نمونه (Seed)

| نقش | ایمیل | رمز |
|---|---|---|
| ادمین | `admin@ratbesho.ir` | `admin1405` |
| دانش‌آموز | `negar@test.ir` | `123456` |

## Endpoints

| Method | مسیر | توضیح | نیاز به ورود |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | ثبت‌نام | — |
| POST | `/api/v1/auth/login` | ورود (ایمیل یا موبایل) | — |
| GET | `/api/v1/auth/me` | کاربر جاری | ✓ |
| GET | `/api/v1/content` | محتوای سایت (CMS) | — |
| PUT | `/api/v1/content` | ذخیرهٔ محتوا | ادمین |
| GET | `/api/v1/reservations` | رزروهای مشاوره | ✓ |
| POST | `/api/v1/reservations` | ثبت رزرو | ✓ |
| PATCH | `/api/v1/reservations/:id` | تغییر وضعیت | ادمین |
| GET | `/api/v1/orders` | سفارش‌ها | ✓ |
| POST | `/api/v1/orders` | ثبت سفارش (سبد) | ✓ |
| PATCH | `/api/v1/orders/:id` | تغییر وضعیت | ادمین |
| GET | `/api/v1/messages` | پیام‌های پشتیبانی | ادمین |
| POST | `/api/v1/messages` | ارسال پیام | — |
| PATCH/DELETE | `/api/v1/messages/:id` | خواندن / حذف | ادمین |
| GET/PUT | `/api/v1/activity` | وضعیت داشبورد | ✓ |
| POST | `/api/v1/newsletter` | عضویت خبرنامه | — |

## دیتابیس

فایل SQLite به‌صورت خودکار در `server/data/ratbesho.db` ساخته و seed می‌شود.
برای مقیاس بزرگ، `server/src/db.js` را با PostgreSQL/Prisma جایگزین کن — امضای توابع ثابت است.

## امنیت

- رمزها با **bcrypt** هش می‌شوند.
- نشست‌ها با **JWT** (توکن ۷ روزه) مدیریت می‌شوند.
- اعتبارسنجی ورودی‌ها با **zod**.
- دسترسی ادمین با middleware جداگانه کنترل می‌شود.
