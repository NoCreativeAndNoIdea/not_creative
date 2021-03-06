/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_DEFAULT_LOCALE: string
  readonly VITE_FALLBACK_LOCALE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
