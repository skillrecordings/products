declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GITHUB_ID: string
    GITHUB_SECRET: string
    GOOGLE_ID: string
    GOOGLE_SECRET: string
    HASURA_PROJECT_ENDPOINT: string
    HASURA_ADMIN_SECRET: string
    POSTMARK_KEY: string
    STRIPE_SECRET_TOKEN: string
    STRIPE_WEBHOOK_SECRET: string
  }
}
