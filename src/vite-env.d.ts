/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** آدرس بک‌اند — مثال: https://api.ratbesho.ir/api/v1 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
