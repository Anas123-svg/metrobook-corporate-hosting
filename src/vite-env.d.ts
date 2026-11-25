/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_API_URL?: string;
  readonly NEXT_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_GOOGLE_MAP_API_KEY?: string;
  readonly VITE_GOOGLE_MAP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
