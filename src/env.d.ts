/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONVERTKIT_API_KEY: string;
  readonly PUBLIC_CONVERTKIT_FORM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
