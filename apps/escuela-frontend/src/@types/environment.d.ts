declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    POSTMARK_KEY: string
    SANITY_WEBHOOK_SECRET: string
    EMAIL_SERVER: string
    EMAIL_SERVER_HOST: string
    EMAIL_SERVER_PORT: number
    NEXT_PUBLIC_URL: string
    EMAIL_FROM: string
    DATABASE_URL: string
    SHADOW_DATABASE_URL: string
  }
}
