/**
 * کلاینت HTTP فرانت‌اند
 * ─────────────────────
 * اگر متغیر محیطی VITE_API_BASE_URL تنظیم شده باشد (مثلاً در فایل .env):
 *     VITE_API_BASE_URL=http://localhost:4000/api/v1
 * همهٔ درخواست‌ها به سرور Node.js واقعی فرستاده می‌شوند.
 * در غیر این صورت، api در «حالت دمو» از موتور محلی (localStorage) استفاده می‌کند
 * تا سایت بدون بک‌اند هم کاملاً کار کند.
 */
const BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "").replace(/\/+$/, "");

/** آیا به بک‌اند واقعی وصل هستیم؟ */
export const REMOTE = BASE.length > 0;

const TOKEN_KEY = "ratbesho-token-v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const http = {
  token(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(t: string) {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch { /* noop */ }
  },
  clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch { /* noop */ }
  },

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = http.token();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(0, "اتصال به سرور برقرار نشد؛ اتصال اینترنت یا آدرس بک‌اند را بررسی کن");
    }

    let data: unknown = null;
    try {
      data = await res.json();
    } catch { /* empty body */ }

    if (!res.ok) {
      const rec = data as Record<string, unknown> | null;
      const message =
        rec && typeof rec.message === "string" ? rec.message : `خطای سرور (${String(res.status)})`;
      if (res.status === 401) http.clearToken();
      throw new ApiError(res.status, message);
    }
    return data as T;
  },

  get: <T>(path: string) => http.request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => http.request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => http.request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => http.request<T>("PATCH", path, body),
  del: <T>(path: string) => http.request<T>("DELETE", path),
};
