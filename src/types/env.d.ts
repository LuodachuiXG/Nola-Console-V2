/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 基地址（用于在开发环境使用绝对地址，生产环境使用相对地址） */
  readonly VITE_BASE_URL: string;
  /** 加密秘钥 */
  readonly VITE_ENCRYPTION_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
