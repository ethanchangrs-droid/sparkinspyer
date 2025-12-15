/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_DOMAIN: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_BAIDU_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

